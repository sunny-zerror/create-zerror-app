# __PROJECT_NAME__ — working notes for Claude

Next.js App Router · JavaScript (no TypeScript) · Tailwind CSS v4 · Lenis · GSAP. Created from Zerror's frontend-project-setup starter; `README.md` maps the folders.

## Rules

- **Brand data lives in `src/config/site.js`.** Never hard-code the brand name, contact details, URLs or social links in components — read `siteConfig`. A new page goes into `siteRoutes`, which feeds its metadata, the sitemap, llms.txt, breadcrumbs and (with `nav: true`) the menus.
- **Pages stay thin.** `src/app/**/page.js` exports `metadata` (`createPageMetadata(path)`, or `createMetadata({ … })` from `generateMetadata` on dynamic routes), renders `<JsonLd data={pageSchema(path)} />` and lists its sections. Markup lives in `src/components/sections/<page>/<Page><Section>.jsx`, exported from that folder's `index.js`. Shared pieces go in `components/ui/`.
- **Server Components by default.** Add `"use client"` only for state, effects or browser APIs — never just to animate.
- **Styling.** Use the tokens and classes from `globals.css` and `fonts.css`: `container`, `section`, `padding`, `px-gutter`, `py-section`, `mt-stack`, `gap-grid`, `pt-page`, `text-ink`, `bg-surface`, `text-body`, `text-eyebrow`, `.h1`–`.h6`… Don't hard-code colours, font sizes or one-off spacing — add a token. One `h1` per page and headings in order. Custom CSS uses the 48rem (`md`) breakpoint. No new CSS files.
- **Fonts.** woff2 files in `public/fonts/<family>/`, declared once in `fonts.css` (one family name, a block per weight, `font-display: swap`).
- **Animation.** Prefer the data attributes: `data-heading-effect`, `data-para-effect`, `data-img-effect`, `data-reveal` (`="stagger"`, `="fade"`), `data-parallax`. Custom GSAP: import from `@/lib/gsap` only, inside `useGSAP` with a `scope`, wrapped in `gsap.matchMedia()` for `prefers-reduced-motion: no-preference`. Lenis is `window.lenis`: overlays that scroll need `data-lenis-prevent` and should `stop()` it while open. Route-change scrolling and `ScrollTrigger.refresh()` already happen in `LenisScroll` — don't add more.
- **Links.** Internal: `Link` from `next-view-transitions` (page transitions). External: `<a target="_blank" rel="noopener noreferrer">`. `Button` picks the right one from `href`; menus use `NavLink`, which also glides to `#section` anchors on the current page.
- **Media.** Images in `public/images/<page>/`, videos in `public/videos/<page>/`. Render images with `next/image` and a meaningful `alt`.
- **Content lists** (services, FAQs, projects, team, testimonials) go in `src/data/`, not in components or `store/`.
- **SEO.** Whatever the structured data says must also be visible on the page — pass on-page FAQs to `pageSchema(path, { faqs })`. Dynamic routes add their URLs to `src/app/sitemap.js` and call `pageSchema(path, { title, description, crumbs })`. Hidden pages: `noIndex: true`.
- **Secrets.** Server-only env vars (SMTP, API keys) never get the `NEXT_PUBLIC_` prefix.

## Before finishing a change

Run `npm run lint` and `npm run build` and fix what they report; `npm run format` tidies the code.
