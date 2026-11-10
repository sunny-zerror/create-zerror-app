"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import NavLink from "@/components/ui/NavLink";
import SocialLinks from "@/components/ui/SocialLinks";
import { navigation, siteConfig } from "@/config/site";
import { cn } from "@/utils/cn";
import { isActivePath } from "@/utils/url";

/** Full-screen menu under the header on phones; holds the page still while open */
export default function MobileMenu({ open, onClose }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;

    window.lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const onKeyDown = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.lenis?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <div
      id="mobile-menu"
      inert={!open}
      data-lenis-prevent
      className={cn(
        "fixed inset-x-0 top-header bottom-0 z-40 flex flex-col justify-between overflow-y-auto bg-paper px-gutter pt-stack pb-section transition-[opacity,visibility] duration-500 ease-out-expo md:hidden",
        open ? "visible opacity-100" : "invisible opacity-0",
      )}
    >
      <nav aria-label="Mobile">
        <ul className="flex flex-col gap-4">
          {navigation.main.map((item) => (
            <li key={item.href}>
              <NavLink
                href={item.href}
                onClick={onClose}
                aria-current={isActivePath(pathname, item.href) ? "page" : undefined}
                className="h3 block"
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex flex-col gap-4">
        {siteConfig.contact.email && (
          <a href={`mailto:${siteConfig.contact.email}`} className="text-body">
            {siteConfig.contact.email}
          </a>
        )}
        <SocialLinks />
      </div>
    </div>
  );
}
