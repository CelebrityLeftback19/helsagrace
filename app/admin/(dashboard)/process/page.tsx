import { CollectionEditor } from "@/components/admin/collection-editor";
import { getContent } from "@/lib/cms";
import type { ProcessStep } from "@/lib/content";

export default async function ProcessPage() {
  const { processSteps } = await getContent();

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl">Process</h1>
      <CollectionEditor<ProcessStep>
        title="How I think"
        description="The numbered approach cards."
        section="processSteps"
        initial={processSteps}
        addLabel="Add step"
        titleField="title"
        fields={[
          { key: "numeral", label: "Numeral", placeholder: "I" },
          { key: "title", label: "Title" },
          { key: "description", label: "Description", type: "textarea" },
        ]}
        blank={{ numeral: "", title: "", description: "" }}
      />
    </div>
  );
}
