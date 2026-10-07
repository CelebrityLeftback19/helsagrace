"use client";

import { ArrowRight, RotateCcw } from "lucide-react";
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
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink px-[var(--px)] text-center text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(110% 80% at 50% 0%, rgba(91,79,232,0.30), transparent 60%)",
        }}
      />

      <p className="relative mb-6 inline-flex items-center gap-3 text-[13px] font-medium text-white/50">
        <span aria-hidden className="block h-px w-6 bg-accent" />
        Something interrupted the frame
      </p>

      <h1 className="relative mb-6 max-w-[18ch] font-serif text-[clamp(36px,6vw,68px)] font-normal leading-[1.04] tracking-[-0.03em]">
        A rough cut.
      </h1>

      <p className="relative mb-10 max-w-[46ch] text-[clamp(15px,1.8vw,18px)] font-light leading-[1.6] text-white/65">
        An error broke this scene. Run the take again, or head back to the portfolio.
      </p>

      <div className="relative flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={reset}
          data-cursor="link"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-accent-dark"
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          Try again
        </button>
        <a
          href="/"
          data-cursor="link"
          className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-[15px] font-medium text-white/80 transition-colors hover:border-white hover:text-white"
        >
          Back to the portfolio
          <ArrowRight className="h-4 w-4" aria-hidden />
        </a>
      </div>
    </div>
  );
}
