import "lenis/dist/lenis.css";
import "@/styles/globals.css"; // pulls in fonts.css
import SiteLayout from "@/components/layout/SiteLayout";
import JsonLd from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";
import { siteSchema } from "@/lib/schema";
import { createRootMetadata, createViewport } from "@/lib/seo";

export const metadata = createRootMetadata();
export const viewport = createViewport();

export default function RootLayout({ children }) {
  return (
    <html lang={siteConfig.language}>
      <body suppressHydrationWarning>
        <JsonLd data={siteSchema()} />
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
