import { CollectionEditor, ICON_OPTIONS } from "@/components/admin/collection-editor";
import { getContent } from "@/lib/cms";
import type { Discipline } from "@/lib/content";

export default async function DisciplinesPage() {
  const { disciplines } = await getContent();

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl">Disciplines</h1>
      <CollectionEditor<Discipline>
        title="Hero disciplines"
        description="The four cards beside the hero statement."
        section="disciplines"
        initial={disciplines}
        addLabel="Add discipline"
        titleField="label"
        fields={[
          { key: "label", label: "Label", placeholder: "Product Design" },
          { key: "sub", label: "Subtitle", placeholder: "Systems, flows, architecture" },
          { key: "icon", label: "Icon", type: "select", options: ICON_OPTIONS },
        ]}
        blank={{ label: "", sub: "", icon: "lightbulb" }}
      />
    </div>
  );
}
