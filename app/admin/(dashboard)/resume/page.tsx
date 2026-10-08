import { ResumeEditor } from "@/components/admin/resume-editor";
import { getContent } from "@/lib/cms";

export default async function ResumeAdminPage() {
  const { resume } = await getContent();

  return (
    <div>
      <h1 className="mb-2 font-serif text-3xl">Résumé</h1>
      <p className="mb-6 text-ink-mid">
        Edit the content here, then open a résumé page and choose <strong>Print / Save as PDF</strong>.
        Changes save to Supabase and appear on every role variant immediately.
      </p>
      <ResumeEditor initial={resume} />
    </div>
  );
}
