# create-zerror-app

Starts a new Zerror project on Next.js (App Router, Tailwind v4, GSAP + Lenis, SEO built in) in one command:

```bash
npm create zerror-app@latest
```

It asks two things — the project name and what you're building — then creates the folder, installs dependencies and makes the first git commit.

```
┌  create-zerror-app
◇  Project name?
│  Sava Beauty
◇  What are you building?
│  ● Z-Com store      z-commerce storefront · TypeScript
│  ○ Frontend site    brand, portfolio or landing site · JavaScript
└  ./sava-beauty is ready → cd sava-beauty && npm run dev
```

| Template | Language | What you get |
| --- | --- | --- |
| `zcom` | TypeScript | Storefront wired to the z-commerce GraphQL API: shop, product pages, cart drawer, login/signup, account, Nimbbl checkout, order confirmation. Runs on a demo catalogue until `.env.local` is filled. |
| `frontend` | JavaScript | Brand, portfolio or landing site: home, about, contact (nodemailer), and one `src/config/site.js` that drives SEO, JSON-LD, sitemap, robots, llms.txt, manifest and social cards. |

Needs Node.js 20.12 or newer.

## Without the questions

Pass the name and template to skip the questions, which is handy for scripts and Claude:

```bash
npx create-zerror-app@latest "Sava Beauty" --template zcom --currency INR
npx create-zerror-app@latest "Studio Akto" --template frontend --type ProfessionalService
```

With `npm create`, put the options after `--`: `npm create zerror-app@latest "Sava Beauty" -- --template zcom`.

| Option | Template | Default |
| --- | --- | --- |
| `--template zcom\|frontend` | both | asked |
| `--dir <folder>` | both | the name as a folder (`sava-beauty`) |
| `--no-install` / `--no-git` | both | installs and commits |
| `--tagline "<line>"` | both | a placeholder line |
| `--site-url <url>` | both | `http://localhost:3000` |
| `--currency <code>` | zcom | `INR` |
| `--graphql-url`, `--backend-url`, `--db-token` | zcom | empty → demo catalogue |
| `--description "<text>"` | frontend | built from the tagline |
| `--type <SchemaType>` | frontend | `Organization` |

It never writes into a folder that already has files in it, and it skips the git commit when the folder is inside an existing repo.

## Working on the templates

The templates live in `templates/zcom` and `templates/frontend`. Placeholders such as `__PROJECT_NAME__`, `__PROJECT_SLUG__` and `__CURRENCY__` are filled in by `lib/scaffold.mjs`. Dotfiles are stored without the leading dot (`gitignore`, `env.example`, `prettierrc.json`…) because npm drops `.gitignore` files when it publishes; the scaffolder puts the dot back.

Keep Prettier away from the templates' Markdown — it turns `__PROJECT_NAME__` into bold `**PROJECT_NAME**`, and the scaffolder refuses to finish if it finds one.

After changing a template:

```bash
npm test                         # generates both templates and checks every placeholder was filled
npm pack                         # then try the real thing from the tarball:
npx --package=./create-zerror-app-<version>.tgz create-zerror-app "Test Store" --template zcom
cd test-store && npm run check && npm run build
```

## Releasing

```bash
npm version patch                # 0.1.0 → 0.1.1 (minor for new features, major for breaking changes)
git push --follow-tags
npm publish
```
