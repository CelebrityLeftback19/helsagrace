/**
 * One-off: push the newest site copy / about / résumé defaults into the stored
 * content WITHOUT touching projects, capabilities, screenshots or anything else
 * that may have been edited in the admin.
 *
 *   npx tsx scripts/sync-copy.ts
 */
import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "node:fs";

import { defaultContent } from "../lib/content";

function loadEnvFiles() {
  for (const file of [".env.local", ".env"]) {
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
      const match = /^\s*([\w.-]+)\s*=\s*(.*)\s*$/.exec(line);
      if (!match) continue;
      const key = match[1]!;
      let value = match[2] ?? "";
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = value;
    }
  }
}

async function main() {
  loadEnvFiles();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or a service/secret key.");
    process.exitCode = 1;
    return;
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const { data, error } = await supabase
    .from("site_content")
    .select("data")
    .eq("id", 1)
    .single();

  if (error || !data) {
    console.error("Could not read stored content:", error?.message);
    process.exitCode = 1;
    return;
  }

  const stored = (data.data ?? {}) as Record<string, unknown>;
  const next = {
    ...stored,
    site: { ...((stored.site as Record<string, unknown>) ?? {}), ...defaultContent.site },
    aboutParagraphs: defaultContent.aboutParagraphs,
    resume: defaultContent.resume,
  };

  const { error: writeError } = await supabase
    .from("site_content")
    .upsert({ id: 1, data: next, updated_at: new Date().toISOString() });

  if (writeError) {
    console.error("Could not write content:", writeError.message);
    process.exitCode = 1;
    return;
  }

  await supabase
    .from("content_revisions")
    .insert({ data: next, label: "Sync site copy + résumé defaults" });

  console.log("Synced site copy, about and résumé into the stored content.");
}

void main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
