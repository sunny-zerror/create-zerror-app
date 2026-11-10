/**
 * npm test — generates each template into a temp folder (no install, no git) and checks
 * that every placeholder was filled and the dotfiles were restored. Catches a broken
 * template before it's published; `npm run build` inside a generated project is the full check.
 */
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { TEMPLATES, scaffold } from "../lib/scaffold.mjs";

const root = mkdtempSync(join(tmpdir(), "create-zerror-app-"));
let failed = false;

// A CRLF shebang ("node\r") runs fine on Windows but won't start on macOS/Linux
if (readFileSync(new URL("../index.mjs", import.meta.url), "utf8").split("\n")[0].endsWith("\r")) {
  failed = true;
  console.error("✖ index.mjs has a CRLF shebang — convert it to LF line endings before publishing");
} else console.log("✔ shebang");

try {
  for (const template of Object.keys(TEMPLATES)) {
    const name = `Smoke Test ${template}`;
    try {
      const { target, slug } = scaffold({ template, name, dir: join(root, template), install: false, git: false });
      const missing = [".gitignore", ".env.example", ".env.local", ".prettierrc.json", "package.json", "src"].filter(
        (file) => !existsSync(join(target, file)),
      );
      const pkg = JSON.parse(readFileSync(join(target, "package.json"), "utf8"));
      if (missing.length) throw new Error(`missing ${missing.join(", ")}`);
      if (pkg.name !== slug) throw new Error(`package.json name is "${pkg.name}", expected "${slug}"`);
      console.log(`✔ ${template}`);
    } catch (error) {
      failed = true;
      console.error(`✖ ${template}: ${error.message}`);
    }
  }
} finally {
  rmSync(root, { recursive: true, force: true });
}

process.exit(failed ? 1 : 0);
