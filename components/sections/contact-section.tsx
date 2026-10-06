import { Mail, Phone } from "lucide-react";

import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import type { SiteSettings } from "@/lib/content";

type IconProps = { className?: string; "aria-hidden"?: boolean };

function LinkedInIcon({ className, "aria-hidden": ariaHidden }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden={ariaHidden}>
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8.02h4.56V23H.22V8.02zM8.34 8.02h4.37v2.05h.06c.61-1.15 2.1-2.37 4.32-2.37 4.62 0 5.47 3.04 5.47 7v8.3h-4.55v-7.36c0-1.76-.03-4.02-2.45-4.02-2.45 0-2.83 1.91-2.83 3.89V23H8.34V8.02z" />
    </svg>
  );
}

type ContactLink = {
  href: string;
  label: string;
  icon: React.ComponentType<IconProps>;
  external?: boolean;
};

function buildContactLinks(site: SiteSettings): ContactLink[] {
  return [
    { href: `mailto:${site.email}`, label: site.email, icon: Mail },
    { href: site.phoneHref, label: site.phone, icon: Phone },
    { href: site.linkedin, label: "LinkedIn", icon: LinkedInIcon, external: true },
  ];
}

export function ContactSection({ site }: { site: SiteSettings }) {
  const contactLinks = buildContactLinks(site);
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="border-t border-border bg-surface px-[var(--px)] pb-32 pt-24"
    >
      <div className="mx-auto max-w-[var(--max)]">
        <Reveal>
          <div className="grid items-start gap-12 min-[900px]:grid-cols-[1fr_480px] min-[900px]:gap-20">
            <div>
              <h2
                id="contact-heading"
                className="mb-5 font-serif text-[clamp(36px,5vw,54px)] font-normal leading-[1.05] tracking-[-0.03em]"
              >
                Let&apos;s build
                <br />
                <em className="italic text-accent">something.</em>
              </h2>
              <p className="mb-9 max-w-[400px] text-base leading-[1.6] text-muted">
                Open to product design work, full-stack development projects, and end-to-end
                builds. If you have a real problem that needs a real product, I want to hear it.
              </p>

              <div className="flex flex-col gap-3.5">
                {contactLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    {...(link.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="inline-flex items-center gap-3 text-[15px] font-medium text-ink-mid transition-colors hover:text-accent"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-base text-muted">
                      <link.icon className="h-4 w-4" aria-hidden />
                    </span>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <ContactForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
