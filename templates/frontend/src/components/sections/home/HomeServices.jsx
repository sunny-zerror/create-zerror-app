import SectionHeading from "@/components/ui/SectionHeading";
import { services } from "@/data/services";

export default function HomeServices() {
  return (
    <section className="section bg-surface">
      <div className="container">
        <SectionHeading eyebrow="Services" title="What we do" />

        <ol className="mt-stack grid gap-grid md:grid-cols-3" data-reveal="stagger">
          {services.map((service, i) => (
            <li key={service.title} className="flex flex-col gap-4 border-t border-line pt-6">
              <span className="text-caption text-muted">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="h4">{service.title}</h3>
              <p className="text-body text-muted">{service.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
