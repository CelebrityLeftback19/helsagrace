/**
 * Central access to Supabase environment variables.
 *
 * Supabase now offers two key naming schemes. Both are accepted:
 *   - legacy:      NEXT_PUBLIC_SUPABASE_ANON_KEY  / SUPABASE_SERVICE_ROLE_KEY
 *   - new keys:    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY / SUPABASE_SECRET_KEY
 *
 * These are read on the server (and middleware); no client component reads
 * them directly, so runtime access is fine.
 */

export function supabaseUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_URL;
}

/** The public key — anon JWT or the newer publishable key. */
export function supabasePublicKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

/** The privileged key — service_role JWT or the newer secret key. Seed only. */
export function supabaseServiceKey(): string | undefined {
  return process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl() && supabasePublicKey());
}
