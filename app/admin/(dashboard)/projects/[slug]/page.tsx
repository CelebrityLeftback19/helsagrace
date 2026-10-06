import { notFound } from "next/navigation";

import { ProjectForm } from "@/components/admin/project-form";
import { getContent } from "@/lib/cms";

export default async function ProjectEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { projects } = await getContent();
  const index = projects.findIndex((project) => project.slug === slug);

  if (index === -1) notFound();

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl">{projects[index]!.name}</h1>
      <ProjectForm index={index} projects={projects} />
    </div>
  );
}
