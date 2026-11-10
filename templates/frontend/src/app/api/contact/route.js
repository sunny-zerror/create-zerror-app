import nodemailer from "nodemailer";
import { siteConfig } from "@/config/site";

/*
 * Contact form → email. Settings come from .env.local (or the host's env vars) and stay on the
 * server: never prefix them with NEXT_PUBLIC_, which would ship them to every visitor's browser.
 */

const LIMITS = { name: 200, email: 200, phone: 40, message: 5000 };

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

/** Trimmed text, cut to a maximum length */
const clip = (value, max) =>
  String(value ?? "")
    .trim()
    .slice(0, max);

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Bots fill the hidden "company" field: answer as if it worked, send nothing
  if (body.company) return Response.json({ ok: true });

  const fields = Object.fromEntries(Object.entries(LIMITS).map(([key, max]) => [key, clip(body[key], max)]));

  if (!fields.name || !isEmail(fields.email) || !fields.message) {
    return Response.json({ ok: false, error: "Please add your name, a valid email and a message." }, { status: 400 });
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO } = process.env;
  const to = CONTACT_TO || siteConfig.contact.email;

  if (!SMTP_USER || !SMTP_PASS || !to) {
    console.error("[contact] Set SMTP_USER, SMTP_PASS and CONTACT_TO (see .env.example).");
    return Response.json({ ok: false, error: "The form isn't connected yet." }, { status: 503 });
  }

  const port = Number(SMTP_PORT) || 465;
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST || "smtp.gmail.com",
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const rows = [
    ["Name", fields.name],
    ["Email", fields.email],
    ["Phone", fields.phone],
    ["Message", fields.message],
  ].filter(([, value]) => value);

  try {
    await transporter.sendMail({
      from: { name: `${siteConfig.name} website`, address: SMTP_USER },
      to,
      replyTo: fields.email,
      subject: `New enquiry from ${fields.name.replace(/[\r\n]+/g, " ")}`,
      text: rows.map(([label, value]) => `${label}: ${value}`).join("\n\n"),
      html: `<table cellpadding="10" style="border-collapse:collapse;font-family:Arial,sans-serif">${rows
        .map(
          ([label, value]) =>
            `<tr><td style="border:1px solid #ddd"><strong>${label}</strong></td><td style="border:1px solid #ddd;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
        )
        .join("")}</table>`,
    });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("[contact]", error);
    return Response.json({ ok: false, error: "Your message couldn't be sent just now." }, { status: 500 });
  }
}
