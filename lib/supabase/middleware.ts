import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { supabasePublicKey, supabaseUrl } from "@/lib/supabase/env";

/**
 * Refreshes the Supabase session on every request and gates the admin.
 * If Supabase is not configured, requests pass through so the admin can
 * show a setup notice instead of redirecting in a loop.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = supabaseUrl();
  const key = supabasePublicKey();
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/login";

  if (pathname.startsWith("/admin") && !isLogin && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/login";
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isLogin && user) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}
