import { ArrowRight } from "lucide-react";
import type { CSSProperties } from "react";

import { resolveIcon } from "@/lib/icons";
import type { Discipline, SiteSettings } from "@/lib/content";

/** Sets the animation delay via the `--d` custom property read by the CSS. */
const delay = (milliseconds: number): CSSProperties =>
  ({ "--d": `${milliseconds}ms` }) as CSSProperties;

export function Hero({ site, disciplines }: { site: SiteSettings; disciplines: Discipline[] }) {
  return (
    <section
      id="hero"
      data-hero
      aria-labelledby="hero-heading"
      className="flex min-h-[92vh] items-center border-b border-border px-[var(--px)] pb-24 pt-[calc(var(--nav-h)+80px)]"
    >
      <div className="mx-auto grid w-full max-w-[var(--max)] items-center gap-[60px] min-[900px]:grid-cols-[1fr_340px]">
        <div>
          <p
            data-hero-item
            style={delay(0)}
            className="mb-7 inline-flex items-center gap-2 text-[13px] font-medium text-muted before:block before:h-px before:w-6 before:bg-accent before:content-['']"
          >
            {site.heroEyebrow}
          </p>

          <h1
            id="hero-heading"
            className="mb-6 font-serif text-[clamp(52px,7vw,88px)] font-normal leading-[1] tracking-[-0.03em]"
          >
            <span className="hero-line block">
              <span className="block" style={delay(90)}>
                {site.heroLine1}
              </span>
            </span>
            <span className="hero-line block">
              <span className="block italic text-accent" style={delay(210)}>
                {site.heroLine2}
              </span>
            </span>
          </h1>

          <p
            data-hero-item
            style={delay(340)}
            className="mb-10 max-w-[520px] text-[clamp(16px,2vw,19px)] font-light leading-[1.55] text-ink-mid"
          >
            {site.fullName} — <strong className="font-medium text-ink">{site.heroStrong}</strong>{" "}
            {site.heroCopy}
          </p>

          <div data-hero-item style={delay(440)} className="flex flex-wrap items-center gap-4">
            <a
              href="#work"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-[15px] font-medium text-white transition-[background,transform] hover:-translate-y-px hover:bg-accent"
            >
              View my work
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-[15px] font-medium text-ink-mid transition-colors hover:border-ink hover:text-ink"
            >
              Get in touch
            </a>
          </div>
        </div>

        <div
          aria-label="Disciplines"
          className="flex flex-col gap-3 min-[500px]:grid min-[500px]:grid-cols-2 min-[900px]:flex min-[900px]:flex-col"
        >
          {disciplines.map((discipline, index) => {
            const Icon = resolveIcon(discipline.icon);
            return (
              <div
                key={discipline.label}
                data-hero-item
                style={delay(520 + index * 70)}
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
