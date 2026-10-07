"use client";

import { ArrowRight, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center px-[var(--px)] py-24">
      <div className="w-full max-w-[620px] text-center">
        <p className="mb-5 text-[12px] font-semibold uppercase tracking-[0.24em] text-accent">
          Error
        </p>
        <h1 className="mb-5 font-serif text-[clamp(32px,5.5vw,52px)] font-normal leading-[1.05] tracking-[-0.03em]">
          Something went wrong.
        </h1>
        <p className="mx-auto mb-9 max-w-[46ch] text-base leading-[1.6] text-muted">
          An unexpected error interrupted this page. You can try again, head back to the
          portfolio, or reach out and tell me what happened.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-accent"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-[15px] font-medium text-ink-mid transition-colors hover:border-ink hover:text-ink"
          >
            Back to the portfolio
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 text-[15px] font-medium text-accent hover:underline"
          >
            Contact me
          </Link>
        </div>
      </div>
    </main>
  );
}
