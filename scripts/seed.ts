/**
 * Loads the in-repo default content into Supabase.
 *
 *   npm run seed
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.
 * Run supabase/schema.sql first.
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

/** Reads the `role` claim from a legacy JWT key, or null for newer keys. */
function keyRole(key: string): string | null {
  const parts = key.split(".");
  if (parts.length !== 3) return null;
  try {
    const payload = JSON.parse(
      Buffer.from(parts[1] ?? "", "base64url").toString("utf8"),
    ) as { role?: unknown };
    return typeof payload.role === "string" ? payload.role : null;
  } catch {
    return null;
  }
}

/** Returns a human explanation if the service key is clearly the wrong one. */
function diagnoseServiceKey(serviceKey: string, anonKey: string | undefined): string | null {
  if (anonKey && serviceKey.trim() === anonKey.trim()) {
    return "SUPABASE_SERVICE_ROLE_KEY is identical to NEXT_PUBLIC_SUPABASE_ANON_KEY — that's the anon key.";
  }
  if (serviceKey.startsWith("sb_publishable_")) {
    return "SUPABASE_SERVICE_ROLE_KEY looks like a publishable key — that's the public one.";
  }
  if (keyRole(serviceKey) === "anon") {
    return "SUPABASE_SERVICE_ROLE_KEY is an anon-role key.";
  }
  return null;
}

async function main() {
  loadEnvFiles();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

  if (!url || !serviceKey) {
    console.error(
      "\nMissing configuration.\n" +
        "Add NEXT_PUBLIC_SUPABASE_URL and a privileged key to .env.local:\n" +
        "  SUPABASE_SERVICE_ROLE_KEY (legacy) or SUPABASE_SECRET_KEY (new)\n" +
        "Then run supabase/schema.sql in the Supabase SQL editor.\n",
    );
    process.exitCode = 1;
    return;
  }

  const problem = diagnoseServiceKey(serviceKey, anonKey);
  if (problem) {
    console.error(
      `\n${problem}\n\n` +
        "Seeding needs the privileged secret key (it bypasses RLS).\n" +
        "Find it in: Supabase → Project Settings → API Keys\n" +
        "  • Secret keys → create/copy a secret key (sb_secret_…), or\n" +
        "  • Legacy API keys → the `service_role` secret\n\n" +
        "Then in .env.local set the privileged key — e.g.\n" +
        "  SUPABASE_SECRET_KEY=sb_secret_…\n" +
        "and run `npm run seed` again.\n",
    );
    process.exitCode = 1;
    return;
  }

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

  const { error } = await supabase
    .from("site_content")
    .upsert({ id: 1, data: defaultContent, updated_at: new Date().toISOString() });

  if (error) {
    console.error("Failed to seed content:", error.message);
    if (/row-level security/i.test(error.message)) {
      console.error(
        "\nThat's a row-level-security error: the key isn't privileged.\n" +
          "Use the service_role key (or the new Secret key), not the anon/publishable key.\n",
      );
    }
    process.exitCode = 1;
    return;
  }

  await supabase.from("content_revisions").insert({ data: defaultContent, label: "Initial seed" });

  console.log("Seeded site content into Supabase.");
}

void main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
