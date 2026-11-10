"use client";

import { RiCloseLine, RiMenuLine } from "@remixicon/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "@/components/layout/Logo";
import MobileMenu from "@/components/layout/MobileMenu";
import NavLink from "@/components/ui/NavLink";
import { navigation } from "@/config/site";
import useScrollDirection from "@/hooks/useScrollDirection";
import { cn } from "@/utils/cn";
import { isActivePath } from "@/utils/url";

/** Tucks away while scrolling down, comes back on the way up. Set to false to keep it in place. */
const HIDE_ON_SCROLL = true;

export default function Header() {
  const pathname = usePathname();
  const direction = useScrollDirection();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  const hidden = HIDE_ON_SCROLL && direction === "down" && !menuOpen;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 h-header bg-paper/85 backdrop-blur-md transition-transform duration-500 ease-out-expo",
          hidden && "-translate-y-full",
        )}
      >
        <div className="container flex h-full items-center justify-between gap-8">
          <Logo onClick={closeMenu} />

          <nav aria-label="Main" className="max-md:hidden">
            <ul className="flex items-center gap-10">
              {navigation.main.map((item) => (
                <li key={item.href}>
                  <NavLink
                    href={item.href}
                    aria-current={isActivePath(pathname, item.href) ? "page" : undefined}
                    className="text-cta transition-opacity duration-300 hover:opacity-60 aria-[current=page]:underline aria-[current=page]:underline-offset-4"
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="-mr-2 center size-10 md:hidden"
          >
            {menuOpen ? <RiCloseLine size={24} aria-hidden /> : <RiMenuLine size={24} aria-hidden />}
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </header>

      {/* A sibling, not a child: the header's backdrop-filter would trap a fixed panel inside it */}
      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </>
  );
}
