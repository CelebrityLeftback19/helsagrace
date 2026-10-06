"use client";

import { useEffect, useRef, useState } from "react";

import type { SiteSettings } from "@/lib/content";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#work", label: "Work" },
  { href: "#capabilities", label: "Capabilities" },
  { href: "#about", label: "About" },
] as const;

export function SiteHeader({ site }: { site: SiteSettings }) {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Close the mobile menu on Escape or an outside click.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    function onPointerDown(event: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [open]);

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-[100] h-[var(--nav-h)] border-b border-border bg-base/90 backdrop-blur-md"
    >
      <div className="mx-auto flex h-full max-w-[var(--max)] items-center justify-between px-[var(--px)]">
        <a href="#hero" className="font-serif text-xl text-ink">
          Helsa<em className="italic text-accent">{site.nameEm}</em>
        </a>

        <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent"
          >
            Get in touch
          </a>
        </nav>

        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
          className="flex flex-col gap-[5px] p-1 md:hidden"
        >
          <span className="block h-0.5 w-6 rounded bg-ink" />
          <span className="block h-0.5 w-6 rounded bg-ink" />
          <span className="block h-0.5 w-6 rounded bg-ink" />
        </button>
      </div>

      <div
        id="mobile-nav"
        hidden={!open}
        className={cn(
          "fixed inset-x-0 top-[var(--nav-h)] z-[99] flex-col gap-5 border-b border-border bg-surface px-[var(--px)] py-6 md:hidden",
          open ? "flex" : "hidden",
        )}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className="text-base font-medium text-ink-mid"
          >
            {link.label}
          </a>
        ))}
        <a
          href="#contact"
          onClick={() => setOpen(false)}
          className="text-base font-medium text-ink-mid"
        >
          Get in touch
        </a>
      </div>
    </header>
  );
}
