import Button from "@/components/ui/Button";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({ title: "Page not found", noIndex: true });

export default function NotFound() {
  return (
    <section className="section flex min-h-svh items-center pt-page">
      <div className="container">
        <p className="text-eyebrow text-muted">Error 404</p>
        <h1 className="mt-6">Page not found</h1>
        <p className="mt-6 max-w-md text-body-lg text-muted">
          The page you&apos;re looking for has moved or no longer exists.
        </p>
        <Button href="/" className="mt-stack">
          Back home
        </Button>
      </div>
    </section>
  );
}
