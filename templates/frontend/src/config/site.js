/*
 * site.js — the one file to edit for a new brand.
 *
 * Everything here feeds the whole site: page titles and descriptions, social cards, the
 * JSON-LD structured data Google and AI assistants read about the brand, sitemap.xml,
 * robots.txt, llms.txt, the web manifest, the generated favicon and OG image, the header
 * and footer menus, and every contact detail shown on the pages.
 *
 * Empty values are fine: they're left out of the markup and hidden on the live site
 * (in development they show as a dashed "add this" hint).
 */

// Production URL: NEXT_PUBLIC_SITE_URL, else the Vercel production domain, else local dev
const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000");

export const siteConfig = {
  // ---------- Brand ---------------------------------------------------------------
  name: "__PROJECT_NAME__",
  /** Registered company name, when it differs from the brand name */
  legalName: "__PROJECT_NAME__",
  /** Other names people search for — short forms, old names, "Brand Studio" — so Google ties them to this site */
  alternateNames: [],
  tagline: "__PROJECT_TAGLINE__",
  /**
   * ~150 characters: what the brand is, what it offers, where. The default meta description,
   * social card text and schema description.
   */
  description: "__PROJECT_DESCRIPTION__",
  /**
   * The answer you want Google's AI Overview (or ChatGPT) to give for "what is <brand>":
   * who, what, for whom, where, since when. Plain facts, 2–4 sentences, no slogans.
   * Shown on the home and about pages and in llms.txt.
   */
  summary: "__PROJECT_DESCRIPTION__",

  url: siteUrl,
  locale: "en_IN", // Open Graph locale
  language: "en-IN", // <html lang> and schema inLanguage

  // ---------- Assets --------------------------------------------------------------
  /** Header, footer and the logo Google shows in the brand's knowledge panel */
  logo: "/logo.svg",
  /** 1200×630 social card. "/og" is drawn from this file (src/app/og/route.js); a designed one: public/og.jpg → "/og.jpg" */
  ogImage: "/og",
  /** For the generated favicon, apple icon and social card, and the browser bar — match globals.css */
  colors: {
    background: "#ffffff", // --color-paper
    foreground: "#111111", // --color-ink
    accent: "#b08d57", // --color-accent
  },

  // ---------- SEO -----------------------------------------------------------------
  keywords: ["__PROJECT_NAME__"],
  /** "@handle" for X / Twitter cards */
  twitterHandle: "",

  // ---------- Entity: what search engines and AI assistants learn about the brand ----
  entity: {
    /**
     * schema.org type:
     *   "Organization"        a company or brand
     *   "LocalBusiness"       a place customers visit — or a subtype: "ProfessionalService",
     *                         "Restaurant", "Store", "HealthAndBeautyBusiness", "RealEstateAgent"…
     *   "OnlineStore"         sells online
     *   "Person"              a personal portfolio (name = the person)
     */
    type: "__ENTITY_TYPE__",
    /** Person: their role, e.g. "Product designer" */
    jobTitle: "",
    /** Person: where they work — ties the person to the company in Google's eyes */
    worksFor: { name: "", url: "" },
    /** A photo for the brand — Person: a portrait; LocalBusiness: the storefront. e.g. "/images/about/portrait.jpg" */
    image: "",
    foundingDate: "", // "2021" or "2021-04-15"
    /** [{ name: "Jane Doe", jobTitle: "Founder", sameAs: ["https://www.linkedin.com/in/…"] }] */
    founders: [],
    areaServed: [], // ["Mumbai", "India"] or ["Worldwide"]
    /** Topics the brand is an authority on: ["Interior design", "Residential architecture"] */
    knowsAbout: [],
    // LocalBusiness only
    priceRange: "", // "₹₹"
    openingHours: [], // ["Mo-Fr 10:00-19:00", "Sa 10:00-14:00"]
    geo: { latitude: "", longitude: "" },
    /**
     * Other profiles of the same brand: Google Business Profile, Wikipedia, Wikidata,
     * Crunchbase, Behance… (the social links below are added automatically)
     */
    sameAs: [],
  },

  // ---------- Contact -------------------------------------------------------------
  contact: {
    email: "",
    phone: "", // international format: "+91 98765 43210"
    whatsapp: "", // digits with country code: "919876543210"
    hours: "", // "Mon–Sat, 10:00–19:00 IST"
  },
  address: {
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "IN", // ISO code
  },
  /** Google Maps link to the address */
  mapUrl: "",

  socials: {
    instagram: "",
    linkedin: "",
    facebook: "",
    x: "",
    youtube: "",
    behance: "",
    dribbble: "",
    pinterest: "",
    github: "",
  },
};

/**
 * Every page of the site. Drives each page's <title> and meta description (createPageMetadata),
 * sitemap.xml, llms.txt, breadcrumbs and — through `nav` / `legal` — the menus.
 *
 * Add a page: add it here, then create src/app/<path>/page.js and src/components/sections/<page>/.
 *   schemaType  WebPage type for structured data: "AboutPage", "ContactPage", "CollectionPage"…
 *   nav         listed in the header, mobile menu and footer
 *   legal       listed in the footer's bottom bar (privacy, terms)
 *   noIndex     kept out of search results and the sitemap
 */
export const siteRoutes = [
  {
    path: "/",
    label: "Home",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    priority: 1,
    changeFrequency: "weekly",
  },
  {
    path: "/about",
    label: "About",
    title: "About",
    description: `About ${siteConfig.name}: who we are, what we do and the people behind it.`,
    priority: 0.8,
    changeFrequency: "monthly",
    schemaType: "AboutPage",
    nav: true,
  },
  {
    path: "/contact",
    label: "Contact",
    title: "Contact",
    description: `Get in touch with ${siteConfig.name} — email, phone, address and enquiries.`,
    priority: 0.7,
    changeFrequency: "yearly",
    schemaType: "ContactPage",
    nav: true,
  },
];

/** Never crawled (robots.txt) */
export const privatePaths = ["/api/"];

const toLink = ({ label, path }) => ({ label, href: path });

export const navigation = {
  /**
   * Header, mobile menu and footer. For a one-page site, list section anchors instead:
   * [{ label: "Work", href: "/#work" }, { label: "Contact", href: "/#contact" }]
   */
  main: siteRoutes.filter((route) => route.nav).map(toLink),
  /** Footer bottom bar */
  legal: siteRoutes.filter((route) => route.legal).map(toLink),
};
