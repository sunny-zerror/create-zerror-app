import { AboutHero, AboutStory } from "@/components/sections/about";
import JsonLd from "@/components/seo/JsonLd";
import { pageSchema } from "@/lib/schema";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata("/about");

export default function AboutPage() {
  return (
    <>
      <JsonLd data={pageSchema("/about")} />
      <AboutHero />
      <AboutStory />
    </>
  );
}
