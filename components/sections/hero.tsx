"use client";

import { gsap } from "gsap";
import { ArrowRight } from "lucide-react";
import { Fragment, useEffect, useRef } from "react";

import { Magnetic } from "@/components/motion/magnetic";
import { prefersReducedMotion } from "@/components/motion/smooth-scroll";
import { resolveIcon } from "@/lib/icons";
import type { Discipline, SiteSettings } from "@/lib/content";

/** Splits a line into word masks so GSAP can reveal each word from below. */
function MaskedWords({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span className="hero-mask">
            <span className="hero-word inline-block">{word}</span>
          </span>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}

export function Hero({ site, disciplines }: { site: SiteSettings; disciplines: Discipline[] }) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out", duration: 0.7 } })
        .from("[data-hero-eyebrow]", { y: 14, opacity: 0, duration: 0.5 })
        .from(".hero-word", { yPercent: 118, duration: 0.85, stagger: 0.055 }, 0.06)
        .from("[data-hero-desc]", { y: 18, opacity: 0 }, 0.32)
        .from("[data-hero-actions]", { y: 18, opacity: 0 }, 0.42)
        .from("[data-hero-card]", { y: 22, opacity: 0, stagger: 0.07 }, 0.5);
    }, root);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="hero"
      aria-labelledby="hero-heading"
      className="flex min-h-[92vh] items-center border-b border-border px-[var(--px)] pb-24 pt-[calc(var(--nav-h)+80px)]"
    >
      <div className="mx-auto grid w-full max-w-[var(--max)] items-center gap-[60px] min-[900px]:grid-cols-[1fr_340px]">
        <div>
          <p
            data-hero-eyebrow
            className="mb-7 inline-flex items-center gap-2 text-[13px] font-medium text-muted before:block before:h-px before:w-6 before:bg-accent before:content-['']"
          >
            {site.heroEyebrow}
          </p>

          <h1
            id="hero-heading"
            className="mb-6 font-serif text-[clamp(40px,9vw,88px)] font-normal leading-[1.02] tracking-[-0.03em]"
          >
            <span className="block">
              <MaskedWords text={site.heroLine1} />
            </span>
            <span className="block italic text-accent">
              <MaskedWords text={site.heroLine2} />
            </span>
          </h1>

          <p
            data-hero-desc
            className="mb-10 max-w-[520px] text-[clamp(16px,2vw,19px)] font-light leading-[1.55] text-ink-mid"
          >
            {site.fullName} — <strong className="font-medium text-ink">{site.heroStrong}</strong>{" "}
            {site.heroCopy}
          </p>

          <div data-hero-actions className="flex flex-wrap items-center gap-4">
            <Magnetic>
              <a
                href="#work"
                data-cursor="link"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-[15px] font-medium text-white transition-[background,transform] hover:-translate-y-px hover:bg-accent"
              >
                View my work
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#contact"
                data-cursor="link"
                className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-[15px] font-medium text-ink-mid transition-colors hover:border-ink hover:text-ink"
              >
                Get in touch
              </a>
            </Magnetic>
          </div>
        </div>

        <div
          aria-label="Disciplines"
          className="flex flex-col gap-3 min-[500px]:grid min-[500px]:grid-cols-2 min-[900px]:flex min-[900px]:flex-col"
        >
          {disciplines.map((discipline) => {
            const Icon = resolveIcon(discipline.icon);
            return (
              <div
                key={discipline.label}
                data-hero-card
                className="flex items-center gap-3.5 rounded-xl border border-border bg-surface px-5 py-4 transition-[border-color,box-shadow] hover:border-accent hover:shadow-[0_0_0_3px_var(--color-accent-light)]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-light text-accent">
                  <Icon className="h-[18px] w-[18px]" aria-hidden />
                </span>
                <span>
                  <span className="block text-sm font-medium text-ink">{discipline.label}</span>
                  <span className="mt-0.5 block text-xs text-muted">{discipline.sub}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
