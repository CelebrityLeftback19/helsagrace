import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ResumeDocument } from "@/components/resume/resume-document";
import { ResumeToolbar } from "@/components/resume/resume-toolbar";
import { getContent } from "@/lib/cms";
import { getVariant, resumeVariants } from "@/lib/resume";

export function generateStaticParams() {
  return resumeVariants.map((variant) => ({ role: variant.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ role: string }>;
}): Promise<Metadata> {
  const { role } = await params;
  const variant = getVariant(role);
  return {
    title: variant ? `${variant.label} résumé — HelsaGrace` : "Résumé — HelsaGrace",
    // Unlisted: reachable by link only, kept out of search results.
    robots: { index: false, follow: false },
  };
}

export default async function ResumeRolePage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;
  const variant = getVariant(role);
  if (!variant) notFound();

  const content = await getContent();

  return (
    <main className="min-h-screen bg-base">
      <ResumeToolbar active={variant.slug} />
      <div className="px-4 pb-24 print:p-0">
        <ResumeDocument variant={variant} projects={content.projects} resume={content.resume} />
      </div>
    </main>
  );
}
