"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animates a number up to its target once it enters the viewport.
 * Falls back to the final value immediately under reduced motion or without JS.
 */
export function CountUp({ value, duration = 1100 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const match = /^(\d+)(.*)$/.exec(value);
    if (!match) {
      setDisplay(value);
      return;
    }

    const target = Number(match[1]);
    const suffix = match[2] ?? "";

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(`${target}${suffix}`);
      return;
    }

    setDisplay(`0${suffix}`);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);

          const start = performance.now();
          const step = (now: number) => {
            const progress = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(`${Math.round(target * eased)}${suffix}`);
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

  return <span ref={ref}>{display}</span>;
}
