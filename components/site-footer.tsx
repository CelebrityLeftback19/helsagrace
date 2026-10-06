import { ArrowUp } from "lucide-react";

import type { SiteSettings } from "@/lib/content";

export function SiteFooter({ site }: { site: SiteSettings }) {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-[var(--px)] py-7">
      <p className="text-[13px] text-muted">
        © {new Date().getFullYear()} {site.fullName}. Built with intention.
      </p>
      <a
        href="#hero"
        className="flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors hover:text-ink"
      >
        Back to top
        <ArrowUp className="h-3.5 w-3.5" aria-hidden />
      </a>
    </footer>
  );
}
