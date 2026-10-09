import Link from "next/link";

import { ResumeEditor } from "@/components/admin/resume-editor";
import { getContent } from "@/lib/cms";
import { resumeVariants } from "@/lib/resume";

export default async function ResumeAdminPage() {
  const { resume } = await getContent();

  return (
    <div>
      <h1 className="mb-2 font-serif text-3xl">Résumé</h1>
      <p className="mb-5 text-ink-mid">
        Edit the content here, then open a variant and choose{" "}
        <strong>Print / Save as PDF</strong>. Changes save to Supabase and appear on every
        variant immediately. Résumé pages are <strong>unlisted</strong> (no nav link, no search
        indexing) — share a link with a company when you apply.
      </p>

      <div className="mb-6 flex flex-wrap gap-2">
        {resumeVariants.map((variant) => (
          <Link
            key={variant.slug}
            href={`/resume/${variant.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-ink-mid transition-colors hover:border-accent hover:text-accent"
          >
            Open {variant.label} ↗
          </Link>
        ))}
      </div>

      <ResumeEditor initial={resume} />
    </div>
  );
}
