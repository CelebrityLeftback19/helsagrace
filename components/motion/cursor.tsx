"use client";

import { useEffect, useRef, useState } from "react";

import { prefersReducedMotion } from "@/components/motion/smooth-scroll";
import { cn } from "@/lib/utils";

/**
 * A dot + trailing ring cursor that grows and labels itself over elements
 * carrying `data-cursor` (and an optional `data-cursor-label`). Only enabled
 * for precise pointers with motion allowed; the native cursor is restored for
 * text fields.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || prefersReducedMotion()) return;

    document.documentElement.classList.add("has-custom-cursor");

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { ...pointer };
    let frame = 0;

    const onMouseMove = (event: MouseEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };

    const onMouseOver = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest?.("[data-cursor]");
      if (target) {
        setActive(true);
        setLabel(target.getAttribute("data-cursor-label"));
      } else {
        setActive(false);
        setLabel(null);
      }
    };

    const loop = () => {
      ring.x += (pointer.x - ring.x) * 0.16;
      ring.y += (pointer.y - ring.y) * 0.16;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseover", onMouseOver, { passive: true });

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="cursor-el pointer-events-none fixed left-0 top-0 z-[300] h-1.5 w-1.5 items-center justify-center rounded-full bg-accent"
      />
      <div
        ref={ringRef}
        aria-hidden
        className={cn(
          "cursor-el pointer-events-none fixed left-0 top-0 z-[299] items-center justify-center rounded-full text-[10px] font-medium uppercase tracking-[0.14em] transition-[width,height,background-color,color,border-color] duration-200 ease-out",
          active
            ? "h-[68px] w-[68px] border border-transparent bg-ink text-white"
            : "h-8 w-8 border border-ink/25 bg-transparent text-transparent",
        )}
      >
        {label ? <span>{label}</span> : null}
      </div>
    </>
  );
}
