import { siteConfig, siteRoutes } from "@/config/site";
import { faqs } from "@/data/faqs";
import { services } from "@/data/services";
import { formatAddress, formatList } from "@/utils/format";
import { absoluteUrl } from "@/utils/url";

/*
 * /llms.txt — a plain-text brief on the brand for AI assistants (llmstxt.org), written from
 * site.js and the data files at build time, so it never drifts from the site itself.
 */
export const dynamic = "force-static";

const section = (title, lines) => (lines.length ? [`## ${title}`, "", ...lines, ""] : []);

export function GET() {
  const { name, description, summary, entity, contact, address, socials } = siteConfig;

  const facts = [
    ["Website", absoluteUrl("/")],
    ["Also known as", formatList(siteConfig.alternateNames)],
    ["Role", entity.jobTitle],
    ["Works at", entity.worksFor.name],
    ["Founded", entity.foundingDate],
    ["Founders", formatList(entity.founders.map((founder) => founder.name))],
    ["Based in", formatAddress(address)],
    ["Serves", formatList(entity.areaServed)],
    ["Expertise", formatList(entity.knowsAbout)],
  ]
    .filter(([, value]) => value)
    .map(([label, value]) => `- ${label}: ${value}`);

  const contactLines = [
    contact.email && `- Email: ${contact.email}`,
    contact.phone && `- Phone: ${contact.phone}`,
    contact.whatsapp && `- WhatsApp: https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`,
    contact.hours && `- Hours: ${contact.hours}`,
  ].filter(Boolean);

  const profiles = [
    ...Object.entries(socials).filter(([, url]) => url),
    ...entity.sameAs.map((url) => ["Profile", url]),
  ].map(([network, url]) => `- ${network.charAt(0).toUpperCase()}${network.slice(1)}: ${url}`);

  const lines = [
    `# ${name}`,
    "",
    `> ${description}`,
    "",
    ...(summary !== description ? [summary, ""] : []),
    ...(facts.length ? [...facts, ""] : []),
    ...section(
      "Pages",
      siteRoutes
        .filter((route) => !route.noIndex)
        .map((route) => `- [${route.label}](${absoluteUrl(route.path)}): ${route.description}`),
    ),
    ...section(
      "Services",
      services.map((service) => `- ${service.title}: ${service.description}`),
    ),
    ...section(
      "FAQ",
      faqs.flatMap((faq) => [`### ${faq.question}`, "", faq.answer, ""]),
    ),
    ...section("Contact", contactLines),
    ...section("Profiles", profiles),
  ];

  return new Response(`${lines.join("\n").trim()}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
