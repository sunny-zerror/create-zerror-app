/*
 * schema.org structured data (JSON-LD) — how Google, Bing and AI assistants learn who the brand
 * is, what it does and how the pages fit together. Everything is built from site.js and the
 * data files, linked into one graph by @id, and only states what's filled in.
 *
 *   Root layout:  siteSchema()                       the brand (Organization/Person…) + WebSite
 *   Each page:    pageSchema(path, { faqs, crumbs })  WebPage (+ FAQPage) + BreadcrumbList
 *
 * Render with <JsonLd data={…} />. Check with https://search.google.com/test/rich-results
 */
import { siteConfig } from "@/config/site";
import { services } from "@/data/services";
import { getRoute } from "@/lib/seo";
import { absoluteUrl, normalizePath } from "@/utils/url";

const { entity, contact } = siteConfig;
const isPerson = entity.type === "Person";

const ENTITY_ID = absoluteUrl(isPerson ? "/#person" : "/#organization");
const WEBSITE_ID = absoluteUrl("/#website");

/** Drops empty values, so the markup only claims what's known */
function clean(node) {
  return Object.fromEntries(
    Object.entries(node).filter(
      ([, value]) => value !== undefined && value !== null && value !== "" && !(Array.isArray(value) && !value.length),
    ),
  );
}

/** Every profile of the brand — Google uses these to connect its knowledge panel */
export function sameAs() {
  return [...Object.values(siteConfig.socials), ...entity.sameAs].filter(Boolean);
}

function postalAddress() {
  const { street, city, state, postalCode, country } = siteConfig.address;
  if (!street && !city) return undefined;
  return clean({
    "@type": "PostalAddress",
    streetAddress: street,
    addressLocality: city,
    addressRegion: state,
    postalCode,
    addressCountry: country,
  });
}

const person = ({ name, jobTitle, url, sameAs: profiles = [] }) =>
  clean({ "@type": "Person", name, jobTitle, url, sameAs: profiles });

/** The brand itself: Organization (or a LocalBusiness subtype) — or Person for a personal portfolio */
export function entitySchema() {
  const common = {
    "@id": ENTITY_ID,
    name: siteConfig.name,
    alternateName: siteConfig.alternateNames,
    description: siteConfig.description,
    url: absoluteUrl("/"),
    email: contact.email,
    telephone: contact.phone,
    address: postalAddress(),
    knowsAbout: entity.knowsAbout,
    sameAs: sameAs(),
  };

  if (isPerson) {
    const { worksFor } = entity;
    return clean({
      "@type": "Person",
      ...common,
      jobTitle: entity.jobTitle,
      worksFor: worksFor.name ? clean({ "@type": "Organization", name: worksFor.name, url: worksFor.url }) : undefined,
      image: entity.image ? absoluteUrl(entity.image) : undefined,
    });
  }

  const hasGeo = entity.geo.latitude && entity.geo.longitude;

  return clean({
    "@type": entity.type,
    ...common,
    legalName: siteConfig.legalName,
    slogan: siteConfig.tagline,
    logo: { "@type": "ImageObject", url: absoluteUrl(siteConfig.logo) },
    image: absoluteUrl(entity.image || siteConfig.ogImage),
    foundingDate: entity.foundingDate,
    founder: entity.founders.map(person),
    areaServed: entity.areaServed,
    contactPoint:
      contact.email || contact.phone
        ? clean({
            "@type": "ContactPoint",
            contactType: "customer service",
            email: contact.email,
            telephone: contact.phone,
          })
        : undefined,
    hasOfferCatalog: services.length
      ? {
          "@type": "OfferCatalog",
          name: `${siteConfig.name} services`,
          itemListElement: services.map((service) => ({
            "@type": "Offer",
            itemOffered: clean({ "@type": "Service", name: service.title, description: service.description }),
          })),
        }
      : undefined,
    // LocalBusiness details — left empty for other types
    priceRange: entity.priceRange,
    openingHours: entity.openingHours,
    geo: hasGeo
      ? { "@type": "GeoCoordinates", latitude: entity.geo.latitude, longitude: entity.geo.longitude }
      : undefined,
    hasMap: siteConfig.mapUrl,
  });
}

/** The site — its name and alternate names are what Google shows as the site name in results */
export function websiteSchema() {
  return clean({
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: absoluteUrl("/"),
    name: siteConfig.name,
    alternateName: siteConfig.alternateNames,
    description: siteConfig.description,
    inLanguage: siteConfig.language,
    publisher: { "@id": ENTITY_ID },
  });
}

/** Root layout: the brand and the website, on every page */
export function siteSchema() {
  return { "@context": "https://schema.org", "@graph": [entitySchema(), websiteSchema()] };
}

/** "/services/branding" → Services › Branding, labelled from siteRoutes where possible */
function crumbsFor(path) {
  const segments = normalizePath(path).split("/").filter(Boolean);
  return segments.map((segment, i) => {
    const crumbPath = `/${segments.slice(0, i + 1).join("/")}`;
    const fallback = segment.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());
    return { name: getRoute(crumbPath).label || fallback, path: crumbPath };
  });
}

export function breadcrumbSchema(path, crumbs = crumbsFor(path)) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(path)}#breadcrumb`,
    itemListElement: [{ name: "Home", path: "/" }, ...crumbs].map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

/**
 * A page: WebPage (AboutPage, ContactPage… from siteRoutes' schemaType) tied to the site and
 * the brand, plus breadcrumbs. Pass `faqs` when the page shows them (it becomes an FAQPage too),
 * and `title` / `description` / `crumbs` for dynamic pages that aren't in siteRoutes.
 */
export function pageSchema(path, { faqs = [], title, description, crumbs, type } = {}) {
  const route = getRoute(path);
  const url = absoluteUrl(route.path);
  const isHome = route.path === "/";
  const pageType = type || route.schemaType || "WebPage";

  const page = clean({
    "@type": faqs.length ? [pageType, "FAQPage"] : pageType,
    "@id": `${url}#webpage`,
    url,
    name: title || route.title,
    description: description || route.description,
    inLanguage: siteConfig.language,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ENTITY_ID },
    breadcrumb: isHome ? undefined : { "@id": `${url}#breadcrumb` },
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  });

  return {
    "@context": "https://schema.org",
    "@graph": isHome ? [page] : [page, breadcrumbSchema(route.path, crumbs)],
  };
}
