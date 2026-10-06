import { StringListEditor } from "@/components/admin/collection-editor";
import { getContent } from "@/lib/cms";

export default async function StackPage() {
  const { stack } = await getContent();

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl">Stack</h1>
      <StringListEditor
        title="Technologies I work with"
        description="The chip list above the About section."
        section="stack"
        initial={stack}
        addLabel="Add technology"
        placeholder="e.g. TypeScript"
      />
    </div>
  );
}
