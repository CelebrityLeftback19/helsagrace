"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/profile", label: "Profile & hero" },
  { href: "/admin/disciplines", label: "Disciplines" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/capabilities", label: "Capabilities" },
  { href: "/admin/process", label: "Process" },
  { href: "/admin/stack", label: "Stack" },
  { href: "/admin/about", label: "About & stats" },
  { href: "/admin/history", label: "History" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-0.5">
      {LINKS.map((link) => {
        const active =
          link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active ? "bg-accent-light text-accent" : "text-ink-mid hover:bg-surface",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
