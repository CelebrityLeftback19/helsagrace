"use client";

import { Mail, MailOpen, Reply, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { deleteMessage, setMessageStatus } from "@/app/admin/actions";
import type { ContactMessage } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

export function MessagesList({ initial }: { initial: ContactMessage[] }) {
  const router = useRouter();
  const [messages, setMessages] = useState<ContactMessage[]>(initial);
  const [filter, setFilter] = useState<"all" | "new">("all");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shown = useMemo(
    () => (filter === "new" ? messages.filter((m) => m.status === "new") : messages),
    [messages, filter],
  );

  async function toggleStatus(message: ContactMessage) {
    const next = message.status === "new" ? "read" : "new";
    setBusy(true);
    setError(null);
    const result = await setMessageStatus(message.id, next);
    setBusy(false);
    if (result.ok) {
      setMessages((prev) => prev.map((m) => (m.id === message.id ? { ...m, status: next } : m)));
      router.refresh();
    } else {
      setError(result.error);
    }
  }

  async function remove(message: ContactMessage) {
    if (!window.confirm(`Delete the message from ${message.name}?`)) return;
    setBusy(true);
    setError(null);
    const result = await deleteMessage(message.id);
    setBusy(false);
    if (result.ok) {
      setMessages((prev) => prev.filter((m) => m.id !== message.id));
      router.refresh();
    } else {
      setError(result.error);
    }
  }

  return (
    <div>
      <div className="mb-5 flex items-center gap-2">
        {(["all", "new"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              filter === value
                ? "border-accent bg-accent-light text-accent"
                : "border-border text-ink-mid hover:text-ink",
            )}
          >
            {value === "all" ? "All" : "Unread"}
          </button>
        ))}
      </div>

      {error ? (
        <p role="alert" className="mb-4 text-sm font-medium text-red-600">
          {error}
        </p>
      ) : null}

      {shown.length === 0 ? (
        <p className="rounded-2xl border border-border bg-surface p-8 text-sm text-muted">
          {messages.length === 0
            ? "No messages yet. Submissions from the contact form land here."
            : "Nothing unread."}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {shown.map((message) => {
            const isNew = message.status === "new";
            return (
              <li
                key={message.id}
                className={cn(
                  "rounded-2xl border bg-surface p-5",
                  isNew ? "border-accent" : "border-border",
                )}
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  {isNew ? (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-accent" aria-label="Unread" />
                  ) : null}
                  <span className="font-medium text-ink">{message.name}</span>
                  <a
                    href={`mailto:${message.email}`}
                    className="text-sm text-accent hover:underline"
                  >
                    {message.email}
                  </a>
                  <span className="text-xs text-muted">
                    {message.createdAt ? new Date(message.createdAt).toLocaleString("en-GB") : ""}
                  </span>
                  <span
                    className={cn(
                      "ml-auto rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                      message.emailed
                        ? "border-[#c3eed8] bg-[#edfaf3] text-[#1a7a4a]"
                        : "border-border bg-base text-muted",
                    )}
                  >
                    {message.emailed ? "Emailed" : "Saved"}
                  </span>
                </div>

                {message.subject ? (
                  <p className="mt-2 text-sm font-medium text-ink-mid">{message.subject}</p>
                ) : null}

                <p className="mt-2 whitespace-pre-wrap text-sm leading-[1.65] text-ink-mid">
                  {message.message}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleStatus(message)}
                    disabled={busy}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-ink-mid transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
                  >
                    {isNew ? (
                      <>
                        <MailOpen className="h-3.5 w-3.5" aria-hidden /> Mark read
                      </>
                    ) : (
                      <>
                        <Mail className="h-3.5 w-3.5" aria-hidden /> Mark unread
                      </>
                    )}
                  </button>

                  <a
                    href={`mailto:${message.email}?subject=${encodeURIComponent(
                      message.subject ? `Re: ${message.subject}` : "Re: your message",
                    )}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-ink-mid transition-colors hover:border-accent hover:text-accent"
                  >
                    <Reply className="h-3.5 w-3.5" aria-hidden /> Reply
                  </a>

                  <button
                    type="button"
                    onClick={() => remove(message)}
                    disabled={busy}
                    aria-label={`Delete message from ${message.name}`}
                    className="ml-auto rounded-lg border border-border p-1.5 text-muted transition-colors hover:border-red-300 hover:text-red-600 disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
