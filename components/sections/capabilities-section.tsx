import { Reveal } from "@/components/reveal";
import { resolveIcon } from "@/lib/icons";
import type { Capability } from "@/lib/content";

export function CapabilitiesSection({ capabilities }: { capabilities: Capability[] }) {
  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-heading"
      className="bg-ink px-[var(--px)] py-24"
    >
      <div className="mx-auto max-w-[var(--max)]">
        <Reveal>
          <div className="mb-14 flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-6">
            <h2
              id="capabilities-heading"
              className="font-serif text-[clamp(32px,4vw,48px)] font-normal leading-[1.1] tracking-[-0.02em] text-white"
            >
              What I <em className="italic text-[#a79fff]">bring</em>
            </h2>
            <span className="text-[13px] font-medium text-white/35">The full stack</span>
          </div>
        </Reveal>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
          {capabilities.map((capability, index) => {
            const Icon = resolveIcon(capability.icon);
            return (
              <div key={capability.title} className="bg-ink p-8">
                <Reveal delay={index * 40}>
                  <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-[10px] bg-accent/20 text-[#a79fff]">
                    <Icon className="h-[22px] w-[22px]" aria-hidden strokeWidth={1.8} />
                  </span>
                  <h3 className="mb-2.5 font-serif text-xl font-normal text-white">
                    {capability.title}
                  </h3>
                  <p className="text-sm leading-[1.6] text-white/45">{capability.description}</p>
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
