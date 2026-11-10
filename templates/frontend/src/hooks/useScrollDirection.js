import { useEffect, useState } from "react";

/** "down" while scrolling down past `threshold` px, otherwise "up" — e.g. to tuck the header away */
export default function useScrollDirection(threshold = 120) {
  const [direction, setDirection] = useState("up");

  useEffect(() => {
    let last = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 5) return; // ignore jitter
      setDirection(y > last && y > threshold ? "down" : "up");
      last = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return direction;
}
