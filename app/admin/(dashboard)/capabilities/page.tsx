import { CollectionEditor, ICON_OPTIONS } from "@/components/admin/collection-editor";
import { getContent } from "@/lib/cms";
import type { Capability } from "@/lib/content";

export default async function CapabilitiesPage() {
  const { capabilities } = await getContent();

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl">Capabilities</h1>
      <CollectionEditor<Capability>
        title="What I bring"
        description="The dark section of capability cards."
        section="capabilities"
        initial={capabilities}
        addLabel="Add capability"
        titleField="title"
        fields={[
          { key: "title", label: "Title", placeholder: "Product Design" },
          { key: "description", label: "Description", type: "textarea" },
          { key: "icon", label: "Icon", type: "select", options: ICON_OPTIONS },
        ]}
        blank={{ title: "", description: "", icon: "lightbulb" }}
      />
    </div>
  );
}
