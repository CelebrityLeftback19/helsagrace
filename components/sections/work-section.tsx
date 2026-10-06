import { ProjectStrip } from "@/components/project-drawer";
import { Reveal } from "@/components/reveal";
import type { Project } from "@/lib/content";

export function WorkSection({ projects }: { projects: Project[] }) {
  return (
    <section id="work" aria-labelledby="work-heading" className="px-[var(--px)] py-24">
      <div className="mx-auto max-w-[var(--max)]">
        <Reveal>
          <div className="mb-14 flex flex-wrap items-end justify-between gap-3 border-b border-border pb-6">
            <h2
              id="work-heading"
              className="font-serif text-[clamp(32px,4vw,48px)] font-normal leading-[1.1] tracking-[-0.02em]"
            >
              Selected <em className="italic text-accent">work</em>
            </h2>
            <span className="text-[13px] font-medium text-muted">
              {projects.length} projects
            </span>
          </div>
        </Reveal>

        <div role="list" className="flex flex-col">
          {projects.map((project) => (
            <Reveal key={project.slug} role="listitem">
              <ProjectStrip project={project} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
