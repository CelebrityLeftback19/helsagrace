"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { CaseImage } from "@/components/case-image";
import { GalleryOverlay } from "@/components/image-gallery";
import { prefersReducedMotion } from "@/components/motion/smooth-scroll";
import { ProjectStrip, useProjectDrawer } from "@/components/project-drawer";
import { Reveal } from "@/components/reveal";
import { TagPill } from "@/components/tag";
import type { Project } from "@/lib/content";

export function WorkSection({ projects }: { projects: Project[] }) {
  const drawer = useProjectDrawer();
  const [active, setActive] = useState(0);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<Array<HTMLDivElement | null>>([]);

  // Rows crossing the viewport's middle drive the sticky preview.
  useEffect(() => {
    const rows = rowsRef.current.filter((row): row is HTMLDivElement => Boolean(row));
    if (rows.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number((entry.target as HTMLElement).dataset.index);
          if (!Number.isNaN(index)) setActive(index);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    rows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, [projects.length]);

  // Entrance reveal for each row.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const rows = rowsRef.current.filter((row): row is HTMLDivElement => Boolean(row));
    if (rows.length === 0) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      rows.forEach((row) => {
        gsap.from(row, {
          y: 26,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 88%", once: true },
        });
      });
    });

    return () => context.revert();
  }, [projects.length]);

  // Crossfade the preview when the active project changes.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = previewRef.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
    );
  }, [active]);

  const current = projects[active] ?? projects[0];
  const screen = current?.screens[0];

  return (
    <section id="work" aria-labelledby="work-heading" className="px-[var(--px)] py-24">
      <div className="mx-auto max-w-[var(--max)]">
        <Reveal>
          <div className="relative mb-14 flex flex-wrap items-end justify-between gap-3 pb-6">
            <h2
              id="work-heading"
              className="font-serif text-[clamp(32px,4vw,48px)] font-normal leading-[1.1] tracking-[-0.02em]"
            >
              Selected <em className="italic text-accent">work</em>
            </h2>
            <span className="text-[13px] font-medium text-muted">{projects.length} projects</span>
            <span aria-hidden className="rule-line absolute inset-x-0 bottom-0 h-px bg-border" />
          </div>
        </Reveal>

        <div className="grid gap-10 min-[1000px]:grid-cols-[1fr_360px] min-[1000px]:gap-16">
          <div role="list">
            {projects.map((project, index) => (
              <div
                key={project.slug}
                role="listitem"
                data-index={index}
                ref={(el) => {
                  rowsRef.current[index] = el;
                }}
              >
                <ProjectStrip
                  project={project}
                  active={active === index}
                  onActivate={() => setActive(index)}
                />
              </div>
            ))}
          </div>

          <aside className="hidden min-[1000px]:block">
            <div className="sticky top-[104px]">
              <div ref={previewRef}>
                {screen ? (
                  <CaseImage
                    key={current?.slug}
                    src={screen.src}
                    alt={screen.alt}
                    width={screen.width}
                    height={screen.height}
                    reveal={false}
                    onOpen={() => setGalleryIndex(0)}
                  />
                ) : (
                  <div className="aspect-[16/10] rounded-[10px] border border-border bg-base" />
                )}

                <div className="mt-4">
                  <p className="font-serif text-xl font-normal">{current?.name}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {current?.tags.map((tag) => (
                      <TagPill key={tag.label} tag={tag} />
                    ))}
                  </div>
                  {current ? (
                    <button
                      type="button"
                      onClick={() => drawer?.openProject(current.slug)}
                      data-cursor="link"
                      className="mt-4 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-ink-mid transition-colors hover:border-ink hover:text-ink"
                    >
                      View case study
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {galleryIndex !== null && current ? (
        <GalleryOverlay
          images={current.screens.map((item) => ({
            src: item.src,
            alt: item.alt,
            title: current.name,
          }))}
          index={galleryIndex}
          onIndex={setGalleryIndex}
          onClose={() => setGalleryIndex(null)}
        />
      ) : null}
    </section>
  );
}
