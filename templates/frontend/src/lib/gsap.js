/*
 * Import GSAP from here — never from "gsap" directly — so every plugin is registered once
 * and every file shares the same ScrollTrigger:
 *
 *   import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export { gsap, ScrollTrigger, SplitText, useGSAP };
