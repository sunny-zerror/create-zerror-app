import { siteConfig, siteRoutes } from "@/config/site";
import { absoluteUrl, normalizePath } from "@/utils/url";

/** A page's entry in siteRoutes — or a fallback built from the brand defaults */
export function getRoute(path = "/") {
  const normalizedPath = normalizePath(path);
  return (
    siteRoutes.find((route) => route.path === normalizedPath) || {
      path: normalizedPath,
      title: siteConfig.name,
      description: siteConfig.description,
    }
  );
}

/**
 * Metadata for any page. Static pages use createPageMetadata(path); dynamic ones
 * (e.g. /work/[slug]) call this from generateMetadata with their own values.
 */
export function createMetadata({
  title,
  /** skip the "%s | Brand" title template (home page, titles that already carry the brand) */
  absoluteTitle = false,
  description = siteConfig.description,
  path = "/",
  image = siteConfig.ogImage,
  imageAlt,
  keywords = siteConfig.keywords,
  type = "website",
  noIndex = false,
} = {}) {
  const url = absoluteUrl(path);
  const pageTitle = title || siteConfig.name;
  const branded = absoluteTitle || pageTitle.includes(siteConfig.name);
  const socialTitle = branded ? pageTitle : `${pageTitle} | ${siteConfig.name}`;
  const imageUrl = absoluteUrl(image);

  return {
    title: branded ? { absolute: pageTitle } : pageTitle,
    description,
    keywords,
    // Hidden pages drop the canonical rather than point it somewhere else
    alternates: { canonical: noIndex ? null : url },
    robots: noIndex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          // Lets Google (and its AI Overviews) quote the page and show large previews
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type,
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      title: socialTitle,
      description,
      url,
      images: [
        {
          url: imageUrl,
          // Only the default card has known dimensions
          ...(image === siteConfig.ogImage ? { width: 1200, height: 630 } : {}),
          alt: imageAlt || socialTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [imageUrl],
      ...(siteConfig.twitterHandle ? { site: siteConfig.twitterHandle, creator: siteConfig.twitterHandle } : {}),
    },
  };
}

/** Metadata for a page listed in siteRoutes */
export function createPageMetadata(path) {
  const route = getRoute(path);
  return createMetadata({
    title: route.title,
    absoluteTitle: route.path === "/",
    description: route.description,
    path: route.path,
    image: route.image,
    noIndex: route.noIndex,
  });
}

/** Root layout: site-wide defaults, the "%s | Brand" title template and verification tags */
export function createRootMetadata() {
  const { alternates, ...defaults } = createMetadata({ absoluteTitle: true }); // no site-wide canonical
  const google = process.env.GOOGLE_SITE_VERIFICATION;
  const bing = process.env.BING_SITE_VERIFICATION;

  return {
    ...defaults,
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${siteConfig.name} — ${siteConfig.tagline}`,
      template: `%s | ${siteConfig.name}`,
    },
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.name, url: absoluteUrl("/") }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    formatDetection: { telephone: false, address: false, email: false },
    appleWebApp: { title: siteConfig.name },
    // Search Console / Bing Webmaster Tools ownership (set in .env.local or on the host)
    verification: {
      ...(google ? { google } : {}),
      ...(bing ? { other: { "msvalidate.01": bing } } : {}),
    },
  };
}

export function createViewport() {
  return {
    themeColor: siteConfig.colors.background,
    colorScheme: "light",
    width: "device-width",
    initialScale: 1,
  };
}
