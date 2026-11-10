"use client";

import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";

/**
 * Menu link. Other pages open with a page transition; "#section" or "/#section" links to the
 * current page glide there with Lenis instead of jumping — so a one-page site only needs
 * anchors in navigation.main and matching ids on its sections.
 */
export default function NavLink({ href, onClick, ...props }) {
  const pathname = usePathname();
  const [path, hash] = href.split("#");
  const samePage = hash !== undefined && (path === "" || path === pathname);

  if (!samePage) return <Link href={href} onClick={onClick} {...props} />;

  const handleClick = (event) => {
    onClick?.(event);
    const target = document.getElementById(hash);
    if (!target) return;

    event.preventDefault();
    // force: also runs while the mobile menu has Lenis stopped
    if (window.lenis) window.lenis.scrollTo(target, { force: true });
    else target.scrollIntoView({ behavior: "smooth" });
    window.history.replaceState(null, "", `#${hash}`);
  };

  return <a href={href} onClick={handleClick} {...props} />;
}
