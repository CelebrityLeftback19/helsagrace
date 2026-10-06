"use client";

import { useState } from "react";

import { saveContent } from "@/app/admin/actions";
import { Repeatable, SaveBar, StringList, useSave, type RepeaterField } from "@/components/admin/controls";
import { AdminCard } from "@/components/admin/ui";
import type { SiteContent } from "@/lib/content";

export const ICON_OPTIONS = [
  { value: "layout-panel-left", label: "Layout / grid" },
  { value: "pen-line", label: "Pen / edit" },
  { value: "code-xml", label: "Code" },
  { value: "lightbulb", label: "Lightbulb" },
  { value: "database", label: "Database" },
  { value: "shield-check", label: "Shield" },
];

/** Editor for an ordered array of objects (disciplines, capabilities, process, stats). */
export function CollectionEditor<T extends object>({
  title,
  description,
  section,
  initial,
  fields,
  blank,
  addLabel,
  titleField,
  saveLabel,
}: {
  title: string;
  description?: string;
  section: "disciplines" | "capabilities" | "processSteps" | "stats";
  initial: T[];
  fields: RepeaterField[];
  blank: T;
  addLabel?: string;
  titleField?: string;
  saveLabel?: string;
}) {
  const [items, setItems] = useState<T[]>(initial);
  const { status, error, run } = useSave();

  return (
    <AdminCard title={title} description={description}>
      <Repeatable
        value={items}
        onChange={setItems}
        fields={fields}
        blank={blank}
        addLabel={addLabel}
        titleField={titleField}
      />
      <SaveBar
        status={status}
        error={error}
        label={saveLabel}
        onSave={() =>
          run(() =>
            saveContent(
              { [section]: items } as unknown as Partial<SiteContent>,
              `${title} updated`,
            ),
          )
        }
      />
    </AdminCard>
  );
}

/** Editor for a top-level list of strings (stack, about paragraphs). */
export function StringListEditor({
  title,
  description,
  section,
  initial,
  multiline,
  addLabel,
  placeholder,
}: {
  title: string;
  description?: string;
  section: "stack" | "aboutParagraphs";
  initial: string[];
  multiline?: boolean;
  addLabel?: string;
  placeholder?: string;
}) {
  const [items, setItems] = useState<string[]>(initial);
  const { status, error, run } = useSave();

  return (
    <AdminCard title={title} description={description}>
      <StringList
        value={items}
        onChange={setItems}
        multiline={multiline}
        addLabel={addLabel}
        placeholder={placeholder}
      />
      <SaveBar
        status={status}
        error={error}
        onSave={() =>
          run(() =>
            saveContent(
              { [section]: items } as unknown as Partial<SiteContent>,
              `${title} updated`,
            ),
          )
        }
      />
    </AdminCard>
  );
}
