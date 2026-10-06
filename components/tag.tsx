import type { Tag } from "@/lib/content";
import { cn } from "@/lib/utils";

const VARIANT_STYLES: Record<NonNullable<Tag["variant"]>, string> = {
  default: "text-muted bg-base border-border",
  accent: "text-accent bg-accent-light border-[#d5d1ff]",
  live: "text-[#1a7a4a] bg-[#edfaf3] border-[#c3eed8]",
};

export function TagPill({ tag, size = "sm" }: { tag: Tag; size?: "sm" | "md" }) {
  return (
    <span
      className={cn(
        "inline-block rounded-full border font-semibold",
        size === "sm" ? "px-2.5 py-[3px] text-[11px] tracking-[0.04em]" : "px-3 py-1 text-xs",
        VARIANT_STYLES[tag.variant ?? "default"],
      )}
    >
      {tag.label}
    </span>
  );
}
