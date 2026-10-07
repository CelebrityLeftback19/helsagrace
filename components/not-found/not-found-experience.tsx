"use client";

import { gsap } from "gsap";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Magnetic } from "@/components/motion/magnetic";
import { MaskedWords } from "@/components/motion/masked-words";
import { prefersReducedMotion } from "@/components/motion/smooth-scroll";
import type { SiteSettings } from "@/lib/content";
import { cn } from "@/lib/utils";

type Slide = { src: string; alt: string };

export function NotFoundExperience({
  site,
  images,
  projectNames,
}: {
  site: SiteSettings;
  images: Slide[];
  projectNames: string[];
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [broken, setBroken] = useState<string[]>([]);

  const usable = images.filter((image) => !broken.includes(image.src));

  // Slow slideshow through the real work.
  useEffect(() => {
    if (prefersReducedMotion() || usable.length < 2) return;
    const timer = window.setInterval(() => setIndex((value) => value + 1), 4200);
    return () => window.clearInterval(timer);
  }, [usable.length]);

  // Title-sequence entrance.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out", duration: 0.8 } })
        .from("[data-nf-nav]", { y: -18, opacity: 0, duration: 0.7 }, 0)
        .from("[data-nf-eyebrow]", { y: 14, opacity: 0, duration: 0.5 }, 0.15)
        .from(".hero-word", { yPercent: 120, duration: 0.9, stagger: 0.08 }, 0.25)
        .from("[data-nf-body]", { y: 18, opacity: 0 }, 0.7)
        .from("[data-nf-actions]", { y: 18, opacity: 0 }, 0.85)
        .from("[data-nf-strip]", { opacity: 0, duration: 0.8 }, 1)
        .from("[data-nf-guide]", { opacity: 0, scale: 0.7, duration: 0.5 }, 1.1);
    }, root);

    return () => context.revert();
  }, []);

  const active = usable.length ? index % usable.length : -1;
  const lockedLinks = ["Work", "Capabilities", "About"];

  return (
    <div
      ref={rootRef}
      className="relative flex min-h-screen flex-col overflow-hidden bg-ink text-white"
    >
      {/* Slideshow backdrop */}
      <div aria-hidden className="absolute inset-0">
        {usable.map((image, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={image.src}
            src={image.src}
            alt=""
            onError={() => setBroken((prev) => [...prev, image.src])}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms] ease-out",
              i === active ? "kenburns opacity-25" : "opacity-0",
            )}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/85 to-ink" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 85% at 50% 0%, rgba(91,79,232,0.30), transparent 62%)",
          }}
        />
      </div>

      {/* Locked navigation with a blinking guide */}
      <nav
        data-nf-nav
        aria-label="Navigation (disabled on this page)"
        className="relative z-10 mx-auto flex w-full max-w-[var(--max)] items-center justify-between px-[var(--px)] py-6"
      >
        <a href="/" data-cursor="link" className="relative font-serif text-xl text-white">
          Helsa<em className="italic text-[#a79fff]">{site.nameEm}</em>
          <span
            data-nf-guide
            className="guide-blink absolute -bottom-8 left-0 whitespace-nowrap rounded-full bg-accent px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_0_0_4px_rgba(91,79,232,0.18)]"
          >
            Start here
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex" aria-hidden>
          {lockedLinks.map((link) => (
            <span key={link} className="text-sm font-medium text-white/25 line-through decoration-white/20">
              {link}
            </span>
          ))}
          <span className="rounded-full bg-white/10 px-5 py-2 text-sm font-medium text-white/25">
            Get in touch
          </span>
        </div>
      </nav>

      {/* Welcome */}
      <div className="relative z-10 mx-auto flex w-full max-w-[var(--max)] flex-1 flex-col justify-center px-[var(--px)] pb-16 pt-10">
        <p
          data-nf-eyebrow
          className="mb-6 inline-flex items-center gap-3 text-[13px] font-medium text-white/50 before:block before:h-px before:w-6 before:bg-accent before:content-['']"
        >
          404 — nothing lives at this address
        </p>

        <h1 className="mb-6 max-w-[15ch] font-serif text-[clamp(40px,7vw,84px)] font-normal leading-[1.02] tracking-[-0.03em]">
          <MaskedWords text="Welcome to" />{" "}
          <span className="italic text-[#a79fff]">
            <MaskedWords text={site.name} />
          </span>
        </h1>

        <p data-nf-body className="mb-10 max-w-[52ch] text-[clamp(16px,2vw,19px)] font-light leading-[1.6] text-white/65">
          The page you were after doesn&apos;t exist — it may have moved, or it was never here.
          But the work is. Let me show you in.
        </p>

        <div data-nf-actions className="flex flex-wrap items-center gap-4">
          <Magnetic>
            <a
              href="/"
              data-cursor="link"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-accent-dark"
            >
              Enter the portfolio
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href="/#work"
              data-cursor="link"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-[15px] font-medium text-white/80 transition-colors hover:border-white hover:text-white"
            >
              Jump to the work
            </a>
          </Magnetic>
        </div>
      </div>

      {/* Bottom strip — a hint of the work behind the welcome */}
      <div
        data-nf-strip
        className="relative z-10 border-t border-white/10 px-[var(--px)] py-5"
      >
        <div className="mx-auto flex w-full max-w-[var(--max)] flex-wrap items-center gap-x-3 gap-y-1 text-[12px] uppercase tracking-[0.14em] text-white/40">
          <span className="text-white/25">The portfolio</span>
          {projectNames.map((name, i) => (
            <span key={name} className="flex items-center gap-3">
              {i > 0 ? <span className="text-white/15">·</span> : null}
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
