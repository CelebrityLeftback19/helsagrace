import { CollectionEditor, ICON_OPTIONS } from "@/components/admin/collection-editor";
import { getContent } from "@/lib/cms";
import type { Capability } from "@/lib/content";

export default async function CapabilitiesPage() {
  const { capabilities, projects } = await getContent();

  const projectOptions = [
    { value: "", label: "— none —" },
    ...projects.map((project) => ({ value: project.slug, label: project.name })),
  ];

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl">Capabilities</h1>
      <CollectionEditor<Capability>
        title="What I bring"
        description="Each capability pairs a claim with a real screenshot and the decision behind it."
        section="capabilities"
        initial={capabilities}
        addLabel="Add capability"
        titleField="title"
        fields={[
          { key: "title", label: "Title", placeholder: "Product Design" },
          { key: "description", label: "Claim (one line)", type: "textarea" },
          { key: "decision", label: "Decision I'd defend", type: "textarea" },
          { key: "icon", label: "Icon", type: "select", options: ICON_OPTIONS },
          { key: "projectSlug", label: "Proof from project", type: "select", options: projectOptions },
          { key: "proofIndex", label: "Screenshot number", type: "number" },
        ]}
        blank={{
          title: "",
          description: "",
          decision: "",
          icon: "lightbulb",
          projectSlug: "",
          proofIndex: 0,
        }}
      />
    </div>
  );
}
