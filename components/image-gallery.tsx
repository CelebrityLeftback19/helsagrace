"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

export type GalleryImage = { src: string; alt: string; title?: string };

/**
 * A full-screen image viewer with previous/next controls and a numbered index,
 * so a set of images can be browsed without closing between each one.
 * Portalled to <body> so it escapes any transformed ancestor (e.g. the drawer).
 */
export function GalleryOverlay({
  images,
  index,
  onIndex,
  onClose,
}: {
  images: GalleryImage[];
  index: number;
  onIndex: (next: number) => void;
  onClose: () => void;
}) {
  const count = images.length;
  const current = images[index];

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowRight") onIndex(Math.min(index + 1, count - 1));
      else if (event.key === "ArrowLeft") onIndex(Math.max(index - 1, 0));
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [index, count, onIndex, onClose]);

  if (!current) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={current.alt}
      data-print-hide
      onClick={onClose}
      className="fixed inset-0 z-[296] flex flex-col bg-ink/93 backdrop-blur-sm"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="flex items-center justify-between gap-4 px-4 py-3 text-white"
      >
        <span className="truncate text-sm font-medium">{current.title}</span>
        <div className="flex shrink-0 items-center gap-3">
          <span className="text-xs tabular-nums text-white/60">
            {index + 1} / {count}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
          >
            <X className="h-4 w-4" aria-hidden />
            Close
          </button>
        </div>
      </div>

      <div
        onClick={(event) => event.stopPropagation()}
        className="flex min-h-0 flex-1 items-center justify-center px-4"
      >
        <figure className="flex max-h-full flex-col items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.src}
            alt={current.alt}
            className="max-h-[68vh] max-w-[92vw] rounded-lg object-contain shadow-2xl"
          />
          <figcaption className="mt-3 max-w-[80ch] text-center text-xs leading-relaxed text-white/70">
            {current.alt}
          </figcaption>
        </figure>
      </div>

      <div
        onClick={(event) => event.stopPropagation()}
        className="flex items-center justify-center gap-4 px-4 pb-6 pt-2"
      >
        <button
          type="button"
          onClick={() => onIndex(index - 1)}
          disabled={index === 0}
          aria-label="Previous image"
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20",
            index === 0 && "cursor-not-allowed opacity-30 hover:bg-white/10",
          )}
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>

        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {images.map((image, i) => (
            <button
              key={`${image.src}-${i}`}
              type="button"
              onClick={() => onIndex(i)}
              aria-label={`View image ${i + 1} of ${count}`}
              aria-current={i === index}
              className={cn(
                "h-7 min-w-7 rounded-full px-2 text-xs font-medium tabular-nums transition-colors",
                i === index
                  ? "bg-accent text-white"
                  : "bg-white/10 text-white/50 hover:bg-white/20 hover:text-white",
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onIndex(index + 1)}
          disabled={index === count - 1}
          aria-label="Next image"
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20",
            index === count - 1 && "cursor-not-allowed opacity-30 hover:bg-white/10",
          )}
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </div>,
    document.body,
  );
}
