"use client";

import { useEffect } from "react";

import { prefersReducedMotion } from "@/components/motion/smooth-scroll";

const COLORS = ["#5B4FE8", "#3D33C4", "#7A6FF0", "#EEECFF"];

/**
 * A tight purple splash at the pointer on every primary click. Pure DOM + Web
 * Animations API (no canvas, no dependency); each burst removes itself once it
 * finishes. Disabled for reduced motion.
 */
export function ClickBurst() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    function burst(x: number, y: number) {
      const container = document.createElement("div");
      container.setAttribute("aria-hidden", "true");
      container.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:0;height:0;pointer-events:none;z-index:290;`;
      document.body.appendChild(container);

      // Note: every element starts at opacity 0 and the animation uses
      // fill:"forwards". Without that, Web Animations snap the element back to
      // its base style (opacity 1) the instant the animation ends — which left
      // a lasting dot at the click point.
      const animate = (el: HTMLElement, keyframes: Keyframe[], options: KeyframeAnimationOptions) =>
        el.animate(keyframes, { fill: "forwards", ...options });

      // Brief bright core.
      const core = document.createElement("span");
      core.style.cssText =
        "position:absolute;left:0;top:0;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:9999px;opacity:0;" +
        "background:radial-gradient(circle, rgba(91,79,232,0.95) 0%, rgba(91,79,232,0) 70%);";
      container.appendChild(core);
      animate(
        core,
        [
          { transform: "scale(0.4)", opacity: 0.95 },
          { transform: "scale(3)", opacity: 0 },
        ],
        { duration: 260, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
      );

      // Expanding splash ring.
      const ring = document.createElement("span");
      ring.style.cssText = `position:absolute;left:0;top:0;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:9999px;border:2px solid ${COLORS[0]};opacity:0;`;
      container.appendChild(ring);
      animate(
        ring,
        [
          { transform: "scale(0.3)", opacity: 0.85 },
          { transform: "scale(2.6)", opacity: 0 },
        ],
        { duration: 460, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
      );

      // Dense droplets in a tight radius.
      const count = 18;
      for (let i = 0; i < count; i += 1) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
        let distance = 9 + Math.random() * 24;
        if (i % 6 === 0) distance += 14; // a few further fliers
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;
        const size = 2 + Math.random() * 3.5;

        const droplet = document.createElement("span");
        droplet.style.cssText = `position:absolute;left:0;top:0;width:${size}px;height:${size}px;margin:${-size / 2}px 0 0 ${-size / 2}px;border-radius:9999px;background:${COLORS[i % COLORS.length]};opacity:0;`;
        container.appendChild(droplet);

        animate(
          droplet,
          [
            { transform: "translate3d(0, 0, 0) scale(1)", opacity: 1 },
            { transform: `translate3d(${dx}px, ${dy + 10}px, 0) scale(0.2)`, opacity: 0 },
          ],
          {
            duration: 380 + Math.random() * 220,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          },
        );
      }

      window.setTimeout(() => container.remove(), 750);
    }

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      burst(event.clientX, event.clientY);
    };

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return null;
}
