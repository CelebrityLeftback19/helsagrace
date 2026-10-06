"use client";

import { CheckCircle2 } from "lucide-react";
import { useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus("sending");
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          subject: data.get("subject"),
          message: data.get("message"),
          company: data.get("company"),
        }),
      });

      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !result.ok) {
        setStatus("error");
        setError(result.error ?? "Something went wrong. Please try again.");
        return;
      }

      form.reset();
      setStatus("sent");
      window.setTimeout(() => setStatus("idle"), 8000);
    } catch {
      setStatus("error");
      setError("Network error — please check your connection and try again.");
    }
  }

  const fieldClass =
    "w-full rounded-[10px] border border-border bg-base px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-accent focus:shadow-[0_0_0_3px_var(--color-accent-light)]";

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="f-name" className="text-[13px] font-medium text-ink-mid">
          Your name
        </label>
        <input
          id="f-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Name"
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="f-email" className="text-[13px] font-medium text-ink-mid">
          Email address
        </label>
        <input
          id="f-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="f-subject" className="text-[13px] font-medium text-ink-mid">
          What&apos;s this about?
        </label>
        <input
          id="f-subject"
          name="subject"
          type="text"
          placeholder="Freelance project, full-time role, collaboration…"
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="f-message" className="text-[13px] font-medium text-ink-mid">
          Tell me more
        </label>
        <textarea
          id="f-message"
          name="message"
          required
          placeholder="What are you building? What do you need?"
          className={`${fieldClass} min-h-[120px] resize-y`}
        />
      </div>

      {/* Honeypot — hidden from people, tempting to bots. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="f-company">Company</label>
        <input id="f-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {status === "sent" ? (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-2.5 rounded-[10px] border border-[#c3eed8] bg-[#edfaf3] px-4 py-3.5 text-sm font-medium text-[#1a7a4a]"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
          Message sent — I&apos;ll be in touch soon.
        </div>
      ) : null}

      {status === "error" && error ? (
        <div
          role="alert"
          className="rounded-[10px] border border-red-200 bg-red-50 px-4 py-3.5 text-sm font-medium text-red-700"
        >
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={status === "sending"}
        className="self-start rounded-full bg-ink px-7 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
