import { MEDIA_BUCKET, REVISIONS_TABLE } from "@/lib/cms";
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

/* ── Media library ───────────────────────────────────────────── */

export type MediaItem = {
  name: string;
  url: string;
  size: number;
  mimeType: string;
  createdAt: string;
};

/** Lists uploaded files in the public `media` bucket, newest first. */
export async function listMedia(limit = 300): Promise<MediaItem[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .list("", { limit, sortBy: { column: "created_at", order: "desc" } });

  if (error || !data) return [];

  return data
    .filter((item) => item.name && !item.name.startsWith("."))
    .map((item) => {
      const metadata = (item.metadata ?? {}) as Record<string, unknown>;
      return {
        name: item.name,
        url: supabase.storage.from(MEDIA_BUCKET).getPublicUrl(item.name).data.publicUrl,
        size: typeof metadata.size === "number" ? metadata.size : 0,
        mimeType: typeof metadata.mimetype === "string" ? metadata.mimetype : "",
        createdAt: (item.created_at as string | undefined) ?? "",
      };
    });
}
