import { ContactDetails, ContactHero } from "@/components/sections/contact";
import JsonLd from "@/components/seo/JsonLd";
import { pageSchema } from "@/lib/schema";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata("/contact");

export default function ContactPage() {
  return (
    <>
      <JsonLd data={pageSchema("/contact")} />
      <ContactHero />
      <ContactDetails />
    </>
  );
}
