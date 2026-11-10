"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="section flex min-h-svh items-center pt-page">
      <div className="container">
        <p className="text-eyebrow text-muted">Error</p>
        <h1 className="mt-6">Something went wrong</h1>
        <p className="mt-6 max-w-md text-body-lg text-muted">Please try again — if it keeps happening, let us know.</p>
        <div className="mt-stack flex flex-wrap gap-3">
          <Button onClick={reset}>Try again</Button>
          <Button href="/" variant="outline">
            Back home
          </Button>
        </div>
      </div>
    </section>
  );
}
