import { HomeFaq, HomeHero, HomeIntro, HomeServices } from "@/components/sections/home";
import JsonLd from "@/components/seo/JsonLd";
import { faqs } from "@/data/faqs";
import { pageSchema } from "@/lib/schema";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata("/");

export default function HomePage() {
  return (
    <>
      <JsonLd data={pageSchema("/", { faqs })} />
      <HomeHero />
      <HomeIntro />
      <HomeServices />
      <HomeFaq />
    </>
  );
}
