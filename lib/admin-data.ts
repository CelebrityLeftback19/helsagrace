import { CONTACT_MESSAGES_TABLE, MEDIA_BUCKET, REVISIONS_TABLE } from "@/lib/cms";
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

/* ── Contact messages ────────────────────────────────────────── */

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: string;
  emailed: boolean;
  createdAt: string;
};

export async function listContactMessages(limit = 200): Promise<ContactMessage[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from(CONTACT_MESSAGES_TABLE)
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id as number,
    name: row.name as string,
    email: row.email as string,
    subject: (row.subject as string | null) ?? null,
    message: row.message as string,
    status: (row.status as string | null) ?? "new",
    emailed: Boolean(row.emailed),
    createdAt: row.created_at as string,
  }));
}

export async function countUnreadMessages(): Promise<number> {
  const supabase = await createSupabaseServerClient();
  const { count, error } = await supabase
    .from(CONTACT_MESSAGES_TABLE)
    .select("id", { count: "exact", head: true })
    .eq("status", "new");

  if (error) return 0;
  return count ?? 0;
}

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
