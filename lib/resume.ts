/**
 * Résumé content + role-targeted variants.
 *
 * `defaultResume` is the editable source of truth (the admin stores an edited
 * copy in Supabase; anything missing falls back here). The variants below are
 * code — they are the "examples" that reframe the same facts for different
 * target roles.
 */

export type ResumeContact = {
  name: string;
  altName: string;
  location: string;
  email: string;
  phone: string;
  availability: string;
  site: string;
  github: string;
  linkedin: string;
};

export type ResumeJob = {
  company: string;
  location: string;
  title: string;
  dates: string;
  bullets: string[];
};

export type ResumeEducationItem = {
  school: string;
  qualification: string;
  dates: string;
};

export type ResumeCertificateItem = {
  name: string;
  issuer: string;
  dates: string;
};

export type ResumeData = {
  contact: ResumeContact;
  /** Shown above the featured product work. */
  projectNote: string;
  experience: ResumeJob[];
  education: ResumeEducationItem[];
  certificates: ResumeCertificateItem[];
};

export const defaultResume: ResumeData = {
  contact: {
    name: "HelsaGrace Okporho",
    altName: "",
    location: "Port Harcourt, Nigeria",
    email: "oghenenyerhovwo.va@gmail.com",
    phone: "+234 81 4948 9010",
    availability: "Open to remote roles worldwide · WAT (UTC+1)",
    site: "helsagrace.site",
    github: "github.com/CelebrityLeftback19",
    linkedin: "linkedin.com/in/helsagrace",
  },
  projectNote:
    "Independent products — designed, built and shipped end-to-end on my own.",
  experience: [
    {
      company: "CVtoCAREER",
      location: "Remote",
      title: "Enterprise Design Lead",
      dates: "Aug 2026 – Present",
      bullets: [
        "Produce the interface designs — flows, screens and states — that the technology team builds from in each sprint.",
        "Translate business requirements into build-ready design specifications, working directly with engineers.",
        "Own design quality and consistency across the enterprise product as it scales.",
      ],
    },
    {
      company: "CVtoCAREER",
      location: "Remote",
      title: "Business Analyst & UI/UX Documentation Lead",
      dates: "Jun 2025 – Present",
      bullets: [
        "Lead the design team in turning structured feature documentation into high-fidelity mockups and interface flows.",
        "Document and categorise UI/UX features by type, persona, platform and market across landing, dashboard and transfer pages.",
        "Benchmark money-transfer platforms to inform the MVP roadmap, and standardise documentation frameworks for future releases.",
      ],
    },
    {
      company: "CVtoCAREER",
      location: "Remote",
      title: "Client Optimization Specialist",
      dates: "Apr 2025 – Present",
      bullets: [
        "Optimised 100+ client profiles — keyword classification, title refinement and campaign alignment — across engineering, health and tech.",
        "Ran job-market analysis and produced concise, actionable reports that improved role-specific targeting.",
      ],
    },
    {
      company: "CVtoCAREER",
      location: "Remote",
      title: "Customer Onboarding & Relationship Specialist",
      dates: "May 2025 – Present",
      bullets: [
        "Onboarded clients over chat, email and phone; logged needs and preferences to improve service flow and retention.",
      ],
    },
    {
      company: "Lusfane Nigeria Limited",
      location: "Nigeria",
      title: "Virtual Administrative Assistant",
      dates: "Nov 2023 – Feb 2025",
      bullets: [
        "Managed executive calendars, agendas and virtual meetings; built structured spreadsheets for data and task tracking.",
        "Delivered customer support over email and live chat, resolving enquiries quickly and building client relationships.",
      ],
    },
    {
      company: "Dikovis International Limited",
      location: "Nigeria",
      title: "Event Planning Assistant",
      dates: "Aug 2022 – Oct 2023",
      bullets: [
        "Planned event logistics — budgeting, vendor management and day-of coordination.",
        "Ran post-event evaluations and summary reports; kept the team aligned with Trello, Slack and shared calendars.",
      ],
    },
  ],
  education: [
    { school: "Madonna University, Nigeria", qualification: "B.Sc Anatomy", dates: "2022" },
  ],
  certificates: [
    { name: "ALX Virtual Assistant Program", issuer: "ALX Africa", dates: "Nov 2024" },
  ],
};

export type ResumeRole =
  | "ux-product-designer"
  | "product-designer"
  | "product-design-lead"
  | "design-engineer"
  | "ui-ux-designer"
  | "ui-designer"
  | "ux-designer"
  | "frontend-designer"
  | "frontend-engineer";

export type ResumeVariant = {
  slug: ResumeRole;
  label: string;
  title: string;
  summary: string[];
  core: string[];
  tools: string[];
  /** Product slugs to feature, in order (see lib/content.ts). */
  projects: string[];
};

export const resumeVariants: ResumeVariant[] = [
  {
    slug: "ux-product-designer",
    label: "UX/Product Designer",
    title: "UX/Product Designer · AI-assisted build",
    summary: [
      "Enterprise Design Lead owning end-to-end product design — discovery, information architecture, flows, high-fidelity UI and design systems — then shipping it in code.",
      "Lean and evidence-led: problem framing, competitive benchmarking and usability thinking turned into clear decisions, with four products shipped across SaaS, e-commerce, proptech and food delivery.",
      "AI-first workflow — moving from wireframe to coded prototype in days with AI in the loop (Claude Code, Lovable), reviewing diffs rather than hand-writing every line, with accessibility and performance held from day one.",
    ],
    core: [
      "End-to-end product design",
      "Discovery & problem framing",
      "Information architecture",
      "User flows",
      "High-fidelity UI",
      "Design systems & tokens",
      "Usability & concept testing",
      "JTBD & opportunity framing",
      "Accessibility (WCAG)",
      "AI-assisted prototyping & build",
    ],
    tools: [
      "Figma",
      "FigJam",
      "Claude Code",
      "Lovable",
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Supabase",
      "Notion",
    ],
    projects: ["careercraft", "bigtown", "hype", "deli"],
  },
  {
    slug: "product-designer",
    label: "Product Designer",
    title: "Product Designer · Full-Stack Developer",
    summary: [
      "Enterprise Design Lead and full-stack developer who takes products from the first user problem to production — research, flows, interface, database and deploy.",
      "Shipped four independent products across SaaS, e-commerce, proptech and food delivery, owning design and build end-to-end.",
      "Background in business analysis and UI/UX documentation, so systems and roles are mapped before a screen is drawn.",
    ],
    core: [
      "Product strategy",
      "User flows",
      "Information architecture",
      "Design systems",
      "Prototyping",
      "Wireframing",
      "Multi-role UX",
      "Front-end implementation",
    ],
    tools: ["Figma", "React", "TypeScript", "Tailwind CSS", "Supabase", "Next.js"],
    projects: ["careercraft", "bigtown", "hype", "deli"],
  },
  {
    slug: "ui-ux-designer",
    label: "UI/UX Designer",
    title: "UI/UX Designer",
    summary: [
      "Enterprise Design Lead and UI/UX designer with four products shipped to production, covering research, wireframes, high-fidelity UI and design systems.",
      "Designs for every role, not just the happy path — admin consoles, empty and error states, and multi-persona flows.",
      "Works directly in code, so designs ship as built rather than handed off.",
    ],
    core: [
      "User research",
      "Wireframing",
      "Prototyping",
      "Visual design",
      "Design systems",
      "Interaction design",
      "Usability",
      "Accessibility",
    ],
    tools: ["Figma", "Tailwind CSS", "React", "Recharts", "Supabase"],
    projects: ["careercraft", "bigtown", "deli", "hype"],
  },
  {
    slug: "ui-designer",
    label: "UI Designer",
    title: "UI Designer",
    summary: [
      "Enterprise Design Lead and UI designer who builds what she designs — four live products with distinctive, systemised interfaces.",
      "Strong on typography, colour, component libraries and responsive craft, with the front-end skill to protect the details.",
      "Comfortable designing dense, data-heavy product UI, not just marketing pages.",
    ],
    core: [
      "Visual design",
      "Typography",
      "Colour & layout",
      "Component libraries",
      "Design systems",
      "Responsive design",
      "Micro-interactions",
      "Accessibility",
    ],
    tools: ["Figma", "Tailwind CSS", "React", "shadcn/ui", "Motion"],
    projects: ["hype", "deli", "careercraft", "bigtown"],
  },
  {
    slug: "ux-designer",
    label: "UX Designer",
    title: "UX Designer",
    summary: [
      "Enterprise Design Lead and UX designer focused on systems and roles — mapping the data, permissions and states a product needs before designing the interface.",
      "Documented and categorised product feature sets by persona and platform as a UI/UX documentation lead, then turned them into flows.",
      "Shipped four production products where role isolation and financial logic were the core design constraints.",
    ],
    core: [
      "User research",
      "Journey mapping",
      "Information architecture",
      "Persona definition",
      "Usability",
      "Wireframing",
      "Service design",
      "Systems thinking",
    ],
    tools: ["Figma", "Notion", "Miro", "React", "Supabase"],
    projects: ["bigtown", "careercraft", "hype", "deli"],
  },
  {
    slug: "frontend-designer",
    label: "Frontend Designer",
    title: "Frontend Designer",
    summary: [
      "Enterprise Design Lead and frontend designer who closes the gap between the mock and the build — four production products designed and implemented end-to-end.",
      "Comfortable across semantic HTML, responsive CSS, design tokens, accessible components and motion.",
      "Also writes the backend, so components are designed against real data and states.",
    ],
    core: [
      "Semantic HTML",
      "CSS & Tailwind",
      "Responsive design",
      "Design systems",
      "Accessibility",
      "Motion",
      "React",
      "Component architecture",
    ],
    tools: ["React", "Next.js", "TypeScript", "Tailwind CSS", "GSAP", "Lenis"],
    projects: ["careercraft", "bigtown", "hype", "deli"],
  },
  {
    slug: "frontend-engineer",
    label: "Frontend Engineer",
    title: "Frontend Engineer",
    summary: [
      "Frontend engineer building production apps in React, TypeScript and Next.js — with the back end attached.",
      "Shipped four live products including multi-role dashboards, billing flows and an AI-powered SaaS.",
      "Works with Supabase/PostgreSQL, row-level security, edge functions and Playwright test suites.",
    ],
    core: [
      "React",
      "TypeScript",
      "Next.js",
      "TanStack",
      "State management",
      "Tailwind CSS",
      "REST & data fetching",
      "Testing (Playwright)",
    ],
    tools: ["React", "Next.js", "TypeScript", "Supabase", "PostgreSQL", "Cloudflare Workers"],
    projects: ["careercraft", "bigtown", "deli", "hype"],
  },
  {
    slug: "product-design-lead",
    label: "Product Design Lead",
    title: "Product Design Lead",
    summary: [
      "Enterprise Design Lead who runs design as part of delivery, not beside it — producing the interface work an engineering team builds from each sprint.",
      "Leads from the front: documents the system, sets the interface standards, and keeps quality consistent as the product scales.",
      "Four products shipped end-to-end, and the front-end skill to hold a build to the design.",
    ],
    core: [
      "Design leadership",
      "Product strategy",
      "Design systems",
      "Critique & standards",
      "Cross-functional delivery",
      "Multi-role UX",
      "Prototyping",
      "Front-end literacy",
    ],
    tools: ["Figma", "React", "TypeScript", "Tailwind CSS", "Supabase", "Notion"],
    projects: ["bigtown", "careercraft", "hype", "deli"],
  },
  {
    slug: "design-engineer",
    label: "Design Engineer",
    title: "Design Engineer",
    summary: [
      "Design engineer — the profile that designs the interface and ships it in code, without the hand-off.",
      "Four production products built end-to-end in React, TypeScript and Next.js, including design systems that survive real data, states and permissions.",
      "Comfortable owning a feature from Figma through accessibility, motion, performance and deploy.",
    ],
    core: [
      "Design systems",
      "Component architecture",
      "React",
      "TypeScript",
      "Accessible UI",
      "Motion",
      "Prototyping",
      "Design-to-code",
    ],
    tools: ["React", "Next.js", "TypeScript", "Tailwind CSS", "GSAP", "Supabase"],
    projects: ["careercraft", "bigtown", "hype", "deli"],
  },
];

export function getVariant(slug: string): ResumeVariant | undefined {
  return resumeVariants.find((variant) => variant.slug === slug);
}
