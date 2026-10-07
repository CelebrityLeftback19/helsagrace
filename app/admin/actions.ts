"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getRevisionData, listMedia, type MediaItem } from "@/lib/admin-data";
import {
  CONTACT_MESSAGES_TABLE,
  CONTENT_TABLE,
  MEDIA_BUCKET,
  REVISIONS_TABLE,
  getContent,
  isSupabaseConfigured,
} from "@/lib/cms";
import type { SiteContent } from "@/lib/content";
import {
  createSupabaseServerClient,
  getCurrentUser,
  isCurrentUserAdmin,
} from "@/lib/supabase/server";

export type ActionResult = { ok: true } | { ok: false; error: string };
export type UploadResult = { ok: true; url: string } | { ok: false; error: string };

const NOT_OWNER = "This account isn't on the owner allowlist.";
const SESSION_EXPIRED = "Your session has expired. Please sign in again.";

const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/avif", "image/gif"];
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

function revalidateSite() {
  revalidatePath("/");
  revalidatePath("/admin");
}

/**
 * Applies a patch to the stored content, records a revision, and refreshes
 * the public site. Owner-only; RLS enforces the same rule at the database.
 */
export async function saveContent(
  patch: Partial<SiteContent>,
  label: string,
): Promise<ActionResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured." };
  }
  if (!(await getCurrentUser())) return { ok: false, error: SESSION_EXPIRED };
  if (!(await isCurrentUserAdmin())) return { ok: false, error: NOT_OWNER };

  const current = await getContent();
  const next: SiteContent = {
    ...current,
    ...patch,
    site: patch.site ? { ...current.site, ...patch.site } : current.site,
  };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from(CONTENT_TABLE)
    .upsert({ id: 1, data: next, updated_at: new Date().toISOString() });

  if (error) return { ok: false, error: error.message };

  await supabase.from(REVISIONS_TABLE).insert({ data: next, label });
  revalidateSite();
  return { ok: true };
}

export async function restoreRevision(id: number): Promise<ActionResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured." };
  }
  if (!(await getCurrentUser())) return { ok: false, error: SESSION_EXPIRED };
  if (!(await isCurrentUserAdmin())) return { ok: false, error: NOT_OWNER };

  const data = await getRevisionData(id);
  if (!data) return { ok: false, error: "Revision not found." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from(CONTENT_TABLE)
    .upsert({ id: 1, data, updated_at: new Date().toISOString() });

  if (error) return { ok: false, error: error.message };

  await supabase
    .from(REVISIONS_TABLE)
    .insert({ data, label: `Restored revision #${id}` });

  revalidateSite();
  return { ok: true };
}

/** Uploads a screenshot to the public `media` bucket and returns its URL. */
export async function uploadImage(file: File): Promise<UploadResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured." };
  }
  if (!(await getCurrentUser())) return { ok: false, error: SESSION_EXPIRED };
  if (!(await isCurrentUserAdmin())) return { ok: false, error: NOT_OWNER };

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { ok: false, error: "Images only (png, jpg, webp, avif or gif)." };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: "That image is larger than 8 MB." };
  }

  const extension = file.name.includes(".")
    ? file.name.split(".").pop()!.toLowerCase()
    : "png";
  const baseName =
    file.name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "image";
  const path = `${Date.now()}-${baseName}.${extension}`;

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, file, { contentType: file.type, cacheControl: "31536000", upsert: false });

  if (error) return { ok: false, error: error.message };

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return { ok: true, url: data.publicUrl };
}

export async function signIn(email: string, password: string): Promise<ActionResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured. See README to set it up." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: error.message };

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (isAdmin !== true) {
    await supabase.auth.signOut();
    return { ok: false, error: NOT_OWNER };
  }

  revalidatePath("/admin");
  return { ok: true };
}

export async function signOut(): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }
  revalidatePath("/admin");
  redirect("/admin/login");
}

/* ── Media library ───────────────────────────────────────────── */

/** Lists uploaded media for the library and the in-editor picker. */
export async function mediaList(): Promise<MediaItem[]> {
  if (!isSupabaseConfigured()) return [];
  if (!(await isCurrentUserAdmin())) return [];
  return listMedia();
}

export async function deleteMedia(name: string): Promise<ActionResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured." };
  }
  if (!(await getCurrentUser())) return { ok: false, error: SESSION_EXPIRED };
  if (!(await isCurrentUserAdmin())) return { ok: false, error: NOT_OWNER };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.storage.from(MEDIA_BUCKET).remove([name]);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/media");
  return { ok: true };
}

/* ── Contact messages ────────────────────────────────────────── */

export async function setMessageStatus(id: number, status: "new" | "read"): Promise<ActionResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured." };
  }
  if (!(await getCurrentUser())) return { ok: false, error: SESSION_EXPIRED };
  if (!(await isCurrentUserAdmin())) return { ok: false, error: NOT_OWNER };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from(CONTACT_MESSAGES_TABLE).update({ status }).eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  return { ok: true };
}

export async function deleteMessage(id: number): Promise<ActionResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured." };
  }
  if (!(await getCurrentUser())) return { ok: false, error: SESSION_EXPIRED };
  if (!(await isCurrentUserAdmin())) return { ok: false, error: NOT_OWNER };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from(CONTACT_MESSAGES_TABLE).delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/messages");
  revalidatePath("/admin");
  return { ok: true };
}
