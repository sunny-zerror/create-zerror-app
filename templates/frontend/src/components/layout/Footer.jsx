import Logo from "@/components/layout/Logo";
import DevHint from "@/components/ui/DevHint";
import NavLink from "@/components/ui/NavLink";
import SocialLinks from "@/components/ui/SocialLinks";
import { navigation, siteConfig } from "@/config/site";
import { telHref } from "@/utils/format";

export default function Footer() {
  const { contact } = siteConfig;
  const hasContact = contact.email || contact.phone || Object.values(siteConfig.socials).some(Boolean);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="container grid gap-stack py-section md:grid-cols-12">
        <div className="md:col-span-6">
          <Logo />
          <p className="mt-6 max-w-sm text-body text-muted">{siteConfig.description}</p>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <p className="text-eyebrow text-muted">Explore</p>
          <ul className="mt-4 flex flex-col gap-2">
            {navigation.main.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href} className="text-body hover:opacity-60">
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          {hasContact ? (
            <>
              <p className="text-eyebrow text-muted">Get in touch</p>
              <ul className="mt-4 flex flex-col gap-2 text-body">
                {contact.email && (
                  <li>
                    <a href={`mailto:${contact.email}`} className="hover:opacity-60">
                      {contact.email}
                    </a>
                  </li>
                )}
                {contact.phone && (
                  <li>
                    <a href={telHref(contact.phone)} className="hover:opacity-60">
                      {contact.phone}
                    </a>
                  </li>
                )}
              </ul>
              <SocialLinks className="mt-6" />
            </>
          ) : (
            <DevHint>contact email, phone and socials</DevHint>
          )}
        </div>
      </div>

      <div className="container flex flex-col gap-3 border-t border-line py-6 text-caption text-muted md:flex-row md:items-center md:justify-between">
        <p>
          © {year} {siteConfig.legalName}. All rights reserved.
        </p>
        {navigation.legal.length > 0 && (
          <ul className="flex flex-wrap gap-6">
            {navigation.legal.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href} className="hover:text-ink">
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </div>
    </footer>
  );
}
