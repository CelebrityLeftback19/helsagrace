import Link from "next/link";

import { getContent } from "@/lib/cms";

export default async function AdminOverviewPage() {
  const content = await getContent();

  const cards = [
    { href: "/admin/projects", label: "Projects", count: content.projects.length },
    { href: "/admin/disciplines", label: "Disciplines", count: content.disciplines.length },
    { href: "/admin/capabilities", label: "Capabilities", count: content.capabilities.length },
    { href: "/admin/process", label: "Process steps", count: content.processSteps.length },
    { href: "/admin/stack", label: "Stack items", count: content.stack.length },
    { href: "/admin/about", label: "About paragraphs", count: content.aboutParagraphs.length },
    { href: "/admin/about", label: "Stats", count: content.stats.length },
  ];

  return (
    <div>
      <h1 className="mb-2 font-serif text-3xl">Content</h1>
      <p className="mb-8 text-ink-mid">
        Every section of the portfolio is editable here. Changes save to Supabase and refresh
        the live site.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/admin/profile"
          className="rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-accent"
        >
          <p className="font-serif text-lg">Profile &amp; hero</p>
          <p className="mt-1 text-sm text-muted">Name, hero statement, contact details</p>
        </Link>

        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="flex items-center justify-between rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-accent"
          >
            <span className="font-serif text-lg">{card.label}</span>
            <span className="text-sm text-muted">{card.count}</span>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-sm text-muted">
        Looking for an older version?{" "}
        <Link href="/admin/history" className="text-accent hover:underline">
          View revision history
        </Link>
        .
      </p>
    </div>
  );
}
