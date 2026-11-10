import { siteConfig } from "@/config/site";

export default function AboutHero() {
  return (
    <section className="section pt-page">
      <div className="container">
        <p className="text-eyebrow text-muted" data-reveal="fade">
          About
        </p>
        <h1 className="mt-6 max-w-4xl" data-heading-effect>
          About {siteConfig.name}
        </h1>
        <p className="mt-stack max-w-2xl text-body-lg text-muted" data-para-effect>
          {siteConfig.description}
        </p>
      </div>
    </section>
  );
}
