import { createClient } from "@supabase/supabase-js";

import {
  isSupabaseConfigured,
  supabasePublicKey,
  supabaseUrl,
} from "@/lib/supabase/env";
import { defaultContent, type SiteContent } from "@/lib/content";

const CONTENT_TABLE = "site_content";
const REVISIONS_TABLE = "content_revisions";

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
    capabilities: partial.capabilities ?? defaultContent.capabilities,
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

export { CONTENT_TABLE, REVISIONS_TABLE };
