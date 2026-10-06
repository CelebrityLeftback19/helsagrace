import { REVISIONS_TABLE } from "@/lib/cms";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { mergeContent, type Revision } from "@/lib/cms";
import type { SiteContent } from "@/lib/content";

/** Revision history — read with the authenticated session (RLS-protected). */
export async function getRevisions(limit = 30): Promise<Revision[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from(REVISIONS_TABLE)
    .select("id,label,created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data.map((row) => ({
    id: row.id as number,
    label: (row.label as string | null) ?? null,
    createdAt: row.created_at as string,
  }));
}

export async function getRevisionData(id: number): Promise<SiteContent | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from(REVISIONS_TABLE)
    .select("data")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return mergeContent(data.data);
}
