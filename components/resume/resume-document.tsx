import type { Project } from "@/lib/content";
import {
  resumeCertificates,
  resumeContact,
  resumeEducation,
  resumeExperience,
  type ResumeVariant,
} from "@/lib/resume";

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="resume-section mb-7">
      <div className="mb-3 flex items-center gap-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
          {label}
        </h2>
        <span aria-hidden className="h-px flex-1 bg-border" />
      </div>
      {children}
    </section>
  );
}

export function ResumeDocument({
  variant,
  projects,
}: {
  variant: ResumeVariant;
  projects: Project[];
}) {
  const contact = resumeContact;
  const featured = variant.projects
    .map((slug) => projects.find((project) => project.slug === slug))
    .filter((project): project is Project => Boolean(project));

  return (
    <article className="resume mx-auto w-full max-w-[820px] bg-white px-10 py-12 text-ink print:px-0 print:py-0">
      <header className="mb-8">
        <h1 className="font-serif text-[34px] font-normal leading-none tracking-[-0.02em]">
          {contact.name}
        </h1>
        <p className="mt-2 text-[15px] font-medium text-accent">{variant.title}</p>

        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[12.5px] text-ink-mid">
          <span>{contact.location}</span>
          <span aria-hidden className="text-border">·</span>
          <a href={`mailto:${contact.email}`} className="hover:text-accent">
            {contact.email}
          </a>
          <span aria-hidden className="text-border">·</span>
          <span>{contact.phone}</span>
          <span aria-hidden className="text-border">·</span>
          <span>{contact.availability}</span>
        </div>

        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[12.5px] text-muted">
          <span>helsagrace.site</span>
          <span aria-hidden className="text-border">·</span>
          <span>github.com/CelebrityLeftback19</span>
          <span aria-hidden className="text-border">·</span>
          <span>linkedin.com/in/helsagrace</span>
        </div>
      </header>

      <Section label="Summary">
        {variant.summary.map((paragraph) => (
          <p key={paragraph} className="mb-2 text-[13.5px] leading-[1.65] text-ink-mid last:mb-0">
            {paragraph}
          </p>
        ))}
      </Section>

      <Section label="Core skills">
        <ul className="flex flex-wrap gap-1.5">
          {variant.core.map((skill) => (
            <li
              key={skill}
              className="rounded-full border border-border bg-base px-2.5 py-[3px] text-[11.5px] font-medium text-ink-mid"
            >
              {skill}
            </li>
          ))}
        </ul>
        <p className="mt-2.5 text-[12.5px] leading-[1.6] text-muted">
          <span className="font-medium text-ink-mid">Tools &amp; stack:</span>{" "}
          {variant.tools.join(" · ")}
        </p>
      </Section>

      <Section label="Selected product work">
        <div className="flex flex-col gap-4">
          {featured.map((project) => (
            <div key={project.slug}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h3 className="text-[14px] font-semibold text-ink">{project.name}</h3>
                <span className="text-[11.5px] text-muted">
                  {project.tags.map((tag) => tag.label).join(" · ")}
                </span>
              </div>
              <p className="mt-1 text-[13px] leading-[1.6] text-ink-mid">{project.summary}</p>
              <p className="mt-1 text-[11.5px] text-muted">
                {project.stack.slice(0, 8).join(" · ")}
                {project.liveUrl ? ` · ${project.liveUrl.replace(/^https?:\/\//, "")}` : ""}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section label="Experience">
        <div className="flex flex-col gap-4">
          {resumeExperience.map((job) => (
            <div key={`${job.company}-${job.title}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h3 className="text-[14px] font-semibold text-ink">
                  {job.title}
                  <span className="font-normal text-muted"> · {job.company}</span>
                </h3>
                <span className="text-[11.5px] text-muted">
                  {job.dates} · {job.location}
                </span>
              </div>
              <ul className="mt-1.5 flex list-disc flex-col gap-1 pl-4">
                {job.bullets.map((bullet) => (
                  <li key={bullet} className="text-[13px] leading-[1.55] text-ink-mid">
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <div className="grid gap-7 sm:grid-cols-2 print:grid-cols-2">
        <Section label="Education">
          {resumeEducation.map((item) => (
            <div key={item.school}>
              <h3 className="text-[14px] font-semibold text-ink">{item.qualification}</h3>
              <p className="text-[13px] text-ink-mid">{item.school}</p>
              <p className="text-[11.5px] text-muted">{item.dates}</p>
            </div>
          ))}
        </Section>

        <Section label="Certificates">
          {resumeCertificates.map((item) => (
            <div key={item.name}>
              <h3 className="text-[14px] font-semibold text-ink">{item.name}</h3>
              <p className="text-[13px] text-ink-mid">{item.issuer}</p>
              <p className="text-[11.5px] text-muted">{item.dates}</p>
            </div>
          ))}
        </Section>
      </div>

      <p className="resume-section mt-2 text-[11px] text-muted">
        Also known as {contact.altName} · References available on request.
      </p>
    </article>
  );
}
