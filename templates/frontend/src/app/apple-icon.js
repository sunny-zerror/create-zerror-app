import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

// Home-screen icon for iPhone/iPad. Replace with apple-icon.png (180×180) when the brand has one.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const { name, colors } = siteConfig;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: colors.foreground,
        color: colors.background,
        fontSize: 110,
      }}
    >
      {name.charAt(0).toUpperCase()}
    </div>,
    size,
  );
}
