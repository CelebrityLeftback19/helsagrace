import { CountUp } from "@/components/count-up";
import { Reveal } from "@/components/reveal";
import { RichText } from "@/components/rich-text";
import type { Stat } from "@/lib/content";

export function AboutSection({
  aboutParagraphs,
  stats,
}: {
  aboutParagraphs: string[];
  stats: Stat[];
}) {
  return (
    <section id="about" aria-labelledby="about-heading" className="px-[var(--px)] py-24">
      <div className="mx-auto max-w-[var(--max)]">
        <Reveal>
          <div className="relative mb-14 flex flex-wrap items-end justify-between gap-3 pb-6">
            <h2
              id="about-heading"
              className="font-serif text-[clamp(32px,4vw,48px)] font-normal leading-[1.1] tracking-[-0.02em]"
            >
              About <em className="italic text-accent">me</em>
            </h2>
            <span aria-hidden className="rule-line absolute inset-x-0 bottom-0 h-px bg-border" />
          </div>
        </Reveal>

        <Reveal>
          <div className="grid items-start gap-12 min-[900px]:grid-cols-[1fr_400px] min-[900px]:gap-20">
            <div>
              {aboutParagraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="mb-5 max-w-[560px] text-[17px] font-light leading-[1.75] text-ink-mid"
                >
                  <RichText text={paragraph} />
                </p>
              ))}
            </div>

            <dl className="overflow-hidden rounded-2xl border border-border bg-surface">
              {stats.map((stat) => (
                <div key={stat.label} className="border-b border-border px-6 py-5 last:border-b-0">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="mb-1 block font-serif text-4xl font-normal leading-none text-ink">
                      <CountUp value={stat.value} />
                      {stat.suffix ? <em className="italic text-accent">{stat.suffix}</em> : null}
                    </span>
                    <span className="block text-[13px] text-muted">{stat.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
