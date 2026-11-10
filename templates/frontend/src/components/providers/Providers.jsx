"use client";

import { ViewTransitions } from "next-view-transitions";
import GlobalAnimations from "@/components/animation/GlobalAnimations";
import LenisScroll from "@/components/providers/LenisScroll";

/** Client-side wiring for every page: page transitions, smooth scroll and scroll animations */
export default function Providers({ children }) {
  return (
    <ViewTransitions>
      <LenisScroll />
      {children}
      <GlobalAnimations />
    </ViewTransitions>
  );
}
