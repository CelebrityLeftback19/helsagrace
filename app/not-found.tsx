import { Mail } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { GitHubIcon, LinkedInIcon, WhatsAppIcon } from "@/components/brand-icons";
import { getContent } from "@/lib/cms";

export const metadata: Metadata = {
  title: "404 — page not found",
  description: "That page doesn't exist. Jump back into the portfolio or reach out directly.",
};

export default async function NotFound() {
  const { site } = await getContent();

  const quick = [
    { href: `mailto:${site.email}`, label: "Email", icon: Mail, external: false },
    { href: site.whatsapp, label: "WhatsApp", icon: WhatsAppIcon, external: true },
    { href: site.github, label: "GitHub", icon: GitHubIcon, external: true },
    { href: site.linkedin, label: "LinkedIn", icon: LinkedInIcon, external: true },
  ];

  return (
    <main className="flex min-h-screen items-center justify-center px-[var(--px)] py-24">
      <div className="w-full max-w-[660px] text-center">
        <Link
          href="/"
          className="mb-10 inline-block font-serif text-lg text-ink transition-colors hover:text-accent"
        >
          Helsa<em className="italic text-accent">{site.nameEm}</em>
        </Link>

        <p className="mb-5 text-[12px] font-semibold uppercase tracking-[0.24em] text-accent">
          404
        </p>
        <h1 className="mb-5 font-serif text-[clamp(34px,6vw,56px)] font-normal leading-[1.05] tracking-[-0.03em]">
          This page doesn&apos;t exist.
        </h1>
        <p className="mx-auto mb-9 max-w-[46ch] text-base leading-[1.6] text-muted">
          The link may be broken, or the page may have moved. If something on the site broke,
          tell me and I&apos;ll fix it — otherwise, head back in.
        </p>

        <div className="mb-12 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-accent"
          >
            Back to the portfolio
          </Link>
          <a
            href={`mailto:${site.email}`}
            className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-[15px] font-medium text-ink-mid transition-colors hover:border-ink hover:text-ink"
          >
            <Mail className="h-4 w-4" aria-hidden />
            Email me
          </a>
        </div>

        <div className="border-t border-border pt-7">
          <p className="mb-4 text-[12px] font-medium uppercase tracking-[0.14em] text-muted">
            Quick contact
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {quick.map((link) => (
              <a
                key={link.label}
                href={link.href}
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-[13px] font-medium text-ink-mid transition-colors hover:border-accent hover:text-accent"
              >
                <link.icon className="h-3.5 w-3.5" aria-hidden />
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
