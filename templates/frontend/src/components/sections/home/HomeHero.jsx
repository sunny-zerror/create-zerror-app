import Button from "@/components/ui/Button";
import { siteConfig } from "@/config/site";

// Background film: put it in public/videos/home/ and set the path, e.g. "/videos/home/hero.mp4"
const HERO_VIDEO = "";

export default function HomeHero() {
  return (
    <section className="relative isolate flex min-h-svh items-end overflow-hidden pt-page pb-section">
      {HERO_VIDEO && (
        <video
          className="absolute inset-0 -z-10 cover"
          src={HERO_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
      )}

      <div className="container">
        <p className="text-eyebrow text-muted" data-reveal="fade">
          {siteConfig.name}
        </p>
        <h1 className="mt-6 max-w-5xl" data-heading-effect>
          {siteConfig.tagline}
        </h1>
        <p className="mt-stack max-w-xl text-body-lg text-muted" data-para-effect>
          {siteConfig.description}
        </p>
        <div className="mt-stack flex flex-wrap gap-3" data-reveal="stagger">
          <Button href="/contact">Get in touch</Button>
          <Button href="/about" variant="outline">
            About {siteConfig.name}
          </Button>
        </div>
      </div>
    </section>
  );
}
