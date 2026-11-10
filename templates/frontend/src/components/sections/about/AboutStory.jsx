import DevHint from "@/components/ui/DevHint";
import { siteConfig } from "@/config/site";
import { countryName, formatList } from "@/utils/format";

/**
 * The brand's story and key facts, stated plainly on the page — the same facts the
 * Organization structured data publishes, so search engines can trust them.
 */
export default function AboutStory() {
  const { entity, address } = siteConfig;

  const facts = [
    ["Role", entity.jobTitle],
    ["Works at", entity.worksFor.name],
    ["Founded", entity.foundingDate],
    ["Founders", formatList(entity.founders.map((founder) => founder.name))],
    ["Based in", [address.city, countryName(address.country)].filter(Boolean).join(", ")],
    ["Serving", formatList(entity.areaServed)],
    ["Expertise", formatList(entity.knowsAbout)],
  ].filter(([, value]) => value);

  return (
    <section className="section">
      <div className="container grid gap-stack md:grid-cols-12">
        <div className="md:col-span-7">
          <h2 className="h3" data-heading-effect>
            Our story
          </h2>
          <p className="mt-6 text-body-lg" data-para-effect>
            {siteConfig.summary}
          </p>
        </div>

        <div className="md:col-span-4 md:col-start-9">
          {facts.length ? (
            <dl className="flex flex-col gap-6" data-reveal="stagger">
              {facts.map(([term, value]) => (
                <div key={term} className="border-t border-line pt-4">
                  <dt className="text-eyebrow text-muted">{term}</dt>
                  <dd className="mt-2 text-body">{value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <DevHint>entity details (founded, founders, area served)</DevHint>
          )}
        </div>
      </div>
    </section>
  );
}
