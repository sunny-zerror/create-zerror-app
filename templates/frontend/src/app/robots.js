import { privatePaths, siteConfig } from "@/config/site";
import { absoluteUrl } from "@/utils/url";

/*
 * AI search and assistant crawlers, welcomed by name so AI answers can read and cite the site.
 * (Google's AI Overviews use the regular Googlebot; Google-Extended covers Gemini.)
 * Remove a name to opt that crawler out.
 */
const AI_CRAWLERS = [
  "Google-Extended",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Applebot-Extended",
];

export default function robots() {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: privatePaths },
      { userAgent: AI_CRAWLERS, allow: "/", disallow: privatePaths },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteConfig.url,
  };
}
