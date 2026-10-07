import { Reveal } from "@/components/reveal";
import type { ProcessStep } from "@/lib/content";

export function ProcessSection({ processSteps }: { processSteps: ProcessStep[] }) {
  return (
    <section id="process" aria-labelledby="process-heading" className="px-[var(--px)] py-24">
      <div className="mx-auto max-w-[var(--max)]">
        <Reveal>
          <div className="relative mb-14 flex flex-wrap items-end justify-between gap-3 pb-6">
            <h2
              id="process-heading"
              className="font-serif text-[clamp(32px,4vw,48px)] font-normal leading-[1.1] tracking-[-0.02em]"
            >
              How I <em className="italic text-accent">think</em>
            </h2>
            <span className="text-[13px] font-medium text-muted">The approach</span>
            <span aria-hidden className="rule-line absolute inset-x-0 bottom-0 h-px bg-border" />
          </div>
        </Reveal>

        <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border max-[700px]:grid-cols-1 min-[700px]:grid-cols-2">
          {processSteps.map((step, index) => (
            <div key={step.numeral} className="bg-surface px-8 py-9">
              <Reveal delay={index * 40}>
                <span
                  aria-hidden
                  className="mb-4 block font-serif text-[40px] italic leading-none text-accent-light"
                >
                  {step.numeral}
                </span>
                <h3 className="mb-2.5 font-serif text-[22px] font-normal">{step.title}</h3>
                <p className="text-sm leading-[1.65] text-muted">{step.description}</p>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
