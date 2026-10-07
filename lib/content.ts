/* ─────────────────────────────────────────────────────────────
   Content types + default content.

   This file is the canonical shape of the site. The admin stores an
   edited copy of this structure in Supabase (see `lib/cms.ts`); anything
   missing there falls back to these defaults.
   ───────────────────────────────────────────────────────────── */

export type IconKey =
  | "layout-panel-left"
  | "pen-line"
  | "code-xml"
  | "lightbulb"
  | "database"
  | "shield-check";

export type SiteSettings = {
  name: string;
  nameEm: string;
  fullName: string;
  location: string;
  positioning: string;
  heroEyebrow: string;
  heroLine1: string;
  heroLine2: string;
  heroStrong: string;
  heroCopy: string;
  email: string;
  phone: string;
  phoneHref: string;
  linkedin: string;
};

export type Discipline = { label: string; sub: string; icon: IconKey };

export type Tag = { label: string; variant?: "default" | "accent" | "live" };
export type ProjectMeta = { label: string; value: string };
export type ProjectScreen = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  /** Screens sharing a row number render side by side. */
  row?: number;
};
export type ProjectSection = {
  label: string;
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type Project = {
  slug: string;
  index: string;
  name: string;
  tags: Tag[];
  summary: string;
  meta: ProjectMeta[];
  screens: ProjectScreen[];
  sections: ProjectSection[];
  stack: string[];
  liveUrl?: string;
  liveLabel?: string;
};

export type Capability = {
  title: string;
  description: string;
  icon: IconKey;
  /** The judgment behind the work — the decision the person would defend. */
  decision: string;
  /** Project whose real screenshot proves it. */
  projectSlug?: string;
  /** Which screenshot of that project to use (defaults to the first). */
  proofIndex?: number;
};
export type ProcessStep = { numeral: string; title: string; description: string };
export type Stat = { value: string; suffix: string; label: string };

export type SiteContent = {
  site: SiteSettings;
  disciplines: Discipline[];
  projects: Project[];
  capabilities: Capability[];
  processSteps: ProcessStep[];
  stack: string[];
  aboutParagraphs: string[];
  stats: Stat[];
};

/* ── Site / contact ──────────────────────────────────────────── */

export const site: SiteSettings = {
  name: "HelsaGrace",
  nameEm: "Grace",
  fullName: "HelsaGrace Okporho",
  location: "Nigeria",
  positioning: "Product Designer · UI/UX Designer · Full-Stack Developer · AI Enthusiast",
  heroEyebrow: "Based in Nigeria, building for everywhere",
  heroLine1: "I design products.",
  heroLine2: "I also build them.",
  heroStrong: "Product Designer, UI/UX Designer, Full-Stack Developer.",
  heroCopy:
    "From the first user problem to the last database migration, I own the entire build.",
  // TODO: replace with real contact details before launch.
  email: "helsagrace@example.com",
  phone: "+234 — your number here",
  phoneHref: "tel:+2340000000000",
  linkedin: "https://linkedin.com/in/helsagrace",
};

/* ── Disciplines (hero) ──────────────────────────────────────── */

export const disciplines: Discipline[] = [
  { label: "Product Design", sub: "Systems, flows, architecture", icon: "layout-panel-left" },
  { label: "UI/UX Design", sub: "Interfaces, interactions, experience", icon: "pen-line" },
  { label: "Full-Stack Dev", sub: "React, TypeScript, Supabase", icon: "code-xml" },
  { label: "AI Integration", sub: "LLMs, product AI features", icon: "lightbulb" },
];

/* ── Projects / case studies ─────────────────────────────────── */

export const projects: Project[] = [
  {
    slug: "careercraft",
    index: "01",
    name: "CareerCraft",
    tags: [
      { label: "SaaS" },
      { label: "AI", variant: "accent" },
      { label: "Full-Stack" },
      { label: "Live", variant: "live" },
    ],
    summary:
      "AI-powered career management platform — job tracking, resume builder, Gemini-generated cover letters, analytics, and a subscription tier system. Built end-to-end.",
    meta: [
      { label: "My role", value: "Product Designer + Full-Stack Developer" },
      { label: "Category", value: "Career Tech SaaS" },
      { label: "Status", value: "Live on Vercel" },
      { label: "AI Model", value: "Google Gemini 3 Flash" },
    ],
    screens: [
      {
        src: "/images/careercraft-applications.png",
        alt: "CareerCraft Applications tracker — job list with company, role, status badges showing Interview, Offer, Applied, Rejected, salary range, and date applied.",
        width: 1887,
        height: 952,
        row: 1,
      },
      {
        src: "/images/careercraft-cv.png",
        alt: "CareerCraft My CVs — card grid of created resumes with ATS optimization scores.",
        width: 1894,
        height: 952,
        row: 2,
      },
      {
        src: "/images/careercraft-cover.png",
        alt: "CareerCraft Cover Letters — AI-generated cover letters with AI Generated and Complete status tags.",
        width: 1897,
        height: 951,
        row: 2,
      },
    ],
    sections: [
      {
        label: "The problem",
        heading: "Job searching is fragmented and chaotic",
        paragraphs: [
          "Job seekers manage applications across spreadsheets, email threads, and memory. They rewrite cover letters from scratch for every application. They don't know which resumes are actually performing. CareerCraft consolidates the entire job search into a single intelligent system.",
        ],
      },
      {
        label: "Core features",
        heading: "Every tool a job seeker needs, connected",
        bullets: [
          "Application tracker — 6 lifecycle statuses, Kanban drag-to-status, follow-up deadlines, and overdue grouping",
          "Resume builder — 5 professional templates, ATS score in real time, inline AI bullet rewriting, ATS pre-flight gate before download",
          "AI cover letter generator — Google Gemini in 5 tones (Confident, Formal, Friendly, Creative, Executive); per-paragraph rewriting; JD keyword match panel",
          "Job discovery — JSearch API (10M+ listings), match-score algorithm (0–100), remote/salary/location filters",
          "Analytics dashboard — response rate, interview rate, offer rate, status breakdown, follow-ups needed",
          "Subscription billing — 5 tiers with feature gating, payment-proof upload, admin review and approval",
          "Admin console — user management, subscription approval, payment proof review, analytics",
        ],
      },
      {
        label: "AI architecture",
        heading: "Gemini as a genuine product layer",
        paragraphs: [
          "The AI integration isn't a chatbot bolted onto the side. It uses the user's own resume data, the target job description, and a chosen tone to produce something personal rather than generic. Per-paragraph regeneration lets users iterate without starting over. All AI calls route through a Deno edge function that handles prompt construction and keeps API keys server-side.",
        ],
      },
    ],
    stack: [
      "React 18",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "shadcn/ui",
      "TanStack Query",
      "Supabase",
      "PostgreSQL",
      "Deno Edge Functions",
      "Google Gemini 3 Flash",
      "JSearch API",
      "Recharts",
      "Vercel",
    ],
    liveUrl: "https://careercraft19.vercel.app",
    liveLabel: "View live product",
  },
  {
    slug: "hype",
    index: "02",
    name: "The Hype Aesthetics",
    tags: [
      { label: "E-Commerce" },
      { label: "Consumer" },
      { label: "Live · thehypeaesthetics.store", variant: "live" },
    ],
    summary:
      "Live Nigerian fashion accessories storefront — bags, jewellery, and everyday pieces. Full admin console, bank-transfer checkout, pre-order deposit model, and a real business behind it.",
    meta: [
      { label: "My role", value: "Founder + Designer + Developer" },
      { label: "Category", value: "Fashion E-Commerce" },
      { label: "Market", value: "Nigeria, nationwide" },
      { label: "Status", value: "Live · thehypeaesthetics.store" },
    ],
    screens: [
      {
        src: "/images/hype-storefront.png",
        alt: "The Hype Aesthetics homepage — warm off-white canvas, hot orange hero with 'Pretty items, carried softly.' headline, New Arrivals product grid, and pre-order banner.",
        row: 1,
      },
    ],
    sections: [
      {
        label: "The product",
        heading: "A fashion store built for how Nigerian customers actually buy",
        paragraphs: [
          "Payment by bank transfer is the Nigerian default. Pre-ordering items before they land is a common buying pattern. Nationwide delivery to Lagos, Abuja, Port Harcourt. WhatsApp as a customer service channel. These weren't edge cases to accommodate — they were the core design constraints.",
          "The Bold Street design system — warm off-white canvas, dark ink, and a single hot-orange accent — was designed to feel premium and distinctive without being inaccessible.",
        ],
      },
      {
        label: "Customer experience",
        heading: "Browse, cart, checkout, track",
        bullets: [
          "Homepage hero, category browsing, New Arrivals, and pre-order banner",
          "Product pages with colour/size variants, in-stock vs. pre-order pricing",
          '"Coming In" section for interest registration before items land',
          "Cart, checkout with Settlr virtual account (bank transfer), and proof-of-payment upload",
          "Order tracking at /track — status, payment state, delivery progress",
          "Pre-order deposit model: 80% non-refundable, clearly disclosed at checkout",
        ],
      },
      {
        label: "Admin console — Backstage",
        heading: "A business operations tool, not just a CMS",
        bullets: [
          "Revenue dashboard — today, this week, this month, all time; average order value",
          "Landed-cost calculator — enter cost, shipping, duties; shows true margin per SKU",
          "Product management — search, filters, inline editing, bulk actions, CSV import/export",
          "Order management with status workflow and payment confirmation",
          "Telegram notifications on new orders, payments, and interest registrations",
        ],
      },
    ],
    stack: [
      "TanStack Start",
      "React 19",
      "TypeScript",
      "Tailwind v4",
      "shadcn/ui",
      "Supabase",
      "Settlr Payments",
      "pdf-lib",
      "PapaParse",
      "Playwright",
      "Cloudflare Workers",
    ],
    liveUrl: "https://thehypeaesthetics.store",
    liveLabel: "Visit the store",
  },
  {
    slug: "bigtown",
    index: "03",
    name: "BigTown",
    tags: [{ label: "PropTech" }, { label: "SaaS" }, { label: "Community" }],
    summary:
      "Estate community management and billing system — 13 distinct roles, property-level dues, visitor QR/PIN gate security, announcements, meetings, maintenance, and a full audit log. 32 database tables.",
    meta: [
      { label: "My role", value: "Product Designer + Full-Stack Developer" },
      { label: "Category", value: "PropTech / Community SaaS" },
      { label: "Roles", value: "13 distinct user roles" },
      { label: "Database", value: "32 tables, estate-scoped RLS" },
    ],
    screens: [
      {
        src: "/images/bigtown-login.png",
        alt: "BigTown login screen — dark atmospheric background with centred card, BIG TOWN Estate Management Portal branding.",
        row: 1,
      },
      {
        src: "/images/bigtown-dashboard.png",
        alt: "BigTown estate manager dashboard — properties count, announcements, meetings, active tenancies, management actions, recent announcements panel.",
        row: 1,
      },
      {
        src: "/images/bigtown-visitors.png",
        alt: "BigTown visitor passes — resident view for generating one-time secure gate codes with list of active, used, cancelled, and expired passes.",
        row: 2,
      },
      {
        src: "/images/bigtown-security.png",
        alt: "BigTown security desk — gate activity overview with admitted today, denied today, total today, and quick action cards for verification and logs.",
        row: 2,
      },
    ],
    sections: [
      {
        label: "The design problem",
        heading: "One system, thirteen distinct roles",
        paragraphs: [
          "Managing an estate involves radically different jobs: a resident needs to pay dues and request a visitor pass; a security officer needs to verify a QR code at a gate; an estate manager needs to see all properties and outstanding payments; a super admin needs multi-estate oversight. Every navigation structure, every data view, every permission was designed with role isolation as the primary constraint — not an afterthought.",
        ],
      },
      {
        label: "Visitor security",
        heading: "Security-first gate access",
        paragraphs: [
          "Residents generate one-time visitor passes — hashed codes shown exactly once and stored hashed. Security officers see only a verification interface — no financial data, no resident information. Gate admission is a server-side transaction that checks estate membership, approval status, time window, revocation, and prior use before recording an admit or deny. The audit trail is immutable.",
        ],
      },
      {
        label: "Financial architecture",
        heading: "Property-level dues, not resident-level",
        paragraphs: [
          "Dues are attached to properties, not residents. This correctly handles the reality that owners, tenants, and caretakers change over time while the property and its obligations remain. Annual Levy, Security Levy, and Development Levy each have separate line items, with partial payment support, installment windows, late fee logic, and immutable receipts.",
        ],
      },
    ],
    stack: [
      "React 19",
      "TanStack Start",
      "TanStack Router",
      "TypeScript",
      "Tailwind v4",
      "shadcn/ui",
      "Supabase",
      "PostgreSQL",
      "Row-Level Security",
      "Server Functions",
    ],
  },
  {
    slug: "deli",
    index: "04",
    name: "Kay's Deli",
    tags: [{ label: "FoodTech" }, { label: "Consumer" }, { label: "Live", variant: "live" }],
    summary:
      "Mobile-first food ordering app for a deli and bar — menu browsing, order tracking timeline, one-tap reorder, and an admin intelligence dashboard with revenue charts, best-sellers, and top buyers.",
    meta: [
      { label: "My role", value: "Product Designer + Full-Stack Developer" },
      { label: "Category", value: "Food Ordering / FoodTech" },
      { label: "Status", value: "Live on Cloudflare" },
      { label: "Design", value: "Mobile-first, pink & berry" },
    ],
    screens: [
      {
        src: "/images/kays-homepage.png",
        alt: "Kay's Deli homepage — warm pink background, 'Cooked hot, cut thick, sauced properly.' editorial serif headline, Start an order and Track my order CTAs, Today's favourites and contact form below.",
        row: 1,
      },
    ],
    sections: [
      {
        label: "The product",
        heading: "Mobile-first ordering with a kitchen-grade admin",
        paragraphs: [
          "Kay's Deli needed more than a menu page. The homepage leads with editorial copy — \u201cCooked hot, cut thick, sauced properly.\u201d — that sets the brand tone before a single dish is shown. The mobile experience is the primary experience: a sticky cart button and an order tracking timeline that timestamps every status change.",
        ],
      },
      {
        label: "Admin intelligence",
        heading: "Not just order management — business insight",
        bullets: [
          "Revenue today / this week / this month / all time, average order value and unpaid balance alerts",
          "Status board with order counts and value per stage — pending, confirmed, preparing, dispatched, delivered, cancelled",
          "Top 10 customers by spend — name, order count, total spent, last order, WhatsApp link",
          "Best-selling dishes by quantity and revenue; category breakdown",
          "14-day revenue bar chart, delivery vs. pickup split",
          "Date-range filter (Today / 7 days / 30 days / All) driving every panel simultaneously",
        ],
      },
    ],
    stack: [
      "React",
      "TanStack Router",
      "TypeScript",
      "Tailwind CSS",
      "Supabase",
      "Recharts",
      "Telegram API",
      "Cloudflare Workers",
    ],
    liveUrl: "https://kays.blusheats.workers.dev",
    liveLabel: "Visit the site",
  },
];

/* ── Capabilities ────────────────────────────────────────────── */

export const capabilities: Capability[] = [
  {
    title: "Product Design",
    icon: "layout-panel-left",
    description:
      "I map the system before I draw a screen — roles, data and states first, pixels last.",
    decision:
      "On BigTown I attached dues to properties, not residents. Owners, tenants and caretakers change; the obligation doesn't.",
    projectSlug: "bigtown",
    proofIndex: 1,
  },
  {
    title: "UI/UX Design",
    icon: "pen-line",
    description:
      "Interfaces that are true to the product, designed for every role — not just the happy path.",
    decision:
      "Thirteen roles get thirteen views: a security officer's screen never shows a resident's money.",
    projectSlug: "bigtown",
    proofIndex: 2,
  },
  {
    title: "Frontend Development",
    icon: "code-xml",
    description:
      "React, TypeScript and Tailwind to production quality — components that hold up across a whole app.",
    decision:
      "I build what I design, so the design system is load-bearing rather than a hand-off deck.",
    projectSlug: "careercraft",
    proofIndex: 0,
  },
  {
    title: "Backend & Database",
    icon: "database",
    description: "Supabase and PostgreSQL — schema, migrations and policy written together.",
    decision:
      "Row-Level Security is part of the product: estate-scoped policies mean no query can cross an estate boundary.",
    projectSlug: "bigtown",
    proofIndex: 3,
  },
  {
    title: "AI Integration",
    icon: "lightbulb",
    description: "LLM features built as product layers, not a chatbot bolted to the side.",
    decision:
      "Gemini reads the user's own résumé and the job description — per-paragraph rewriting, keys kept server-side.",
    projectSlug: "careercraft",
    proofIndex: 2,
  },
  {
    title: "Product Ops & Delivery",
    icon: "shield-check",
    description: "I ship what I build: code, migrations, tests, deploy.",
    decision:
      "The gap between design and production is mine to close — so I run the Playwright suites and the release.",
    projectSlug: "deli",
    proofIndex: 0,
  },
];

/* ── Process ─────────────────────────────────────────────────── */

export const processSteps: ProcessStep[] = [
  {
    numeral: "I",
    title: "Start with the problem, not the interface",
    description:
      "Before I open a design tool, I need to understand what the product is actually solving. The best interface decisions come from understanding the system and the user, not from visual inspiration.",
  },
  {
    numeral: "II",
    title: "Map the system before designing the screen",
    description:
      "Every product I build starts with architecture — what data exists, how roles interact, what states are possible. This avoids designing something the database can't support.",
  },
  {
    numeral: "III",
    title: "Design for every role, not just the happy path",
    description:
      "Real products have admin panels, error states, empty states, and multiple user types. I design for all of them — the resident and the security officer, the customer and the store owner.",
  },
  {
    numeral: "IV",
    title: "Build what I design, ship what I build",
    description:
      "I don't hand off to a developer and hope for the best. I write the code, the migrations, test the edge cases, and deploy. The gap between design and product is mine to close.",
  },
];

/* ── Stack ───────────────────────────────────────────────────── */

export const stack: string[] = [
  "React",
  "TypeScript",
  "Next.js",
  "TanStack Start",
  "Tailwind CSS",
  "shadcn/ui",
  "Supabase",
  "PostgreSQL",
  "Deno Edge Functions",
  "Google Gemini",
  "Playwright",
  "Vite",
  "Cloudflare Workers",
  "Vercel",
  "Recharts",
  "Figma",
];

/* ── About ───────────────────────────────────────────────────── */

export const aboutParagraphs: string[] = [
  "I'm **HelsaGrace Okporho**, a product designer and full-stack developer based in Nigeria. I build digital products across their entire lifecycle — from the first whiteboard sketch of a user flow to the production database migrations and deployment configuration that make it live.",
  "My background spans operations, systems building, and product management — which means I don't just design or just build. I think about **how a product runs as a business**, who the different users are, and what the system needs to be at a data level before I design the first screen.",
  "The products I build tend to have real complexity: multiple user roles, admin consoles, financial logic, role-based access control, payment flows. I find that kind of problem genuinely interesting — the design challenge of making something that serves a security officer, a resident, and an estate manager, each with exactly the right view and exactly the right permissions.",
  "Currently available for **product design**, **full-stack development**, and **end-to-end product builds**. Open to freelance, contract, and full-time roles.",
];

export const stats: Stat[] = [
  { value: "5", suffix: "+", label: "Products shipped to production" },
  { value: "4", suffix: "+", label: "Industries — SaaS, E-Commerce, PropTech, FoodTech" },
  { value: "32", suffix: "", label: "Database tables in BigTown alone" },
  { value: "1", suffix: "→", label: "Discipline: idea to production, solo" },
];

/* ── Composed defaults ───────────────────────────────────────── */

export const defaultContent: SiteContent = {
  site,
  disciplines,
  projects,
  capabilities,
  processSteps,
  stack,
  aboutParagraphs,
  stats,
};
