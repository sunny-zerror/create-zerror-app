"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/config/site";

const FIELD =
  "w-full border-b border-line bg-transparent py-3 text-body outline-none transition-colors duration-300 focus:border-ink";

/** Posts to src/app/api/contact/route.js, which emails the enquiry (SMTP settings in .env.local) */
export default function ContactForm() {
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) throw new Error(result.error || "Something went wrong.");

      form.reset();
      setStatus("sent");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p role="status" className="h4">
        Thank you — we&apos;ll be in touch soon.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <label className="flex flex-col gap-1">
        <span className="text-eyebrow text-muted">Name</span>
        <input name="name" required autoComplete="name" maxLength={200} className={FIELD} />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-eyebrow text-muted">Email</span>
        <input name="email" type="email" required autoComplete="email" maxLength={200} className={FIELD} />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-eyebrow text-muted">Phone (optional)</span>
        <input name="phone" type="tel" autoComplete="tel" maxLength={40} className={FIELD} />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-eyebrow text-muted">Message</span>
        <textarea name="message" required rows={5} maxLength={5000} className={`${FIELD} resize-none`} />
      </label>

      {/* Honeypot: hidden from people, filled in by bots — the API quietly drops those */}
      <div aria-hidden="true" className="hidden">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {status === "error" && (
        <p role="alert" className="text-caption text-error">
          {error}
          {siteConfig.contact.email && (
            <>
              {" "}
              You can also email{" "}
              <a href={`mailto:${siteConfig.contact.email}`} className="underline">
                {siteConfig.contact.email}
              </a>
              .
            </>
          )}
        </p>
      )}

      <Button type="submit" disabled={status === "sending"} className="self-start">
        {status === "sending" ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
