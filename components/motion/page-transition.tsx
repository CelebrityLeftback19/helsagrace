"use client";

import { gsap } from "gsap";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { prefersReducedMotion } from "@/components/motion/smooth-scroll";

/**
 * A synchronized page transition: an ink curtain rises to cover, the route
 * swaps underneath it, then the curtain continues upward to reveal the new
 * page. Internal link clicks are intercepted so the cover and the swap stay in
 * step (no hard cut). Disabled for reduced motion.
 */
export function PageTransition() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  const covering = useRef(false);
  const router = useRouter();
  const pathname = usePathname();

  // Reveal the newly-mounted page.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (!covering.current) return; // ignore back/forward without our curtain
    covering.current = false;

    const overlay = overlayRef.current;
    if (!overlay) return;

    if (prefersReducedMotion()) {
      gsap.set(overlay, { yPercent: 100, autoAlpha: 0 });
      return;
    }

    gsap
      .timeline()
      .to(wordRef.current, { opacity: 0, duration: 0.2 }, 0)
      .to(overlay, { yPercent: -100, duration: 0.6, ease: "power3.inOut" }, 0)
      .set(overlay, { yPercent: 100, autoAlpha: 0 });
  }, [pathname]);

  // Intercept internal navigations so the curtain plays first.
  useEffect(() => {
    if (prefersReducedMotion()) return;

    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest?.("a");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;

      event.preventDefault();

      const destination = url.pathname + url.search;
      const overlay = overlayRef.current;

      const go = () => {
        router.push(destination);
        if (url.hash) {
          window.setTimeout(() => {
            document.getElementById(url.hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
          }, 520);
        }
      };

      if (!overlay) {
        go();
        return;
      }

      covering.current = true;
      gsap
        .timeline()
        .set(overlay, { yPercent: 100, autoAlpha: 1 })
        .to(overlay, { yPercent: 0, duration: 0.6, ease: "power3.inOut", onComplete: go })
        .to(wordRef.current, { opacity: 0.9, duration: 0.3 }, 0.2);
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return (
    <div
      ref={overlayRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[295]"
      style={{ transform: "translateY(100%)", opacity: 0, visibility: "hidden" }}
    >
      <div className="flex h-full w-full items-center justify-center bg-ink">
        <div ref={wordRef} className="font-serif text-2xl text-white opacity-0">
          Helsa<em className="italic text-[#a79fff]">Grace</em>
        </div>
      </div>
    </div>
  );
}
