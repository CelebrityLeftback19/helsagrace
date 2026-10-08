"use client";

import { useState } from "react";

import { saveContent } from "@/app/admin/actions";
import { Repeatable, SaveBar, useSave } from "@/components/admin/controls";
import { AdminCard, Field, inputClass } from "@/components/admin/ui";
import type { ResumeData } from "@/lib/resume";

type JobEditable = {
  company: string;
  location: string;
  title: string;
  dates: string;
  bulletsText: string;
};

const CONTACT_LABELS: Record<keyof ResumeData["contact"], string> = {
  name: "Full name",
  altName: "Also known as (optional)",
  location: "Location",
  email: "Email",
  phone: "Phone",
  availability: "Availability line",
  site: "Portfolio URL",
  github: "GitHub",
  linkedin: "LinkedIn",
};

const CONTACT_KEYS = Object.keys(CONTACT_LABELS) as Array<keyof ResumeData["contact"]>;

export function ResumeEditor({ initial }: { initial: ResumeData }) {
  const [contact, setContact] = useState(initial.contact);
  const [projectNote, setProjectNote] = useState(initial.projectNote);
  const [jobs, setJobs] = useState<JobEditable[]>(() =>
    initial.experience.map((job) => ({ ...job, bulletsText: job.bullets.join("\n") })),
  );
  const [education, setEducation] = useState(initial.education);
  const [certificates, setCertificates] = useState(initial.certificates);
  const { status, error, run } = useSave();

  function setContactField(key: keyof ResumeData["contact"], value: string) {
    setContact((prev) => ({ ...prev, [key]: value }));
  }

  function save() {
    const resume: ResumeData = {
      contact,
      projectNote,
      experience: jobs.map((job) => ({
        company: job.company,
        location: job.location,
        title: job.title,
        dates: job.dates,
        bullets: job.bulletsText
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
      })),
      education,
      certificates,
    };
    void run(() => saveContent({ resume }, "Résumé updated"));
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminCard title="Contact & header">
        <div className="grid gap-4 sm:grid-cols-2">
          {CONTACT_KEYS.map((key) => (
            <Field key={key} label={CONTACT_LABELS[key]}>
              <input
                value={contact[key]}
                onChange={(event) => setContactField(key, event.target.value)}
                className={inputClass}
              />
            </Field>
          ))}
        </div>
      </AdminCard>

      <AdminCard title="Product note" description="Shown above the featured products.">
        <Field label="Note">
          <input
            value={projectNote}
            onChange={(event) => setProjectNote(event.target.value)}
            className={inputClass}
          />
        </Field>
      </AdminCard>

      <AdminCard title="Experience">
        <Repeatable<JobEditable>
          value={jobs}
          onChange={setJobs}
          addLabel="Add role"
          titleField="title"
          fields={[
            { key: "title", label: "Title" },
            { key: "company", label: "Company" },
            { key: "location", label: "Location" },
            { key: "dates", label: "Dates", placeholder: "Aug 2026 – Present" },
            {
              key: "bulletsText",
              label: "Bullets (one per line)",
              type: "textarea",
              full: true,
            },
          ]}
          blank={{ title: "", company: "", location: "", dates: "", bulletsText: "" }}
        />
      </AdminCard>

      <AdminCard title="Education">
        <Repeatable
          value={education}
          onChange={setEducation}
          addLabel="Add education"
          titleField="qualification"
          fields={[
            { key: "qualification", label: "Qualification" },
            { key: "school", label: "School" },
            { key: "dates", label: "Dates" },
          ]}
          blank={{ qualification: "", school: "", dates: "" }}
        />
      </AdminCard>

      <AdminCard title="Certificates">
        <Repeatable
          value={certificates}
          onChange={setCertificates}
          addLabel="Add certificate"
          titleField="name"
          fields={[
            { key: "name", label: "Name" },
            { key: "issuer", label: "Issuer" },
            { key: "dates", label: "Dates" },
          ]}
          blank={{ name: "", issuer: "", dates: "" }}
        />
      </AdminCard>

      <SaveBar status={status} error={error} label="Save résumé" onSave={save} />
    </div>
  );
}
