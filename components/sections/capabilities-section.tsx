"use client";

import { ArrowUpRight, Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";

import { CaseImage } from "@/components/case-image";
import { GalleryOverlay, type GalleryImage } from "@/components/image-gallery";
import { useProjectDrawer } from "@/components/project-drawer";
import { Reveal } from "@/components/reveal";
import { resolveIcon } from "@/lib/icons";
import type { Capability, Project } from "@/lib/content";
import { cn } from "@/lib/utils";

function proofFor(capability: Capability, projects: Project[]) {
  const project = capability.projectSlug
    ? projects.find((item) => item.slug === capability.projectSlug)
    : undefined;
  const index = capability.proofIndex ?? 0;
  const screen = project?.screens[index] ?? project?.screens[0];
  return { project, screen };
}

export function CapabilitiesSection({
  capabilities,
  projects,
}: {
  capabilities: Capability[];
  projects: Project[];
}) {
  const drawer = useProjectDrawer();
  const [openIndex, setOpenIndex] = useState(0);
  const [canHover, setCanHover] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);

  // Flatten every capability proof into one browsable gallery, keeping a map
  // from capability index to gallery index.
  const proofs: GalleryImage[] = [];
  const proofIndexFor = capabilities.map((capability) => {
    const { screen } = proofFor(capability, projects);
    if (!screen) return null;
    proofs.push({ src: screen.src, alt: screen.alt, title: capability.title });
    return proofs.length - 1;
  });

  useEffect(() => {
    setCanHover(
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-heading"
      className="bg-ink px-[var(--px)] py-24"
    >
      <div className="mx-auto max-w-[var(--max)]">
        <Reveal>
          <div className="relative mb-6 flex flex-wrap items-end justify-between gap-3 pb-6">
            <h2
              id="capabilities-heading"
              className="font-serif text-[clamp(32px,4vw,48px)] font-normal leading-[1.1] tracking-[-0.02em] text-white"
            >
              What I <em className="italic text-[#a79fff]">bring</em>
            </h2>
            <span className="text-[13px] font-medium text-white/35">
              Every claim, backed by shipped work
            </span>
            <span aria-hidden className="rule-line absolute inset-x-0 bottom-0 h-px bg-white/10" />
          </div>
        </Reveal>

        <div className="border-t border-white/10">
          {capabilities.map((capability, index) => {
            const Icon = resolveIcon(capability.icon);
            const isOpen = openIndex === index;
            const { project, screen } = proofFor(capability, projects);
            const proofIndex = proofIndexFor[index] ?? null;

            return (
              <div key={capability.title} className="border-b border-white/10">
                <button
                  id={`cap-trigger-${index}`}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`cap-panel-${index}`}
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  onMouseEnter={() => canHover && setOpenIndex(index)}
                  className="group grid w-full grid-cols-[32px_1fr_auto] items-center gap-5 py-6 text-left"
                >
                  <span
                    aria-hidden
                    className="font-serif text-lg italic text-white/50 transition-colors group-hover:text-[#a79fff]"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="flex min-w-0 items-center gap-3.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[#a79fff]">
                      <Icon className="h-[18px] w-[18px]" aria-hidden strokeWidth={1.8} />
                    </span>
                    <span
                      className={cn(
                        "font-serif text-[clamp(22px,3vw,32px)] font-normal leading-[1.15] transition-colors",
                        isOpen ? "text-white" : "text-white/70 group-hover:text-white",
                      )}
                    >
                      {capability.title}
                    </span>
                  </span>

                  <span
                    aria-hidden
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border transition-colors",
                      isOpen
                        ? "border-white/40 text-white"
                        : "border-white/15 text-white/50 group-hover:border-white/40 group-hover:text-white",
                    )}
                  >
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>

                <div
                  id={`cap-panel-${index}`}
                  role="region"
                  aria-labelledby={`cap-trigger-${index}`}
                  className={cn(
                    "grid transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <div
                      {...(!isOpen ? { inert: true } : {})}
                      className="grid gap-8 pb-10 min-[820px]:grid-cols-[1.1fr_1fr] min-[820px]:gap-12"
                    >
                      <div>
                        {screen ? (
                          <CaseImage
                            src={screen.src}
                            alt={screen.alt}
                            width={screen.width}
                            height={screen.height}
                            reveal={false}
                            onOpen={
                              proofIndex !== null
                                ? () => setGalleryIndex(proofIndex)
                                : undefined
                            }
                          />
                        ) : (
                          <div className="flex aspect-[16/9] items-center justify-center rounded-[10px] border border-white/10 bg-white/[0.03] text-xs text-white/40">
                            Screenshot coming soon
                          </div>
                        )}
                      </div>

                      <div className="min-[820px]:pt-1">
                        <p className="mb-5 max-w-[46ch] text-[15px] leading-[1.65] text-white/55">
                          {capability.description}
                        </p>
                        <p className="mb-6 max-w-[30ch] font-serif text-[clamp(19px,2.2vw,25px)] font-normal leading-[1.35] text-white">
                          &ldquo;{capability.decision}&rdquo;
                        </p>
                        {project && drawer ? (
                          <button
                            type="button"
                            onClick={() => drawer.openProject(project.slug)}
                            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-white/60 hover:bg-white/5"
                          >
                            View the {project.name} case study
                            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {galleryIndex !== null ? (
        <GalleryOverlay
          images={proofs}
          index={galleryIndex}
          onIndex={setGalleryIndex}
          onClose={() => setGalleryIndex(null)}
        />
      ) : null}
    </section>
  );
}
