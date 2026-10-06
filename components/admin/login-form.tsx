"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { signIn } from "@/app/admin/actions";
import { Field, inputClass } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

export function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const result = await signIn(email, password);
    if (result.ok) {
      const target = next && next.startsWith("/admin") ? next : "/admin";
      router.replace(target);
      router.refresh();
      return;
    }

    setSubmitting(false);
    setError(result.error);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Email">
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Password">
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={inputClass}
        />
      </Field>

      {error ? (
        <p role="alert" className="text-sm font-medium text-red-600">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className={cn(
          "rounded-full bg-ink px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent",
          submitting && "opacity-60",
        )}
      >
        {submitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
