import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Providers from "@/components/providers/Providers";

/** The frame around every page: providers, skip link, header, main and footer */
export default function SiteLayout({ children }) {
  return (
    <Providers>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:bg-paper focus:px-4 focus:py-3 focus:text-ink"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </Providers>
  );
}
