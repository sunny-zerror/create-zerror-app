import { siteConfig } from "@/config/site";
import { services } from "@/data/services";
import { countryName, formatList } from "@/utils/format";

const { name, address, contact, entity } = siteConfig;

const location = [address.city, address.state, countryName(address.country)].filter(Boolean).join(", ");

const contactWays = [
  contact.email && `email ${contact.email}`,
  contact.phone && `call ${contact.phone}`,
  contact.whatsapp && "message on WhatsApp",
].filter(Boolean);

/**
 * The questions people ask about the brand — shown on the home page (HomeFaq) and published
 * as FAQPage structured data, which AI answers draw on. The starter answers come from
 * site.js and services.js so they stay true; ones with nothing to say yet are left out.
 * Add the brand's real questions below them.
 */
export const faqs = [
  {
    question: `What is ${name}?`,
    answer: siteConfig.summary,
  },
  {
    question: `What does ${name} offer?`,
    answer: services.length ? `${name} offers ${formatList(services.map((service) => service.title))}.` : "",
  },
  {
    question: `Where is ${name} based?`,
    answer: address.city
      ? `${name} is based in ${location}${entity.areaServed.length ? ` and serves ${formatList(entity.areaServed)}` : ""}.`
      : "",
  },
  {
    question: `How can I contact ${name}?`,
    answer: contactWays.length ? `You can ${formatList(contactWays)}, or use the form on the contact page.` : "",
  },
].filter((faq) => faq.answer);
