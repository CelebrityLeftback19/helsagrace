import {
  CodeXml,
  Database,
  LayoutPanelLeft,
  Lightbulb,
  PenLine,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import type { IconKey } from "@/lib/content";

/** Icon keys offered in the admin and resolved to Lucide components. */
export const ICON_KEYS: IconKey[] = [
  "layout-panel-left",
  "pen-line",
  "code-xml",
  "lightbulb",
  "database",
  "shield-check",
];

const ICONS: Record<IconKey, LucideIcon> = {
  "layout-panel-left": LayoutPanelLeft,
  "pen-line": PenLine,
  "code-xml": CodeXml,
  lightbulb: Lightbulb,
  database: Database,
  "shield-check": ShieldCheck,
};

/** Resolves a stored icon key to a component, falling back to a lightbulb. */
export function resolveIcon(key: string): LucideIcon {
  return ICONS[key as IconKey] ?? Lightbulb;
}
