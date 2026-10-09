"use client";

import { Eye, ImageOff, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

type CaseImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  /** Animate into view on scroll (default true). */
  reveal?: boolean;
  /** Called once if the image fails to load. */
  onError?: () => void;
  /** When provided, clicking opens this instead of the built-in viewer. */
  onOpen?: () => void;
  className?: string;
};

/**
 * A product screenshot rendered at its natural aspect ratio (no cropping).
 *
 * Clicking it opens a full-screen viewer. If the asset is missing, it degrades
 * to a labelled placeholder instead of a broken image.
 */
export function CaseImage({
  src,
  alt,
  width = 1600,
  height = 807,
  reveal = true,
  onError,
  onOpen,
  className,
}: CaseImageProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(!reveal);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!reveal) {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reveal]);

  // Escape closes the viewer.
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function fail() {
    setFailed(true);
    onError?.();
  }

  const shotAttr = reveal ? "" : undefined;

  if (failed) {
    return (
      <div
        data-shot={shotAttr}
        data-visible={visible}
        role="img"
        aria-label={alt}
        style={{ aspectRatio: `${width} / ${height}` }}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-2 rounded-[10px] border border-border bg-base px-6 text-center",
          className,
        )}
      >
        <ImageOff className="h-5 w-5 text-muted" aria-hidden />
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
          Screenshot
        </span>
        <span className="max-w-[46ch] text-xs leading-relaxed text-ink-mid">{alt}</span>
      </div>
    );
  }

  return (
    <>
      <button
        ref={ref}
        type="button"
        onClick={() => (onOpen ? onOpen() : setOpen(true))}
        data-cursor="view"
        data-cursor-label="View"
        data-shot={shotAttr}
        data-visible={visible}
        aria-label={`View larger: ${alt}`}
        className={cn(
          "group/shot relative block w-full overflow-hidden rounded-[10px] border border-border bg-base",
          className,
        )}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(max-width: 768px) 100vw, 640px"
          className="h-auto w-full transition-transform duration-500 ease-out group-hover/shot:scale-[1.02]"
          onError={fail}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition duration-200 group-hover/shot:bg-ink/25 group-hover/shot:opacity-100"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-ink shadow-lg">
            <Eye className="h-5 w-5" />
          </span>
        </span>
      </button>

      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label={alt}
              data-print-hide
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[296] flex items-center justify-center bg-ink/92 p-4 backdrop-blur-sm"
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close image"
                className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
              >
                <X className="h-4 w-4" aria-hidden />
                Close
              </button>

              <figure onClick={(event) => event.stopPropagation()} className="max-h-[90vh]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={alt}
                  className="max-h-[84vh] max-w-[94vw] rounded-lg object-contain shadow-2xl"
                />
                <figcaption className="mt-3 max-w-[80ch] text-center text-xs leading-relaxed text-white/70">
                  {alt}
                </figcaption>
              </figure>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
