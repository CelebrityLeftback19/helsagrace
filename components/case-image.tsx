"use client";

import { ImageOff } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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
  className?: string;
};

/**
 * A product screenshot rendered at its natural aspect ratio (no cropping).
 * Reveals with a clip-path wipe as it enters the viewport and lifts slightly
 * on hover — motion in service of showing the real work.
 *
 * If the asset is not yet in `public/images`, it degrades to a labelled
 * placeholder instead of a broken image.
 */
export function CaseImage({
  src,
  alt,
  width = 1600,
  height = 807,
  reveal = true,
  onError,
  className,
}: CaseImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(!reveal);

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

  function fail() {
    setFailed(true);
    onError?.();
  }

  const shotAttr = reveal ? "" : undefined;

  if (failed) {
    return (
      <div
        ref={ref}
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
    <div
      ref={ref}
      data-shot={shotAttr}
      data-visible={visible}
      className={cn(
        "group/shot w-full overflow-hidden rounded-[10px] border border-border bg-base",
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
    </div>
  );
}
