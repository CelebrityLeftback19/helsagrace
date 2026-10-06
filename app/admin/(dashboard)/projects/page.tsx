import { ProjectsManager } from "@/components/admin/projects-manager";
import { getContent } from "@/lib/cms";

export default async function ProjectsPage() {
  const { projects } = await getContent();

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl">Projects</h1>
      <ProjectsManager initial={projects} />
    </div>
  );
}
