"use client";

import { useState } from "react";

import { saveContent } from "@/app/admin/actions";
import { Repeatable, SaveBar, StringList, useSave } from "@/components/admin/controls";
import { AdminCard } from "@/components/admin/ui";
import type { Stat } from "@/lib/content";

export function AboutEditor({
  paragraphs: initialParagraphs,
  stats: initialStats,
}: {
  paragraphs: string[];
  stats: Stat[];
}) {
  const [paragraphs, setParagraphs] = useState<string[]>(initialParagraphs);
  const [stats, setStats] = useState<Stat[]>(initialStats);
  const { status, error, run } = useSave();

  return (
    <div className="flex flex-col gap-6">
      <AdminCard
        title="About paragraphs"
        description="Wrap words in **double asterisks** to emphasise them."
      >
        <StringList
          value={paragraphs}
          onChange={setParagraphs}
          multiline
          addLabel="Add paragraph"
        />
      </AdminCard>

      <AdminCard title="Stats" description="The numbers block beside the About text.">
        <Repeatable<Stat>
          value={stats}
          onChange={setStats}
          addLabel="Add stat"
          titleField="label"
          fields={[
            { key: "value", label: "Value", placeholder: "5" },
            { key: "suffix", label: "Suffix (accent)", placeholder: "+" },
            { key: "label", label: "Label", full: true },
          ]}
          blank={{ value: "", suffix: "", label: "" }}
        />
      </AdminCard>

      <SaveBar
        status={status}
        error={error}
        label="Save about"
        onSave={() => run(() => saveContent({ aboutParagraphs: paragraphs, stats }, "About updated"))}
      />
    </div>
  );
}
