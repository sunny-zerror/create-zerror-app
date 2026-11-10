import ContactForm from "@/components/sections/contact/ContactForm";
import DevHint from "@/components/ui/DevHint";
import SocialLinks from "@/components/ui/SocialLinks";
import { siteConfig } from "@/config/site";
import { formatAddress, telHref, whatsappHref } from "@/utils/format";

export default function ContactDetails() {
  const { contact, address, mapUrl } = siteConfig;
  const fullAddress = formatAddress(address);

  const details = [
    contact.email && { label: "Email", value: contact.email, href: `mailto:${contact.email}` },
    contact.phone && { label: "Phone", value: contact.phone, href: telHref(contact.phone) },
    contact.whatsapp && { label: "WhatsApp", value: "Message us", href: whatsappHref(contact.whatsapp) },
    fullAddress && { label: "Address", value: fullAddress, href: mapUrl },
    contact.hours && { label: "Hours", value: contact.hours },
  ].filter(Boolean);

  return (
    <section className="section pt-0">
      <div className="container grid gap-stack md:grid-cols-12">
        <div className="md:col-span-5">
          {details.length ? (
            <dl className="flex flex-col gap-6" data-reveal="stagger">
              {details.map(({ label, value, href }) => (
                <div key={label} className="border-t border-line pt-4">
                  <dt className="text-eyebrow text-muted">{label}</dt>
                  <dd className="mt-2 text-body-lg">
                    {href ? (
                      <a
                        href={href}
                        className="hover:opacity-60"
                        {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      >
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <DevHint>contact details</DevHint>
          )}
          <SocialLinks className="mt-stack" />
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
