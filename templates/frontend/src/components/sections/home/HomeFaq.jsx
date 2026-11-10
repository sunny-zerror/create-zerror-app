import { RiAddLine } from "@remixicon/react";
import SectionHeading from "@/components/ui/SectionHeading";
import { faqs } from "@/data/faqs";

/** The brand FAQ — the same list app/page.js publishes as FAQPage structured data */
export default function HomeFaq() {
  if (!faqs.length) return null;

  return (
    <section className="section">
      <div className="container grid gap-stack md:grid-cols-12">
        <SectionHeading eyebrow="FAQ" title="Questions, answered" className="md:col-span-5" />

        <div className="md:col-span-7" data-reveal="stagger">
          {faqs.map((faq) => (
            <details key={faq.question} className="group border-b border-line">
              <summary className="flex list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                <h3 className="h5">{faq.question}</h3>
                <RiAddLine
                  size={22}
                  aria-hidden
                  className="shrink-0 transition-transform duration-300 group-open:rotate-45"
                />
              </summary>
              <p className="max-w-2xl pb-6 text-body text-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
