"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ADMIN_LINKS } from "@/components/admin/admin-nav";

/**
 * Resolves the section a page lives in. `/admin/projects/hype` returns the
 * Projects listing; `/admin/media` returns the Overview. `/admin` has no parent.
 */
function parentOf(pathname: string): { href: string; label: string } | null {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length <= 1) return null;

  const href = `/${segments.slice(0, -1).join("/")}`;
  const label = ADMIN_LINKS.find((link) => link.href === href)?.label ?? "Overview";
  return { href, label };
}

/**
 * Sticky "back" control for the admin area. Floats at the top of the content so
 * it stays reachable no matter how far a form is scrolled, and works on fresh
 * page loads (no reliance on browser history).
 */
export function AdminBackButton() {
  const pathname = usePathname();
  const parent = parentOf(pathname);
  if (!parent) return null;

  return (
    <div className="sticky top-0 z-20 -mx-2 mb-4 flex items-center bg-base/80 px-2 py-3 backdrop-blur">
      <Link
        href={parent.href}
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-ink-mid transition-colors hover:border-accent hover:text-accent"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
        Back to {parent.label}
      </Link>
    </div>
  );
}
