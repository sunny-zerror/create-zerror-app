import { siteRoutes } from "@/config/site";
import { absoluteUrl } from "@/utils/url";

// One timestamp per build, so every URL doesn't look changed on every crawl
const lastModified = new Date();

export default function sitemap() {
  const pages = siteRoutes
    .filter((route) => !route.noIndex)
    .map((route) => ({
      url: absoluteUrl(route.path),
      lastModified,
      changeFrequency: route.changeFrequency || "monthly",
      priority: route.priority ?? 0.5,
    }));

  // Dynamic pages go here too, e.g. case studies from src/data/projects.js:
  // const projectPages = projects.map((project) => ({
  //   url: absoluteUrl(`/work/${project.slug}`),
  //   lastModified,
  //   priority: 0.7,
  //   images: [absoluteUrl(project.cover)],
  // }));

  return [...pages];
}
