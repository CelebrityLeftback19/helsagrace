import { Mail, Phone } from "lucide-react";

import { GitHubIcon, LinkedInIcon, WhatsAppIcon } from "@/components/brand-icons";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import type { SiteSettings } from "@/lib/content";

type IconProps = { className?: string; "aria-hidden"?: boolean };

type ContactLink = {
  href: string;
  label: string;
  icon: React.ComponentType<IconProps>;
  external?: boolean;
};

function buildContactLinks(site: SiteSettings): ContactLink[] {
  return [
    { href: `mailto:${site.email}`, label: site.email, icon: Mail },
    { href: site.whatsapp, label: "WhatsApp", icon: WhatsAppIcon, external: true },
    { href: site.github, label: "GitHub", icon: GitHubIcon, external: true },
    { href: site.linkedin, label: "LinkedIn", icon: LinkedInIcon, external: true },
    { href: site.phoneHref, label: site.phone, icon: Phone },
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
                    data-cursor="link"
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
