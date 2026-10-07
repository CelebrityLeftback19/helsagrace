import { createClient } from "@supabase/supabase-js";

import {
  isSupabaseConfigured,
  supabasePublicKey,
  supabaseUrl,
} from "@/lib/supabase/env";
import { defaultContent, type Capability, type SiteContent } from "@/lib/content";

export const CONTENT_TABLE = "site_content";
export const REVISIONS_TABLE = "content_revisions";
export const MEDIA_BUCKET = "media";
export const CONTACT_MESSAGES_TABLE = "contact_messages";

export { isSupabaseConfigured };

/**
 * Read-only client for the public site. Deliberately cookie-free so pages can
 * remain statically rendered and only refresh when content is revalidated.
 */
function publicClient() {
  return createClient(supabaseUrl()!, supabasePublicKey()!, {
    auth: { persistSession: false },
  });
}

/**
 * Capabilities gained `decision` / `projectSlug` fields after the first seed.
 * Fill any missing fields from the defaults (matched by title with a positional
 * fallback) so stored content written before the change still renders fully.
 */
function mergeCapabilities(stored: unknown): Capability[] {
  if (!Array.isArray(stored)) return defaultContent.capabilities;

  return stored.map((item, index) => {
    const record = (item ?? {}) as Partial<Capability>;
    const fallback =
      defaultContent.capabilities.find((capability) => capability.title === record.title) ??
      defaultContent.capabilities[index];

    return { ...(fallback ?? {}), ...record } as Capability;
  });
}

/**
 * Merges stored content over the defaults, so a field added to the codebase
 * after content was saved still renders until it is edited in the admin.
 */
export function mergeContent(stored: unknown): SiteContent {
  if (!stored || typeof stored !== "object") return defaultContent;
  const partial = stored as Partial<SiteContent>;
  return {
    site: { ...defaultContent.site, ...(partial.site ?? {}) },
    disciplines: partial.disciplines ?? defaultContent.disciplines,
    projects: partial.projects ?? defaultContent.projects,
    capabilities: mergeCapabilities(partial.capabilities),
    processSteps: partial.processSteps ?? defaultContent.processSteps,
    stack: partial.stack ?? defaultContent.stack,
    aboutParagraphs: partial.aboutParagraphs ?? defaultContent.aboutParagraphs,
    stats: partial.stats ?? defaultContent.stats,
  };
}

/** Reads the live content, falling back to the in-repo defaults. */
export async function getContent(): Promise<SiteContent> {
  if (!isSupabaseConfigured()) return defaultContent;

  try {
    const supabase = publicClient();
    const { data, error } = await supabase
      .from(CONTENT_TABLE)
      .select("data")
      .eq("id", 1)
      .single();

    if (error || !data) return defaultContent;
    return mergeContent(data.data);
  } catch {
    return defaultContent;
  }
}

export type Revision = { id: number; label: string | null; createdAt: string };
