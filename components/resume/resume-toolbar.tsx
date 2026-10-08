"use client";

import { Printer } from "lucide-react";
import Link from "next/link";

import { resumeVariants } from "@/lib/resume";
import { cn } from "@/lib/utils";

export function ResumeToolbar({ active }: { active: string }) {
  return (
    <div className="no-print sticky top-0 z-20 mb-6 border-b border-border bg-base/92 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[820px] flex-wrap items-center gap-2 px-4 py-3">
        <span className="mr-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
          Target role
        </span>

        {resumeVariants.map((variant) => (
          <Link
            key={variant.slug}
            href={`/resume/${variant.slug}`}
            className={cn(
              "rounded-full border px-3 py-1 text-[12px] font-medium transition-colors",
              variant.slug === active
                ? "border-accent bg-accent-light text-accent"
                : "border-border text-ink-mid hover:border-ink hover:text-ink",
            )}
          >
            {variant.label}
          </Link>
        ))}

        <button
          type="button"
          onClick={() => window.print()}
          className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-accent"
        >
          <Printer className="h-3.5 w-3.5" aria-hidden />
          Print / Save as PDF
        </button>
      </div>
    </div>
  );
}
