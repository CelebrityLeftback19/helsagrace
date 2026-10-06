import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { isSupabaseConfigured, supabasePublicKey, supabaseUrl } from "@/lib/supabase/env";

/**
 * Supabase client bound to the request cookies. Used for auth and for writes
 * from the admin. Create a new one per request — never share it.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl()!, supabasePublicKey()!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component — safe to ignore when middleware
          // is responsible for refreshing the session.
        }
      },
    },
  });
}

/** Returns the signed-in user, or null. */
export async function getCurrentUser() {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** True when the signed-in user's email is on the owner allowlist. */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("is_admin");
  if (error) return false;
  return data === true;
}
