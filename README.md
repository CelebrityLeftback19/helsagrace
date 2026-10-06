# HelsaGrace — Portfolio

The personal portfolio for **HelsaGrace Okporho** — Product Designer · UI/UX Designer ·
Full-Stack Developer · AI Enthusiast.

The site's job is simple: show that HelsaGrace doesn't only design interfaces — she takes
products from **idea to production**.

Primary statement: *"I design products. I also build them."*

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** — design tokens declared once in `app/globals.css` via `@theme`
- **Supabase** — content storage, auth and Row-Level Security for the admin
- **Lucide React** for icons
- **Instrument Serif** + **Inter** self-hosted through `next/font`
- Deployed to **Vercel**

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run start      # serve the production build
npm run typecheck  # tsc --noEmit
npm run seed       # load default content into Supabase (needs env)
```

The public site works with **no configuration at all** — it falls back to the content in
`lib/content.ts`. Supabase is only required to use the admin.

## Structure

```
app/
  layout.tsx            fonts, metadata, viewport
  page.tsx              reads content and composes the sections
  globals.css           design tokens + the little custom CSS there is
  admin/                content admin (login, dashboard, editors, server actions)
components/
  sections/             Hero, Work, Capabilities, Process, Stack, About, Contact
  admin/                admin UI: controls, editors, nav, login
  site-header.tsx       nav + mobile menu            ("use client")
  project-drawer.tsx    case-study slide-over + strips ("use client")
  contact-form.tsx      form interactions            ("use client")
  reveal.tsx            scroll reveal                ("use client")
  case-image.tsx        screenshot + graceful fallback ("use client")
lib/
  content.ts            content types + DEFAULT content
  cms.ts                reads live content from Supabase, merges over defaults
  icons.ts              icon-key → Lucide component
  supabase/             server client + middleware session helper
  admin-data.ts         revision history (authenticated)
supabase/
  schema.sql            tables, RLS policies, seed row
scripts/
  seed.ts               seeds defaultContent into Supabase
```

## Content admin (`/admin`)

All site content is editable from `/admin`: profile & hero, disciplines, projects and full
case studies (tags, meta, screenshots, sections, stack), capabilities, process, stack, and
about/stats. Saving writes to Supabase and calls `revalidatePath("/")`, so the live site
updates immediately.

### One-time setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase **SQL editor**. This creates the content
   tables, the owner allowlist, the `is_admin()` helper, RLS policies, and the public
   `media` storage bucket for uploads.
3. Create an admin user in **Authentication → Users → Add user** (email + password).
4. **Add that email to the owner allowlist:**
   ```sql
   insert into public.admin_users (email) values ('you@example.com')
   on conflict do nothing;
   ```
   Only allowlisted emails can sign in or write — everything else is refused.
5. Copy `.env.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (only needed for seeding)
6. Run `npm run seed` to load the current content into the database.
7. Restart the dev server, visit `/admin`, and sign in.

### How it works

- Content is stored as a **single JSON document** (`site_content`, one row) plus an
  append-only **`content_revisions`** log. That keeps the schema trivial while still
  giving history and one-click restore from `/admin/history`.
- **Owner allowlist.** The `admin_users` table is the source of truth. A `SECURITY DEFINER`
  `is_admin()` function checks the signed-in email against it, and **every RLS policy uses
  it** — so even a valid Supabase user who isn't allowlisted cannot read revisions or write
  content. The app checks the same rule for a friendly error and to block sign-in.
- **Uploads.** Project screenshots can be uploaded directly from the admin project editor to
  the public `media` bucket; the editor stores the resulting public URL. `next.config.ts`
  allow-lists the Supabase storage host so `next/image` can optimise those URLs.
- **RLS**: anyone may read content (it's a public site); only allowlisted owners may write.
- Reading merges the stored document over the code defaults, so a field added in code later
  still renders until it's edited in the admin.
- Middleware refreshes the Supabase session and redirects unauthenticated `/admin` requests
  to `/admin/login`. If Supabase isn't configured, `/admin` shows a setup notice instead.

Add local screenshots to `public/images/` when you prefer to keep them in the repo — see
`public/images/README.md`.

## Contact form

The form posts to `app/api/contact` (a Next.js route handler) which emails you via
[Resend](https://resend.com). It validates input, includes a honeypot, and rate-limits per IP.

Set these in `.env.local` (and in Vercel):

- `RESEND_API_KEY` — from your Resend account. **Required**; without it the form reports
  "not configured" and sends nothing.
- `CONTACT_TO_EMAIL` — where enquiries land. Falls back to the profile email.
- `CONTACT_FROM_EMAIL` — a verified sender, e.g. `HelsaGrace <hello@yourdomain.com>`.
  Defaults to Resend's test sender `onboarding@resend.dev`, which only delivers to the
  Resend account owner — fine for testing, so verify your domain before launch.

## Before launch

- Update the real contact details in the admin (or in `lib/content.ts` defaults).
- Add a Resend API key and a verified `CONTACT_FROM_EMAIL` so the form actually sends.
- Add the remaining project screenshots — either to `public/images/` or by uploading them in
  the admin project editor.

## Architecture notes

- **Server Components by default.** `"use client"` is used only where the browser is
  genuinely required: mobile navigation, the project drawer, the contact form, scroll
  reveal, the screenshot error fallback, and the admin editors.
- **The project drawer** is driven by a small React context (`ProjectDrawerProvider`), so the
  Work section stays a server component while individual strips are interactive. It handles
  Escape-to-close, a focus trap, body scroll lock, and focus restoration.
- **Scroll reveal is progressive enhancement** — gated behind a `.js` class set before paint,
  so content is fully visible without JavaScript and respects `prefers-reduced-motion`.
- **No shadcn/ui components were needed.** Every surface here is bespoke, so the extra
  dependency was intentionally left out rather than added for its own sake.
