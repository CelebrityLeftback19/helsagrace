"use client";

import { ImageOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type CaseImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

/**
 * A product screenshot rendered at its natural aspect ratio (no cropping).
 * If the asset is not yet in `public/images`, it degrades to a labelled
 * placeholder instead of a broken image, so the case study stays presentable
 * while real captures are added.
 */
export function CaseImage({ src, alt, width = 1600, height = 807 }: CaseImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        style={{ aspectRatio: `${width} / ${height}` }}
        className="flex w-full flex-col items-center justify-center gap-2 rounded-[10px] border border-border bg-base px-6 text-center"
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
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes="(max-width: 768px) 100vw, 640px"
      className="h-auto w-full rounded-[10px] border border-border"
      onError={() => setFailed(true)}
    />
  );
}
