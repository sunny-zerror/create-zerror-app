/**
 * Copies a template from ../templates into a new folder and fills it in for one brand.
 *
 * Both templates share the copy → rename dotfiles → fill placeholders → .env.local →
 * install → git steps; what differs (placeholders, env keys, summary) lives in TEMPLATES.
 */
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const TEMPLATES_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "../templates");

/** A problem with the user's input — shown as a one-line error, not a stack trace. */
export class ScaffoldError extends Error {}

export const NAME_PATTERN = /^[\p{L}\p{N}][\p{L}\p{N} .'&-]{0,48}$/u;

export function validateName(name) {
  if (!NAME_PATTERN.test(name.trim())) return "Use 1–49 letters or digits (spaces, . ' & - allowed).";
}

export function slugify(name) {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** True when the folder can't be scaffolded into: it exists and has something in it. */
export function isOccupied(dir) {
  return existsSync(dir) && (!statSync(dir).isDirectory() || readdirSync(dir).length > 0);
}

function siteUrl(options) {
  const url = (options["site-url"] || "http://localhost:3000").trim().replace(/\/+$/, "");
  if (!/^https?:\/\/[^\s]+$/.test(url)) throw new ScaffoldError(`--site-url "${url}" must start with http:// or https://.`);
  return url;
}

export const TEMPLATES = {
  zcom: {
    label: "Z-Com store",
    hint: "z-commerce storefront · TypeScript",
    fallbackSlug: "storefront",
    commitMessage: "chore: scaffold storefront from create-zerror-app",
    prepare(name, options) {
      const currency = (options.currency || "INR").trim().toUpperCase();
      if (!/^[A-Z]{3}$/.test(currency)) throw new ScaffoldError(`--currency "${currency}" must be a 3-letter ISO code like INR or USD.`);
      const connected = Boolean(options["graphql-url"] && options["db-token"]);
      return {
        values: {
          __PROJECT_TAGLINE__: (options.tagline || "Thoughtfully made, delivered to your door").trim(),
          __PROJECT_INITIAL__: [...name][0].toUpperCase(),
          __CURRENCY__: currency,
        },
        env: {
          NEXT_PUBLIC_SITE_URL: siteUrl(options),
          NEXT_PUBLIC_GRAPHQL_API_URL: options["graphql-url"] || "",
          NEXT_PUBLIC_BACKEND_ENDPOINT: options["backend-url"] || "",
          NEXT_PUBLIC_DB_TOKEN: options["db-token"] || "",
        },
        details: [
          ["currency", currency],
          ["data source", connected ? "z-commerce (from .env.local)" : "demo catalogue until .env.local is filled"],
        ],
        todo: connected
          ? "Brand details live in src/config/site.ts."
          : "Fill the z-commerce values in .env.local, then the brand in src/config/site.ts.",
      };
    },
  },

  frontend: {
    label: "Frontend site",
    hint: "brand, portfolio or landing site · JavaScript",
    fallbackSlug: "website",
    commitMessage: "chore: scaffold site from create-zerror-app",
    prepare(name, options) {
      const type = (options.type || "Organization").trim();
      if (!/^[A-Z][A-Za-z]+$/.test(type)) {
        throw new ScaffoldError(`--type "${type}" must be a schema.org type like Organization, LocalBusiness or Person.`);
      }
      const tagline = (options.tagline || `A short line on what ${name} does`).trim();
      return {
        values: {
          __PROJECT_TAGLINE__: tagline,
          __PROJECT_DESCRIPTION__: (options.description || `${name} — ${tagline}.`).trim(),
          __ENTITY_TYPE__: type,
          // Rough width of the placeholder wordmark in public/logo.svg (30px serif text)
          __LOGO_WIDTH__: String(Math.ceil([...name].length * 30 * 0.62) + 4),
        },
        env: { NEXT_PUBLIC_SITE_URL: siteUrl(options) },
        details: [["schema type", type]],
        todo: "Fill in src/config/site.js — every page, the SEO, structured data, sitemap and llms.txt follow it.",
      };
    },
  },
};

// Dotfiles are stored without the dot: npm drops .gitignore from published packages
const DOTFILES = {
  gitignore: ".gitignore",
  gitattributes: ".gitattributes",
  "env.example": ".env.example",
  "prettierrc.json": ".prettierrc.json",
  prettierignore: ".prettierignore",
};

const jsonExt = new Set([".json"]);
const codeExt = new Set([".js", ".jsx", ".mjs", ".ts", ".tsx"]);
const xmlExt = new Set([".svg"]);
const textExt = new Set([...jsonExt, ...codeExt, ...xmlExt, ".md", ".css", ".example", ""]);

function escapeFor(ext, value) {
  // Safe inside "…" strings; code also escapes ` and ${ so template literals stay intact
  if (jsonExt.has(ext)) return JSON.stringify(value).slice(1, -1);
  if (codeExt.has(ext)) return JSON.stringify(value).slice(1, -1).replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
  if (xmlExt.has(ext)) return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return value;
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next" || entry === ".git") continue;
    const path = join(dir, entry);
    statSync(path).isDirectory() ? walk(path, out) : out.push(path);
  }
  return out;
}

// Also catches placeholders a Markdown formatter has turned into **bold**
const LEFTOVER = /(__|\*\*)(PROJECT|ENTITY|LOGO)_[A-Z]+(__|\*\*)|__CURRENCY__/;

/**
 * @param {object} args
 * @param {"zcom" | "frontend"} args.template
 * @param {string} args.name     Brand name, e.g. "Sava Beauty"
 * @param {string} [args.dir]    Target folder; defaults to the name's slug in the current folder
 * @param {Record<string, string>} [args.options]  Template extras (tagline, currency, site-url…)
 * @param {boolean} [args.install]
 * @param {boolean} [args.git]
 */
export function scaffold({ template, name, dir, options = {}, install = true, git = true }) {
  const spec = TEMPLATES[template];
  if (!spec) throw new ScaffoldError(`Unknown template "${template}". Use ${Object.keys(TEMPLATES).join(" or ")}.`);

  name = name.trim();
  const nameError = validateName(name);
  if (nameError) throw new ScaffoldError(`"${name}": ${nameError}`);

  const slug = slugify(name) || spec.fallbackSlug;
  const target = resolve(dir || slug);
  if (isOccupied(target)) throw new ScaffoldError(`${target} already exists and isn't empty. Pick another name or --dir.`);

  const source = join(TEMPLATES_DIR, template);
  if (!existsSync(source)) throw new ScaffoldError(`Template not found at ${source}.`);

  // Validate everything before touching the disk
  const { values, env, details, todo } = spec.prepare(name, options);
  const placeholders = { __PROJECT_NAME__: name, __PROJECT_SLUG__: slug, ...values };

  // ---------- copy -------------------------------------------------------------------
  mkdirSync(target, { recursive: true });
  cpSync(source, target, { recursive: true });
  for (const [from, to] of Object.entries(DOTFILES)) {
    const path = join(target, from);
    if (existsSync(path)) renameSync(path, join(target, to));
  }

  // ---------- fill placeholders --------------------------------------------------------
  const leftovers = [];
  for (const file of walk(target)) {
    const ext = extname(file);
    if (!textExt.has(ext)) continue;
    let content = readFileSync(file, "utf8");
    if (content.includes("__")) {
      for (const [token, value] of Object.entries(placeholders)) content = content.split(token).join(escapeFor(ext, value));
      writeFileSync(file, content);
    }
    if (LEFTOVER.test(content)) leftovers.push(relative(target, file));
  }
  if (leftovers.length) throw new ScaffoldError(`Unfilled placeholders in: ${leftovers.join(", ")}`);

  // ---------- .env.local -----------------------------------------------------------------
  let envFile = readFileSync(join(target, ".env.example"), "utf8");
  for (const [key, value] of Object.entries(env)) {
    // A function replacement, so a "$" in a token isn't read as a capture group
    envFile = envFile.replace(new RegExp(`^${key}=.*$`, "m"), () => `${key}=${value}`);
  }
  writeFileSync(join(target, ".env.local"), envFile);

  // ---------- install -------------------------------------------------------------------
  let installed = false;
  if (install) {
    // npm is a .cmd shim on Windows, which needs a shell; one fixed command string, no user input
    console.log("\n$ npm install");
    installed = spawnSync("npm install --no-audit --no-fund", { cwd: target, stdio: "inherit", shell: true }).status === 0;
    if (!installed) console.warn("\n⚠ npm install failed — run it manually in the project folder.");
  }

  // A long name or a quote in the tagline can reflow a line; let the project's own Prettier
  // settle it so `npm run check` passes from the first commit. Templates are already formatted.
  if (installed && spawnSync("npm run format --silent", { cwd: target, stdio: "ignore", shell: true }).status !== 0) {
    console.warn("\n⚠ npm run format failed — run it in the project folder before committing.");
  }

  // ---------- git -----------------------------------------------------------------------
  let gitStatus = "skipped";
  if (git) {
    const probe = spawnSync("git", ["rev-parse", "--is-inside-work-tree"], { cwd: target, encoding: "utf8" });
    if (probe.error) gitStatus = "skipped — git isn't installed";
    else if (probe.stdout.trim() === "true") gitStatus = "skipped — already inside a git repo";
    else {
      // git is a real executable: spawn it directly so arguments with spaces stay intact
      const run = (...args) => spawnSync("git", args, { cwd: target, stdio: "inherit" }).status === 0;
      const ok = run("init", "-q", "-b", "main") && run("add", "-A") && run("commit", "-q", "-m", spec.commitMessage);
      gitStatus = ok ? "first commit on main" : "didn't finish — check git is configured";
    }
  }

  return {
    target,
    slug,
    label: spec.label,
    details: [
      ["package name", slug],
      ...details,
      ["dependencies", installed ? "installed" : "not installed — run npm install"],
      ["git", gitStatus],
    ],
    installed,
    todo,
  };
}
