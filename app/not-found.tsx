import type { Metadata } from "next";

import { NotFoundExperience } from "@/components/not-found/not-found-experience";
import { getContent } from "@/lib/cms";

export const metadata: Metadata = {
  title: "404 — Welcome to HelsaGrace",
  description: "That page doesn't exist — but the work does.",
};

export default async function NotFound() {
  const content = await getContent();

  return (
    <NotFoundExperience
      site={content.site}
      images={content.projects.flatMap((project) =>
        project.screens.map((screen) => ({ src: screen.src, alt: screen.alt })),
      )}
      projectNames={content.projects.map((project) => project.name)}
    />
  );
}
