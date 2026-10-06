import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export const inputClass =
  "w-full rounded-lg border border-border bg-base px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-accent focus:shadow-[0_0_0_3px_var(--color-accent-light)]";

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-xs font-semibold uppercase tracking-[0.05em] text-muted">
        {label}
      </span>
      {children}
      {hint ? <span className="text-xs text-muted">{hint}</span> : null}
    </label>
  );
}

export function AdminCard({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-border bg-surface p-6", className)}>
      {title ? (
        <header className="mb-5">
          <h2 className="font-serif text-xl">{title}</h2>
          {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}
