import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

/*
 * The default 1200×630 social card (siteConfig.ogImage = "/og"), drawn from site.js at build
 * time. For a designed card: put public/og.jpg (1200×630) in and set siteConfig.ogImage to "/og.jpg".
 */
export const dynamic = "force-static";

export function GET() {
  const { name, tagline, url, colors } = siteConfig;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: colors.foreground,
        color: colors.background,
      }}
    >
      <div style={{ display: "flex", width: 96, height: 8, background: colors.accent }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div style={{ display: "flex", fontSize: 112, lineHeight: 1, letterSpacing: -3 }}>{name}</div>
        <div style={{ display: "flex", fontSize: 40, lineHeight: 1.3, opacity: 0.75, maxWidth: 960 }}>{tagline}</div>
      </div>
      <div style={{ display: "flex", fontSize: 26, letterSpacing: 4, textTransform: "uppercase", opacity: 0.55 }}>
        {url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
