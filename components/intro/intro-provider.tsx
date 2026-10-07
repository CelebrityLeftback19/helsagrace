"use client";

import { gsap } from "gsap";
import { ArrowDown } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type Lenis from "lenis";

import { prefersReducedMotion, useLenis } from "@/components/motion/smooth-scroll";
import { cn } from "@/lib/utils";

type Slide = { src: string; alt: string };

const IntroContext = createContext<{ ready: boolean }>({ ready: true });

/** `ready` flips true the moment the curtain starts lifting, so the hero
 *  animation is released in sync with the reveal. */
export function useIntro() {
  return useContext(IntroContext);
}

export function IntroProvider({
  children,
  name,
  nameEm,
  tagline,
  images,
}: {
  children: ReactNode;
  name: string;
  nameEm: string;
  tagline: string;
  images: Slide[];
}) {
  const lenis = useLenis();
  const lenisRef = useRef<Lenis | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const introActive = useRef(false);
  const closing = useRef(false);
  const [ready, setReady] = useState(false);
  const [mounted, setMounted] = useState(true);
  const [broken, setBroken] = useState<string[]>([]);
  const [index, setIndex] = useState(0);

  // Keep a ref to Lenis so effects never re-run when it attaches.
  useEffect(() => {
    lenisRef.current = lenis;
    if (lenis && introActive.current) lenis.stop();
  }, [lenis]);

  const finish = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    introActive.current = false;

    // Release the hero as the curtain lifts.
    setReady(true);
    lenisRef.current?.start();
    document.body.style.overflow = "";

    const overlay = overlayRef.current;
    if (!overlay) {
      setMounted(false);
      return;
    }
    gsap
      .timeline({ onComplete: () => setMounted(false) })
      .to("[data-intro-content]", { opacity: 0, y: -24, duration: 0.4, ease: "power2.in" }, 0)
      .to(overlay, { yPercent: -100, duration: 0.9, ease: "power3.inOut" }, 0.12);
  }, []);

  useEffect(() => {
    const seen =
      typeof window !== "undefined" && window.sessionStorage.getItem("hg-intro") === "1";

    if (prefersReducedMotion() || seen) {
      setReady(true);
      setMounted(false);
      return;
    }

    window.sessionStorage.setItem("hg-intro", "1");
    introActive.current = true;
    lenisRef.current?.stop();
    document.body.style.overflow = "hidden";

    const context = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from("[data-intro-eyebrow]", { y: 12, opacity: 0, duration: 0.5 }, 0.15)
        .from(".intro-word", { yPercent: 120, duration: 0.9, stagger: 0.09 }, 0.25)
        .from("[data-intro-tag]", { y: 14, opacity: 0, duration: 0.6 }, 0.95)
        .from("[data-intro-bar]", { scaleX: 0, duration: 2.2, ease: "none" }, 0.5);
    }, overlayRef);

    const timer = window.setTimeout(finish, 3000);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " " || event.key === "Escape") finish();
    };
    const onWheel = () => finish();
    const onPointer = () => finish();

    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("pointerdown", onPointer);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("pointerdown", onPointer);
      document.body.style.overflow = "";
      context.revert();
    };
  }, [finish]);

  const usable = images.filter((image) => !broken.includes(image.src));
  useEffect(() => {
    if (!mounted || prefersReducedMotion() || usable.length < 2) return;
    const timer = window.setInterval(() => setIndex((value) => value + 1), 2600);
    return () => window.clearInterval(timer);
  }, [mounted, usable.length]);

  const active = usable.length ? index % usable.length : -1;
  const base = name.endsWith(nameEm) ? name.slice(0, name.length - nameEm.length) : name;

  return (
    <IntroContext.Provider value={{ ready }}>
      {children}

      {mounted ? (
        <div
          ref={overlayRef}
          className="intro-overlay fixed inset-0 z-[292] overflow-hidden bg-ink text-white"
          aria-label="Welcome to the HelsaGrace portfolio"
        >
          <div aria-hidden className="absolute inset-0">
            {usable.map((image, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={image.src}
                src={image.src}
                alt=""
                onError={() => setBroken((prev) => [...prev, image.src])}
                className={cn(
                  "absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-out",
                  i === active ? "kenburns opacity-30" : "opacity-0",
                )}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/85 to-ink" />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 80% at 50% 8%, rgba(91,79,232,0.32), transparent 62%)",
              }}
            />
          </div>

          <div
            data-intro-content
            className="relative z-10 flex h-full flex-col items-center justify-center px-[var(--px)] text-center"
          >
            <p
              data-intro-eyebrow
              className="mb-6 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/45"
            >
              Portfolio
            </p>

            <h1 className="mb-5 font-serif text-[clamp(44px,9vw,104px)] font-normal leading-[1] tracking-[-0.03em]">
              <span className="hero-mask">
                <span className="intro-word inline-block">{base}</span>
              </span>
              <span className="hero-mask">
                <span className="intro-word inline-block italic text-[#a79fff]">{nameEm}</span>
              </span>
            </h1>

            <p
              data-intro-tag
              className="max-w-[38ch] text-[clamp(15px,1.8vw,18px)] font-light leading-[1.6] text-white/60"
            >
              {tagline}
            </p>

            <span
              data-intro-bar
              aria-hidden
              className="mt-10 block h-px w-40 origin-left bg-white/30"
            />

            <button
              type="button"
              onClick={finish}
              data-cursor="link"
              className="mt-10 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-white/45 transition-colors hover:text-white"
            >
              Skip intro
              <ArrowDown className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>
        </div>
      ) : null}
    </IntroContext.Provider>
  );
}
