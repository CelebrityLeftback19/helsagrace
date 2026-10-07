"use client";

import { ArrowUpRight, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { CaseImage } from "@/components/case-image";
import { useLenis } from "@/components/motion/smooth-scroll";
import { TagPill } from "@/components/tag";
import type { Project, ProjectScreen } from "@/lib/content";
import { cn } from "@/lib/utils";

/* ── Context ─────────────────────────────────────────────────── */

type DrawerContextValue = { openProject: (slug: string) => void };

const DrawerContext = createContext<DrawerContextValue | null>(null);

/** Access the case-study drawer from any client component inside the provider. */
export function useProjectDrawer(): DrawerContextValue | null {
  return useContext(DrawerContext);
}

/** Groups screenshots by their row number so pairs render side by side. */
function groupScreens(screens: ProjectScreen[]): ProjectScreen[][] {
  const rows = new Map<number, ProjectScreen[]>();

  screens.forEach((screen, index) => {
    const row = screen.row && screen.row > 0 ? screen.row : index + 1;
    const list = rows.get(row) ?? [];
    list.push(screen);
    rows.set(row, list);
  });

  return [...rows.entries()]
    .sort(([a], [b]) => a - b)
    .map(([, list]) => list);
}

/**
 * Holds the open case study so that server-rendered sections can contain
 * interactive strips without becoming client components themselves.
 */
export function ProjectDrawerProvider({
  children,
  projects,
}: {
  children: ReactNode;
  projects: Project[];
}) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const openProject = useCallback((slug: string) => setActiveSlug(slug), []);
  const close = useCallback(() => setActiveSlug(null), []);

  const value = useMemo<DrawerContextValue>(() => ({ openProject }), [openProject]);
  const activeProject = projects.find((project) => project.slug === activeSlug) ?? null;

  return (
    <DrawerContext.Provider value={value}>
      {children}
      <ProjectDrawer project={activeProject} onClose={close} />
    </DrawerContext.Provider>
  );
}

/* ── Strip (the clickable row) ───────────────────────────────── */

export function ProjectStrip({
  project,
  active = false,
  onActivate,
}: {
  project: Project;
  active?: boolean;
  onActivate?: () => void;
}) {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error("ProjectStrip must be rendered inside <ProjectDrawerProvider>.");
  }

  return (
    <button
      type="button"
      onClick={() => context.openProject(project.slug)}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      data-cursor="view"
      data-cursor-label="View"
      aria-label={`View ${project.name} case study`}
      className={cn(
        "group grid w-full grid-cols-[56px_1fr_auto] items-center gap-6 rounded py-7 text-left",
        "border-b border-border first:border-t",
        "transition-[background,padding] hover:bg-accent-light hover:px-4 hover:-mx-4",
        "max-[600px]:grid-cols-[40px_1fr]",
        active && "bg-accent-light px-4 -mx-4",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "text-right font-serif text-[28px] italic leading-none transition-colors",
          active ? "text-accent" : "text-border group-hover:text-accent",
        )}
      >
        {project.index}
      </span>

      <span className="block">
        <span className="mb-2 block font-serif text-[clamp(22px,3vw,30px)] font-normal leading-[1.2] tracking-[-0.02em]">
          {project.name}
        </span>
        <span className="mb-2 flex flex-wrap items-center gap-2">
          {project.tags.map((tag) => (
            <TagPill key={tag.label} tag={tag} />
          ))}
        </span>
        <span className="block max-w-[600px] text-sm leading-[1.55] text-muted">
          {project.summary}
        </span>
      </span>

      <ArrowUpRight
        aria-hidden
        className={cn(
          "h-5 w-5 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 max-[600px]:hidden",
          active ? "-translate-y-0.5 translate-x-0.5 text-accent" : "text-muted group-hover:text-accent",
        )}
      />
    </button>
  );
}

/* ── Drawer ──────────────────────────────────────────────────── */

function ProjectDrawer({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const lenis = useLenis();
  const isOpen = project !== null;

  // Lock scroll, move focus in, and restore focus on close.
  useEffect(() => {
    if (!isOpen) return;

    lastFocused.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lenis?.stop();

    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 360);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      lenis?.start();
      lastFocused.current?.focus?.();
    };
  }, [isOpen, lenis]);

  // Reset scroll position whenever a new case study opens.
  useEffect(() => {
    if (panelRef.current) panelRef.current.scrollTop = 0;
  }, [project?.slug]);

  // Escape to close + simple focus trap.
  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-[200] bg-ink/70 backdrop-blur-[4px] transition-opacity",
          isOpen ? "visible opacity-100" : "invisible opacity-0",
        )}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-study-title"
        data-open={isOpen}
        data-lenis-prevent
        className="drawer-panel fixed inset-y-0 right-0 z-[201] h-screen w-[min(860px,100vw)] overflow-y-auto bg-surface"
        {...(!isOpen ? { inert: true } : {})}
      >
        {project ? <DrawerContent project={project} onClose={onClose} closeRef={closeRef} /> : null}
      </div>
    </>
  );
}

function DrawerContent({
  project,
  onClose,
  closeRef,
}: {
  project: Project;
  onClose: () => void;
  closeRef: React.RefObject<HTMLButtonElement | null>;
}) {
  return (
    <>
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface/93 px-10 py-4 backdrop-blur-[8px] max-[600px]:px-5">
        <span className="font-serif text-lg">{project.name}</span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium text-muted transition-colors hover:bg-base hover:text-ink"
        >
          <X className="h-3.5 w-3.5" aria-hidden />
          Close
        </button>
      </div>

      <div className="px-10 pb-20 pt-12 max-[600px]:px-5 max-[600px]:pb-16 max-[600px]:pt-8">
        <div className="mb-5 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <TagPill key={tag.label} tag={tag} />
          ))}
        </div>

        <h2
          id="case-study-title"
          className="mb-5 font-serif text-[clamp(36px,5vw,56px)] font-normal leading-[1.05] tracking-[-0.03em]"
        >
          {project.name}
        </h2>

        <p className="mb-9 max-w-[640px] text-[17px] leading-[1.65] text-ink-mid">{project.summary}</p>

        <dl className="mb-12 grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-px overflow-hidden rounded-xl border border-border bg-border">
          {project.meta.map((item) => (
            <div key={item.label} className="bg-surface px-5 py-4">
              <dt className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.05em] text-muted">
                {item.label}
              </dt>
              <dd className="text-sm font-medium leading-snug text-ink">{item.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mb-12 flex flex-col gap-3">
          {groupScreens(project.screens).map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={cn("grid gap-3", row.length > 1 && "grid-cols-2 max-[600px]:grid-cols-1")}
            >
              {row.map((screen) => (
                <CaseImage
                  key={screen.src}
                  src={screen.src}
                  alt={screen.alt}
                  width={screen.width}
                  height={screen.height}
                />
              ))}
            </div>
          ))}
        </div>

        {project.sections.map((section) => (
          <section key={section.label} className="mb-12">
            <div className="mb-3.5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-accent">
              {section.label}
              <span className="h-px flex-1 bg-border" aria-hidden />
            </div>
            <h3 className="mb-4 font-serif text-[clamp(22px,3vw,28px)] font-normal leading-tight tracking-[-0.02em]">
              {section.heading}
            </h3>
            {section.paragraphs?.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="mb-3.5 max-w-[640px] text-[15px] leading-[1.7] text-ink-mid"
              >
                {paragraph}
              </p>
            ))}
            {section.bullets ? (
              <ul className="mt-2 flex list-none flex-col gap-2.5 p-0">
                {section.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-2.5 text-sm leading-[1.55] text-ink-mid"
                  >
                    <span
                      aria-hidden
                      className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                    />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        <div className="mb-12">
          <div className="mb-3.5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-accent">
            Stack
            <span className="h-px flex-1 bg-border" aria-hidden />
          </div>
          <div className="flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <span
                key={item}
                className="rounded-full border border-border bg-base px-3 py-[5px] text-xs font-medium text-ink-mid"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {project.liveUrl ? (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent"
          >
            {project.liveLabel ?? "View project"}
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </a>
        ) : null}
      </div>
    </>
  );
}
