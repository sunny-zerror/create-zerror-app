import { siteConfig } from "@/config/site";

export function trimTrailingSlash(value) {
  return value.replace(/\/+$/, "");
}

export function normalizePath(path = "/") {
  if (!path || path === "/") return "/";
  return `/${path}`.replace(/\/+/g, "/").replace(/\/$/, "");
}

/** "/about" → "https://brand.com/about" (already-absolute URLs pass through) */
export function absoluteUrl(path = "/") {
  if (/^https?:\/\//.test(path)) return path;

  const baseUrl = trimTrailingSlash(siteConfig.url || "http://localhost:3000");
  const normalizedPath = normalizePath(path);

  return normalizedPath === "/" ? baseUrl : `${baseUrl}${normalizedPath}`;
}

/** Links that leave the site (or open an app): rendered as <a>, not next/link */
export function isExternal(href = "") {
  return /^(https?:|mailto:|tel:)/.test(href);
}

/** Whether a menu link points at the current page (or a page under it) */
export function isActivePath(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
