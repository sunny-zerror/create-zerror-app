"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/*
 * Lenis smooth scrolling for the whole site, driven by GSAP's ticker so ScrollTrigger stays in
 * sync. The instance lives on window.lenis — stop() / start() it for menus and modals; panels
 * that scroll on their own need data-lenis-prevent. Lenis turns its smoothing off by itself for
 * visitors who prefer reduced motion.
 */
export default function LenisScroll() {
  const pathname = usePathname();

  useEffect(() => {
    // Every route opens at the top (or at its #section) — handled below
    window.history.scrollRestoration = "manual";

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.1,
      wheelMultiplier: 0.7,
      gestureOrientation: "vertical",
      stopInertiaOnNavigate: true,
    });
    window.lenis = lenis;

    const tick = (time) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      window.lenis = undefined;
    };
  }, []);

  // New page: jump to the top — or to the #section in the URL, clear of the header — and
  // re-measure the scroll animations
  useEffect(() => {
    const { hash } = window.location;
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
    // Measured here as an absolute position: Next.js may already have jumped to the #section
    // natively, which Lenis hasn't caught up with yet
    const top = target
      ? target.getBoundingClientRect().top +
        window.scrollY -
        (parseFloat(getComputedStyle(target).scrollMarginTop) || 0)
      : 0;

    if (window.lenis) {
      // Re-measure first, or Lenis clamps the jump to the previous page's height
      window.lenis.resize();
      window.lenis.scrollTo(top, { immediate: true, force: true });
    } else {
      window.scrollTo(0, top);
    }

    const id = window.setTimeout(() => {
      window.lenis?.resize();
      ScrollTrigger.refresh();
    }, 300);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
