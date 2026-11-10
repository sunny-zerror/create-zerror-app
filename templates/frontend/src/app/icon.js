import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

/*
 * Placeholder favicon — the brand's initial on its colour, drawn from site.js at build time.
 * Next.js links it in <head> automatically. For the real one, delete this file and drop the
 * designer's icon here as icon.svg or icon.png (square, a multiple of 48px — Google's rule),
 * plus favicon.ico. Same for apple-icon.js → apple-icon.png (180×180).
 */
export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default function Icon() {
  const { name, colors } = siteConfig;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 40,
        background: colors.foreground,
        color: colors.background,
        fontSize: 120,
      }}
    >
      {name.charAt(0).toUpperCase()}
    </div>,
    size,
  );
}
