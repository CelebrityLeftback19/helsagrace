import { AboutEditor } from "@/components/admin/about-editor";
import { getContent } from "@/lib/cms";

export default async function AboutPage() {
  const { aboutParagraphs, stats } = await getContent();

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl">About &amp; stats</h1>
      <AboutEditor paragraphs={aboutParagraphs} stats={stats} />
    </div>
  );
}
