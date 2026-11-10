import { siteConfig } from "@/config/site";

export default function ContactHero() {
  return (
    <section className="section pt-page">
      <div className="container">
        <p className="text-eyebrow text-muted" data-reveal="fade">
          Contact
        </p>
        <h1 className="mt-6 max-w-4xl" data-heading-effect>
          Let&apos;s talk
        </h1>
        <p className="mt-stack max-w-xl text-body-lg text-muted" data-para-effect>
          Tell us about your project or question and the {siteConfig.name} team will get back to you.
        </p>
      </div>
    </section>
  );
}
