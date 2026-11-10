"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";

/*
 * Site-wide scroll animations, switched on with data attributes — so sections stay Server
 * Components and never need their own animation code. Mounted once in Providers.
 *
 *   <h2 data-heading-effect>…</h2>      its lines rise out of a mask
 *   <p data-para-effect>…</p>           the same for paragraphs, quicker and tighter
 *   <div data-img-effect><img /></div>  the frame opens upward while the image settles from a zoom
 *   <div data-reveal>…</div>            rises and fades in
 *        data-reveal="stagger"           its children do, one after another (lists, grids)
 *        data-reveal="fade"              opacity only
 *   <img data-parallax="0.15" />        drifts against the scroll (inside an overflow-hidden frame)
 *
 * What's on screen as a page opens plays straight away, one after another in page order; the
 * rest plays as it scrolls into view, and reverses when scrolled back above. Until set up, these
 * elements are hidden by globals.css (no flash before hydration) and shown anyway after 3s.
 * Visitors who prefer reduced motion just see everything.
 */

const EASE = "expo.out";

/** Gap between the entrances of what's on screen when the page opens */
const SEQUENCE_STEP = 0.12;

const onScroll = (trigger) => ({ trigger, start: "top 88%", toggleActions: "play none none reverse" });

const ready = (el) => el.setAttribute("data-animated", "");

/** Lines rising out of their own overflow masks; re-split (keeping progress) on resize */
function riseLines(el, timing, { duration, stagger }) {
  SplitText.create(el, {
    type: "lines",
    mask: "lines",
    autoSplit: true,
    onSplit(self) {
      // A little bleed so descenders (g, y, p) aren't cropped by the masks
      self.masks.forEach((mask) => Object.assign(mask.style, { paddingBottom: "0.1em", marginBottom: "-0.1em" }));
      ready(el);
      return gsap.from(self.lines, { yPercent: 110, duration, stagger, ease: EASE, ...timing });
    },
  });
}

/** Entrance effects — `timing` is either a delay (on screen at load) or a scrollTrigger */
const REVEALS = {
  "[data-heading-effect]": (el, timing) => riseLines(el, timing, { duration: 1.2, stagger: 0.1 }),

  "[data-para-effect]": (el, timing) => riseLines(el, timing, { duration: 1, stagger: 0.06 }),

  "[data-img-effect]": (el, timing) => {
    const media = el.querySelector("img, video, canvas, picture");
    const timeline = gsap.timeline(timing);
    timeline.from(el, { clipPath: "inset(100% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut" });
    if (media) timeline.from(media, { scale: 1.2, duration: 1.8, ease: EASE }, 0);
    ready(el);
  },

  "[data-reveal]": (el, timing) => {
    const kind = el.dataset.reveal;
    gsap.from(kind === "stagger" ? el.children : el, {
      opacity: 0,
      y: kind === "fade" ? 0 : 40,
      duration: 1.1,
      stagger: kind === "stagger" ? 0.08 : 0,
      ease: EASE,
      ...timing,
    });
    ready(el);
  },
};

const REVEAL_SELECTOR = Object.keys(REVEALS).join(", ");

function parallax(el) {
  const depth = Number(el.dataset.parallax) || 0.15;
  gsap.fromTo(
    el,
    // Scaled up just enough that the drift never shows an edge of its frame
    { yPercent: -depth * 50, scale: 1 + depth },
    {
      yPercent: depth * 50,
      ease: "none",
      scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true },
    },
  );
}

export default function GlobalAnimations() {
  const pathname = usePathname();

  // Runs per page: sets up what's on it, and reverts it all when the route changes
  useEffect(() => {
    let mm;
    let cancelled = false;

    // Split text only once the brand fonts are in, or the lines break in the wrong places
    document.fonts.ready.then(() => {
      if (cancelled) return;
      mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        let onScreen = 0;

        // Document order, so the opening sequence reads top to bottom
        document.querySelectorAll(REVEAL_SELECTOR).forEach((el) => {
          const inView = el.getBoundingClientRect().top < window.innerHeight;
          const timing = inView
            ? { delay: 0.1 + Math.min(onScreen++, 8) * SEQUENCE_STEP }
            : { scrollTrigger: onScroll(el) };

          Object.entries(REVEALS).forEach(([selector, reveal]) => el.matches(selector) && reveal(el, timing));
        });

        document.querySelectorAll("[data-parallax]").forEach(parallax);
        ScrollTrigger.refresh();
      });
    });

    return () => {
      cancelled = true;
      mm?.revert();
    };
  }, [pathname]);

  return null;
}
