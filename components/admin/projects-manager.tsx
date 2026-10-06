"use client";

import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { saveContent } from "@/app/admin/actions";
import { IconButton, SaveBar, useSave } from "@/components/admin/controls";
import { AdminCard } from "@/components/admin/ui";
import type { Project } from "@/lib/content";

function blankProject(index: number, slug: string): Project {
  return {
    slug,
    index: String(index).padStart(2, "0"),
    name: "New project",
    tags: [],
    summary: "",
    meta: [],
    screens: [],
    sections: [],
    stack: [],
  };
}

function uniqueSlug(base: string, projects: Project[]): string {
  let slug = base;
  let counter = 2;
  while (projects.some((project) => project.slug === slug)) {
    slug = `${base}-${counter}`;
    counter += 1;
  }
  return slug;
}

export function ProjectsManager({ initial }: { initial: Project[] }) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(initial);
  const [busy, setBusy] = useState(false);
  const { status, error, run } = useSave();

  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= projects.length) return;
    const next = [...projects];
    const a = next[index]!;
    next[index] = next[target]!;
    next[target] = a;
    setProjects(next);
  }

  function update(index: number, partial: Partial<Project>) {
    setProjects((prev) => prev.map((p, i) => (i === index ? { ...p, ...partial } : p)));
  }

  async function remove(index: number) {
    const project = projects[index];
    if (!project) return;
    if (!window.confirm(`Delete “${project.name}”? This cannot be undone.`)) return;
    const next = projects.filter((_, i) => i !== index);
    setProjects(next);
    await run(() => saveContent({ projects: next }, `Deleted ${project.name}`));
  }

  async function add() {
    const slug = uniqueSlug("new-project", projects);
    const next = [...projects, blankProject(projects.length + 1, slug)];
    setBusy(true);
    await run(() => saveContent({ projects: next }, "Added project"));
    setBusy(false);
    router.push(`/admin/projects/${slug}`);
  }

  return (
    <AdminCard title="Projects" description="Drag-free reordering with the arrows. Save after reordering.">
      <div className="mb-5 flex flex-col gap-2">
        {projects.map((project, index) => (
          <div
            key={project.slug + index}
            className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-base px-4 py-3"
          >
            <span className="font-serif text-lg italic text-border">{project.index}</span>
            <input
              value={project.name}
              onChange={(event) => update(index, { name: event.target.value })}
              className="min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-1 py-1 text-sm font-medium text-ink outline-none hover:border-border focus:border-accent"
            />
            <span className="hidden text-xs text-muted sm:inline">/{project.slug}</span>
            <div className="ml-auto flex items-center gap-1">
              <IconButton label="Move up" onClick={() => move(index, -1)} disabled={index === 0}>
                <ArrowUp className="h-3.5 w-3.5" />
              </IconButton>
              <IconButton
                label="Move down"
                onClick={() => move(index, 1)}
                disabled={index === projects.length - 1}
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </IconButton>
              <Link
                href={`/admin/projects/${project.slug}`}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-ink-mid transition-colors hover:text-accent"
              >
                <Pencil className="h-3.5 w-3.5" aria-hidden />
                Edit
              </Link>
              <IconButton label="Delete" tone="danger" onClick={() => remove(index)}>
                <Trash2 className="h-3.5 w-3.5" />
              </IconButton>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={add}
        disabled={busy}
        className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-2 text-sm font-medium text-ink-mid transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
      >
        <Plus className="h-3.5 w-3.5" aria-hidden />
        Add project
      </button>

      <SaveBar
        status={status}
        error={error}
        label="Save order &amp; names"
        onSave={() => run(() => saveContent({ projects }, "Projects updated"))}
      />
    </AdminCard>
  );
}
