"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { saveContent } from "@/app/admin/actions";
import { IconButton, Repeatable, SaveBar, StringList, useSave } from "@/components/admin/controls";
import { AdminCard, Field, inputClass } from "@/components/admin/ui";
import { cn } from "@/lib/utils";
import type { Project, ProjectMeta, ProjectScreen, ProjectSection, Tag } from "@/lib/content";

const TAG_VARIANTS = [
  { value: "default", label: "Default" },
  { value: "accent", label: "Accent" },
  { value: "live", label: "Live (green)" },
];

function SectionsEditor({
  sections,
  onChange,
}: {
  sections: ProjectSection[];
  onChange: (next: ProjectSection[]) => void;
}) {
  function update(index: number, partial: Partial<ProjectSection>) {
    onChange(sections.map((section, i) => (i === index ? { ...section, ...partial } : section)));
  }
  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    const a = next[index]!;
    next[index] = next[target]!;
    next[target] = a;
    onChange(next);
  }
  function remove(index: number) {
    onChange(sections.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-3">
      {sections.map((section, index) => (
        <div key={index} className="rounded-xl border border-border bg-base p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.05em] text-muted">
              {section.heading || `Section ${index + 1}`}
            </span>
            <div className="flex items-center gap-1">
              <IconButton label="Move up" onClick={() => move(index, -1)} disabled={index === 0}>
                <ArrowUp className="h-3.5 w-3.5" />
              </IconButton>
              <IconButton
                label="Move down"
                onClick={() => move(index, 1)}
                disabled={index === sections.length - 1}
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </IconButton>
              <IconButton label="Remove" tone="danger" onClick={() => remove(index)}>
                <Trash2 className="h-3.5 w-3.5" />
              </IconButton>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Eyebrow label">
              <input
                value={section.label}
                onChange={(event) => update(index, { label: event.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Heading">
              <input
                value={section.heading}
                onChange={(event) => update(index, { heading: event.target.value })}
                className={inputClass}
              />
            </Field>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.05em] text-muted">
                Paragraphs
              </p>
              <StringList
                value={section.paragraphs ?? []}
                onChange={(next) => update(index, { paragraphs: next })}
                multiline
                addLabel="Add paragraph"
              />
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.05em] text-muted">
                Bullets
              </p>
              <StringList
                value={section.bullets ?? []}
                onChange={(next) => update(index, { bullets: next })}
                multiline
                addLabel="Add bullet"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...sections, { label: "", heading: "", paragraphs: [""], bullets: [] }])}
        className="inline-flex items-center gap-1.5 self-start rounded-lg border border-dashed border-border px-3 py-2 text-sm font-medium text-ink-mid transition-colors hover:border-accent hover:text-accent"
      >
        <Plus className="h-3.5 w-3.5" aria-hidden />
        Add section
      </button>
    </div>
  );
}

export function ProjectForm({ index, projects }: { index: number; projects: Project[] }) {
  const router = useRouter();
  const [project, setProject] = useState<Project>(projects[index]!);
  const { status, error, run } = useSave();

  function patch(partial: Partial<Project>) {
    setProject((prev) => ({ ...prev, ...partial }));
  }

  function save() {
    const originalSlug = projects[index]!.slug;
    void run(async () => {
      const next = projects.map((p, i) => (i === index ? project : p));
      const result = await saveContent({ projects: next }, `${project.name} updated`);
      if (result.ok && project.slug !== originalSlug) {
        router.replace(`/admin/projects/${project.slug}`);
      }
      return result;
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminCard title="Basics">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name">
            <input
              value={project.name}
              onChange={(event) => patch({ name: event.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Index label" hint="e.g. 01">
            <input
              value={project.index}
              onChange={(event) => patch({ index: event.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Slug" hint="URL-safe id; changing it also changes the edit URL.">
            <input
              value={project.slug}
              onChange={(event) => patch({ slug: event.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Live URL">
            <input
              value={project.liveUrl ?? ""}
              onChange={(event) => patch({ liveUrl: event.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Live link label">
            <input
              value={project.liveLabel ?? ""}
              onChange={(event) => patch({ liveLabel: event.target.value })}
              placeholder="View live product"
              className={inputClass}
            />
          </Field>
          <Field label="Summary" className="sm:col-span-2">
            <textarea
              value={project.summary}
              onChange={(event) => patch({ summary: event.target.value })}
              className={cn(inputClass, "min-h-[90px] resize-y")}
            />
          </Field>
        </div>
      </AdminCard>

      <AdminCard title="Tags">
        <Repeatable<Tag>
          value={project.tags}
          onChange={(tags) => patch({ tags })}
          addLabel="Add tag"
          titleField="label"
          fields={[
            { key: "label", label: "Label" },
            { key: "variant", label: "Style", type: "select", options: TAG_VARIANTS },
          ]}
          blank={{ label: "", variant: "default" }}
        />
      </AdminCard>

      <AdminCard title="Meta" description="The four detail cells at the top of the case study.">
        <Repeatable<ProjectMeta>
          value={project.meta}
          onChange={(meta) => patch({ meta })}
          addLabel="Add meta field"
          titleField="label"
          fields={[
            { key: "label", label: "Label" },
            { key: "value", label: "Value" },
          ]}
          blank={{ label: "", value: "" }}
        />
      </AdminCard>

      <AdminCard
        title="Screenshots"
        description="Upload an image or paste a path. Screens sharing a Row number render side by side."
      >
        <Repeatable<ProjectScreen>
          value={project.screens}
          onChange={(screens) => patch({ screens })}
          addLabel="Add screenshot"
          titleField="src"
          fields={[
            { key: "src", label: "Image (path or upload)", type: "image", full: true, placeholder: "/images/example.png" },
            { key: "alt", label: "Alt text", type: "textarea", full: true },
            { key: "width", label: "Width (px)", type: "number" },
            { key: "height", label: "Height (px)", type: "number" },
            { key: "row", label: "Row", type: "number" },
          ]}
          blank={{ src: "", alt: "", width: 1600, height: 807, row: 1 }}
        />
      </AdminCard>

      <AdminCard title="Case study sections">
        <SectionsEditor sections={project.sections} onChange={(sections) => patch({ sections })} />
      </AdminCard>

      <AdminCard title="Stack chips">
        <StringList
          value={project.stack}
          onChange={(stack) => patch({ stack })}
          addLabel="Add technology"
        />
      </AdminCard>

      <SaveBar status={status} error={error} label="Save project" onSave={save} />
    </div>
  );
}
