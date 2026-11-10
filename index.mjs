#!/usr/bin/env node
/**
 * create-zerror-app — starts a new Zerror project from one of the house templates.
 *
 *   npm create zerror-app@latest           asks for the project name and what you're building
 *   npx create-zerror-app@latest "Brand Name" --template zcom|frontend [options]   (see --help)
 *
 * zcom is a z-commerce storefront in TypeScript; frontend is a brand/portfolio site in JavaScript.
 */
import { readFileSync } from "node:fs";
import { isAbsolute, relative, resolve } from "node:path";
import * as p from "@clack/prompts";
import { ScaffoldError, TEMPLATES, isOccupied, scaffold, slugify, validateName } from "./lib/scaffold.mjs";

const { version } = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8"));

const USAGE = `
Usage
  npm create zerror-app@latest
  npx create-zerror-app@latest ["Brand Name"] [options]

Options
  --template zcom|frontend   skip the "what are you building?" question
  --dir <folder>             where to create it (default: the name as a folder, e.g. sava-beauty)
  --no-install               don't run npm install
  --no-git                   don't make the first git commit
  --tagline "<line>"         one short brand line
  --site-url <url>           production URL (default http://localhost:3000)

  zcom only
  --currency <code>          3-letter ISO code (default INR)
  --graphql-url <url>        z-commerce GraphQL endpoint
  --backend-url <url>        z-commerce REST base, used after payment
  --db-token <token>         the store's dbtoken from the z-commerce admin

  frontend only
  --description "<text>"     ~150 characters: what the brand is, does and where
  --type <SchemaType>        Organization (default), LocalBusiness, Person, OnlineStore…

Leave the z-commerce values out and the store runs on a demo catalogue until .env.local is filled.
`;

// ---------- args -----------------------------------------------------------------------
const VALUE_OPTIONS = new Set([
  "name",
  "template",
  "dir",
  "tagline",
  "site-url",
  "currency",
  "graphql-url",
  "backend-url",
  "db-token",
  "description",
  "type",
]);
// --install and --git are the defaults; still accepted so older commands keep working
const BOOLEAN_FLAGS = new Set(["install", "no-install", "git", "no-git", "help", "version"]);

const positionals = [];
const opts = {};
const flags = new Set();
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  const arg = argv[i];
  if (arg === "-h") flags.add("help");
  else if (arg === "-v") flags.add("version");
  else if (!arg.startsWith("--")) positionals.push(arg);
  else {
    const [key, inline] = arg.slice(2).split(/=(.*)/s);
    if (BOOLEAN_FLAGS.has(key)) flags.add(key);
    else if (!VALUE_OPTIONS.has(key)) fail(`Unknown option --${key}. Run with --help to see the options.`);
    else if (inline !== undefined) opts[key] = inline;
    else if (argv[i + 1] !== undefined && !argv[i + 1].startsWith("--")) opts[key] = argv[++i];
    else fail(`--${key} needs a value.`);
  }
}

if (flags.has("help")) {
  console.log(USAGE);
  process.exit(0);
}
if (flags.has("version")) {
  console.log(version);
  process.exit(0);
}

function fail(message) {
  p.cancel(message);
  process.exit(1);
}

function exitIfCancelled(value) {
  if (p.isCancel(value)) {
    p.cancel("Cancelled — nothing was created.");
    process.exit(0);
  }
}

// ---------- questions -------------------------------------------------------------------
p.intro(`create-zerror-app v${version}`);

let name = positionals[0] ?? opts.name;
let template = opts.template;

if (name && validateName(name)) fail(`"${name}": ${validateName(name)}`);
if (template !== undefined && !TEMPLATES[template]) {
  fail(`Unknown template "${template}". Use ${Object.keys(TEMPLATES).join(" or ")}.`);
}
if ((!name || !template) && !process.stdin.isTTY) {
  fail(`Missing ${name ? "--template" : "the project name"}. Without a terminal, pass both: create-zerror-app "Brand Name" --template zcom`);
}

if (!name) {
  name = await p.text({
    message: "Project name?",
    placeholder: "Sava Beauty",
    validate(value = "") {
      const error = validateName(value);
      if (error) return error;
      const slug = slugify(value);
      if (!opts.dir && slug && isOccupied(resolve(slug))) return `./${slug} already exists — pick another name.`;
    },
  });
  exitIfCancelled(name);
}

if (!template) {
  template = await p.select({
    message: "What are you building?",
    options: Object.entries(TEMPLATES).map(([value, { label, hint }]) => ({ value, label, hint })),
  });
  exitIfCancelled(template);
}

// The prompts leave stdin's handle open; without this the process can sit there after the last line
process.stdin.unref?.();

// ---------- scaffold ---------------------------------------------------------------------
p.log.step(`Creating ${TEMPLATES[template].label} "${name.trim()}"`);

let result;
try {
  result = scaffold({
    template,
    name,
    dir: opts.dir,
    options: opts,
    install: !flags.has("no-install"),
    git: !flags.has("no-git"),
  });
} catch (error) {
  if (error instanceof ScaffoldError) fail(error.message);
  throw error;
}

// ---------- summary ----------------------------------------------------------------------
const rows = [["folder", result.target], ...result.details];
const width = Math.max(...rows.map(([key]) => key.length));
p.note(rows.map(([key, value]) => `${key.padEnd(width)}  ${value}`).join("\n"), `${result.label} ready`);

const rel = relative(process.cwd(), result.target);
const cdPath = rel && !rel.startsWith("..") && !isAbsolute(rel) ? rel : result.target;
p.note(
  [`cd ${/\s/.test(cdPath) ? `"${cdPath}"` : cdPath}`, ...(result.installed ? [] : ["npm install"]), "npm run dev", "", result.todo].join(
    "\n",
  ),
  "Next steps",
);
p.outro("Happy building.");
