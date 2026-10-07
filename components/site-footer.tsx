import { ArrowUp, Mail } from "lucide-react";

import { GitHubIcon, LinkedInIcon, WhatsAppIcon } from "@/components/brand-icons";
import type { SiteSettings } from "@/lib/content";

export function SiteFooter({ site }: { site: SiteSettings }) {
  const socials = [
    { href: site.github, label: "GitHub", icon: GitHubIcon },
    { href: `mailto:${site.email}`, label: "Email", icon: Mail },
    { href: site.whatsapp, label: "WhatsApp", icon: WhatsAppIcon },
    { href: site.linkedin, label: "LinkedIn", icon: LinkedInIcon },
  ];

  return (
    <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-border px-[var(--px)] py-7">
      <p className="text-[13px] text-muted">
        © {new Date().getFullYear()} {site.fullName}. Built with intention.
      </p>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          {socials.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.label}
                href={social.href}
                {...(social.href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                data-cursor="link"
                aria-label={social.label}
                title={social.label}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent"
              >
                <Icon className="h-3.5 w-3.5" aria-hidden />
              </a>
            );
          })}
        </div>

        <a
          href="#hero"
          className="flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors hover:text-ink"
        >
          Back to top
          <ArrowUp className="h-3.5 w-3.5" aria-hidden />
        </a>
      </div>
    </footer>
  );
}
