import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { getContent } from "@/lib/cms";
import { saveContactMessage } from "@/lib/contact";
import { renderContactNotification } from "@/lib/email/contact-notification";

export const runtime = "nodejs";

type Body = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  /** Honeypot — must stay empty. */
  company?: unknown;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

// Best-effort in-memory limiter. Resets per server instance; a good first
// line of defence, not a guarantee.
const hits = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > MAX_PER_WINDOW;
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function badRequest(error: string) {
  return NextResponse.json({ ok: false, error }, { status: 400 });
}

/** Sends the notification email via Resend. Returns whether it went out. */
async function sendEmail(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
  reference: string;
  siteUrl: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const recipient = process.env.CONTACT_TO_EMAIL || (await getContent()).site.email;
  const from = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

  const { subject, html, text } = renderContactNotification({
    name: input.name,
    email: input.email,
    subject: input.subject,
    message: input.message,
    reference: input.reference,
    siteUrl: input.siteUrl,
  });

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        // Lets Resend dedupe a retried request instead of sending twice.
        "Idempotency-Key": input.reference,
      },
      body: JSON.stringify({
        from,
        to: [recipient],
        reply_to: input.email,
        subject,
        html,
        text,
        // Stops Gmail from collapsing every enquiry into a single thread.
        headers: { "X-Entity-Ref-ID": input.reference },
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error("Resend send failed:", response.status, detail);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Resend threw:", error);
    return false;
  }
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many messages just now — please try again shortly." },
      { status: 429 },
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return badRequest("That request couldn't be read.");
  }

  const name = asString(body.name).trim();
  const email = asString(body.email).trim();
  const subject = asString(body.subject).trim();
  const message = asString(body.message).trim();
  const honeypot = asString(body.company).trim();

  // Bots fill the hidden field; pretend success and drop it.
  if (honeypot) return NextResponse.json({ ok: true });

  if (!name || !email || !message) {
    return badRequest("Please add your name, email and a message.");
  }
  if (!EMAIL_RE.test(email)) {
    return badRequest("That email address doesn't look quite right.");
  }
  if (message.length > 5000) {
    return badRequest("Your message is a little long — try trimming it.");
  }

  const reference = randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase();
  const siteUrl = new URL(request.url).origin;

  const emailed = await sendEmail({
    name,
    email,
    subject,
    message,
    reference,
    siteUrl,
  });
  const stored = await saveContactMessage({ name, email, subject, message, emailed });

  if (!emailed && !stored) {
    return NextResponse.json(
      { ok: false, error: "Couldn't send your message right now. Please email me directly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
