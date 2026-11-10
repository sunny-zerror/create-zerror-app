# __PROJECT_NAME__

Website for __PROJECT_NAME__, built on Next.js (App Router), JavaScript, Tailwind CSS v4, Lenis and GSAP.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build — run it before every deploy
npm run check    # lint + formatting
```

## Change the brand in one place

`src/config/site.js` is the single source of truth: name, tagline, description, summary, contact details, address, socials, colours, the brand facts under `entity`, and the list of pages (`siteRoutes`). It feeds:

- every page's `<title>`, meta description, canonical URL and social cards (`src/lib/seo.js`)
- the JSON-LD structured data Google and AI assistants read (`src/lib/schema.js`)
- `sitemap.xml`, `robots.txt`, `llms.txt`, the web manifest, favicon, apple icon and social card
- the header, mobile menu and footer links, and the contact details on the pages

Empty values are hidden on the live site and show as dashed hints in development.

## Folder structure

```
public/
  fonts/<family>/          brand fonts (.woff2), declared in src/styles/fonts.css
  icons/                   SVG icons that aren't in Remix Icon
  images/<page>/           images per page (home/, about/, contact/); common/ for shared ones
  videos/<page>/           background films (.mp4, H.264, muted)
  logo.svg                 the brand logo: header, footer and Google's knowledge panel
src/
  app/                     routes — each page.js sets its metadata and lists its sections
    layout.js              <html>, global CSS, site-wide JSON-LD, SiteLayout
    page.js                home
    about/, contact/       pages
    api/contact/           contact form → email
    icon.js, apple-icon.js generated favicon and home-screen icon (swap for the real files)
    og/                    generated 1200×630 social card
    robots.js, sitemap.js, manifest.js, llms.txt/   generated from site.js
    not-found.js, error.js
  components/
    layout/                SiteLayout, Header, MobileMenu, Footer, Logo
    sections/<page>/       one folder per page, one file per section (HomeHero, HomeServices…)
    ui/                    Button, NavLink, SectionHeading, SocialLinks, DevHint
    animation/             GlobalAnimations: scroll animations switched on by data attributes
    providers/             Providers, LenisScroll
    seo/                   JsonLd
  config/site.js           ← the brand
  data/                    content lists: services.js, faqs.js (add projects.js, team.js…)
  hooks/                   custom hooks
  lib/                     seo.js, schema.js, gsap.js
  styles/                  globals.css (tokens, layout classes) and fonts.css (typography)
  utils/                   url.js, format.js, cn.js
```

## Add a page

1. Add it to `siteRoutes` in `src/config/site.js` — `nav: true` puts it in the menus.
2. Create `src/components/sections/<page>/` with one file per section and an `index.js`.
3. Create `src/app/<page>/page.js`:

```jsx
import { ServicesHero, ServicesList } from "@/components/sections/services";
import JsonLd from "@/components/seo/JsonLd";
import { pageSchema } from "@/lib/schema";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata("/services");

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={pageSchema("/services")} />
      <ServicesHero />
      <ServicesList />
    </>
  );
}
```

Its title, description, canonical URL, breadcrumbs, sitemap entry and llms.txt line follow from `siteRoutes`.

## Design system

`src/styles/fonts.css` holds the `@font-face` rules, font families, the root size every `rem` scales from, the h1–h6 sizes (mobile and desktop) and the text styles. `src/styles/globals.css` holds the colours, spacing rhythm, container width, page defaults and layout classes.

- **Headings:** `h1`–`h6` (one `h1` per page). Borrow a size with `.h1`–`.h6` or `text-h1`…`text-h6`.
- **Text:** `text-body-lg`, `text-body`, `text-caption`, `text-eyebrow`, `text-cta`; families `primary-font` / `secondary-font`.
- **Layout:** `container` (centred, max width, side gutters), `section` (vertical rhythm), `padding` (side gutters only), `center`, `cover`, `no-scrollbar`.
- **Spacing tokens:** `px-gutter`, `py-section`, `mt-stack`, `gap-grid`, `h-header`, and `pt-page` for a page's first section under the fixed header.
- **Colours:** `ink`, `paper`, `muted`, `line`, `surface`, `accent`, `error` — as `text-*`, `bg-*`, `border-*`.
- **Breakpoint:** custom CSS switches at 48rem (768px), Tailwind's `md`.

### Brand fonts

1. Put the `.woff2` files in `public/fonts/<family>/`.
2. Uncomment and fill the `@font-face` blocks at the top of `src/styles/fonts.css`.
3. Name the families first in `--font-primary` (headings) and `--font-secondary` (body).

## Animations

Add a data attribute; no animation code needed in the section (`src/components/animation/GlobalAnimations.jsx`):

- `data-heading-effect` — the heading's lines rise out of a mask
- `data-para-effect` — the same for paragraphs, quicker
- `data-img-effect` — on an image's frame: it opens upward while the image settles from a zoom
- `data-reveal` — fades up; `data-reveal="stagger"` does its children one by one; `data-reveal="fade"` is opacity only
- `data-parallax="0.15"` — an image drifts with the scroll inside an overflow-hidden frame

For custom timelines, import from `@/lib/gsap` (never from `gsap` directly) and use `useGSAP` with a scope. Smooth scrolling is Lenis (`window.lenis`); panels that scroll on their own need `data-lenis-prevent`.

## SEO and AI search

Built in: per-page metadata and canonical URLs, social cards, JSON-LD (the brand, the website, each page, breadcrumbs, the FAQ), `sitemap.xml`, a `robots.txt` that welcomes search and AI crawlers, `llms.txt`, the manifest, favicon and social card.

### Launch checklist

- [ ] `src/config/site.js`: real description and summary, entity facts (founded, founders, area served, expertise), contact, address, socials, other profiles in `entity.sameAs`
- [ ] `src/data/services.js` and `src/data/faqs.js`: real content
- [ ] `public/logo.svg`; favicon — replace `src/app/icon.js` and `apple-icon.js` with `icon.png` (or `.svg`), `apple-icon.png` and `favicon.ico`
- [ ] A designed social card: `public/og.jpg` (1200×630), then `ogImage: "/og.jpg"`
- [ ] Brand fonts and colours (`fonts.css`, `globals.css`, `siteConfig.colors`)
- [ ] Env vars on the host: `NEXT_PUBLIC_SITE_URL`, SMTP settings, verification codes (see `.env.example`)
- [ ] Google Search Console: verify, submit `/sitemap.xml`, request indexing of the home page
- [ ] Bing Webmaster Tools: verify and submit the sitemap (Bing's index also feeds ChatGPT and Copilot)
- [ ] Local brands: a Google Business Profile with the same name, address and phone, linked in `entity.sameAs`
- [ ] Check the home page at https://search.google.com/test/rich-results and https://validator.schema.org
