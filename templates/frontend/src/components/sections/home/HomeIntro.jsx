import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import { siteConfig } from "@/config/site";

export default function HomeIntro() {
  return (
    <section className="section">
      <div className="container grid gap-stack md:grid-cols-12">
        <SectionHeading eyebrow="About" title="Who we are" className="md:col-span-5" />

        <div className="md:col-span-6 md:col-start-7">
          <p className="h5" data-para-effect>
            {siteConfig.summary}
          </p>
          <div className="mt-stack" data-reveal>
            <Button href="/about" variant="outline">
              More about us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
