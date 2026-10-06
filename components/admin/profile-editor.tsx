"use client";

import { useState } from "react";

import { saveContent } from "@/app/admin/actions";
import { SaveBar, useSave } from "@/components/admin/controls";
import { AdminCard, Field, inputClass } from "@/components/admin/ui";
import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/lib/content";

function TextField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  full,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  hint?: string;
  full?: boolean;
}) {
  return (
    <Field label={label} hint={hint} className={full ? "sm:col-span-2" : undefined}>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      />
    </Field>
  );
}

export function ProfileEditor({ initial }: { initial: SiteSettings }) {
  const [site, setSite] = useState<SiteSettings>(initial);
  const { status, error, run } = useSave();

  function set<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSite((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminCard title="Identity">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Display name" value={site.name} onChange={(v) => set("name", v)} />
          <TextField
            label="Accented part of name"
            value={site.nameEm}
            onChange={(v) => set("nameEm", v)}
            hint="Shown in italic accent after the name."
          />
          <TextField label="Full name" value={site.fullName} onChange={(v) => set("fullName", v)} full />
          <TextField label="Location" value={site.location} onChange={(v) => set("location", v)} />
          <TextField
            label="Positioning"
            value={site.positioning}
            onChange={(v) => set("positioning", v)}
          />
        </div>
      </AdminCard>

      <AdminCard title="Hero" description="The first statement visitors read.">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Eyebrow"
            value={site.heroEyebrow}
            onChange={(v) => set("heroEyebrow", v)}
            full
          />
          <TextField label="Headline line 1" value={site.heroLine1} onChange={(v) => set("heroLine1", v)} />
          <TextField label="Headline line 2 (accent)" value={site.heroLine2} onChange={(v) => set("heroLine2", v)} />
          <TextField
            label="Emphasised roles"
            value={site.heroStrong}
            onChange={(v) => set("heroStrong", v)}
            full
          />
          <Field label="Supporting sentence" className="sm:col-span-2">
            <textarea
              value={site.heroCopy}
              onChange={(event) => set("heroCopy", event.target.value)}
              className={cn(inputClass, "min-h-[90px] resize-y")}
            />
          </Field>
        </div>
      </AdminCard>

      <AdminCard title="Contact">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Email" value={site.email} onChange={(v) => set("email", v)} />
          <TextField label="Phone (displayed)" value={site.phone} onChange={(v) => set("phone", v)} />
          <TextField
            label="Phone link"
            value={site.phoneHref}
            onChange={(v) => set("phoneHref", v)}
            hint="Used for the tel: link, e.g. tel:+2348012345678"
          />
          <TextField label="LinkedIn URL" value={site.linkedin} onChange={(v) => set("linkedin", v)} />
        </div>
      </AdminCard>

      <SaveBar
        status={status}
        error={error}
        label="Save profile"
        onSave={() => run(() => saveContent({ site }, "Profile updated"))}
      />
    </div>
  );
}
