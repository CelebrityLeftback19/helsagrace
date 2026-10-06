import { ProjectDrawerProvider } from "@/components/project-drawer";
import { AboutSection } from "@/components/sections/about-section";
import { CapabilitiesSection } from "@/components/sections/capabilities-section";
import { ContactSection } from "@/components/sections/contact-section";
import { Hero } from "@/components/sections/hero";
import { ProcessSection } from "@/components/sections/process-section";
import { StackSection } from "@/components/sections/stack-section";
import { WorkSection } from "@/components/sections/work-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getContent } from "@/lib/cms";

/**
 * Content is fetched from Supabase when configured, otherwise the in-repo
 * defaults are used. The admin triggers on-demand revalidation, and this
 * interval is a safety net.
 */
export const revalidate = 300;

export default async function HomePage() {
  const content = await getContent();

  return (
    <>
      <SiteHeader site={content.site} />
      <main>
        <Hero site={content.site} disciplines={content.disciplines} />
        <ProjectDrawerProvider projects={content.projects}>
          <WorkSection projects={content.projects} />
        </ProjectDrawerProvider>
        <CapabilitiesSection capabilities={content.capabilities} />
        <ProcessSection processSteps={content.processSteps} />
        <StackSection stack={content.stack} />
        <AboutSection aboutParagraphs={content.aboutParagraphs} stats={content.stats} />
        <ContactSection site={content.site} />
      </main>
      <SiteFooter site={content.site} />
    </>
  );
}
