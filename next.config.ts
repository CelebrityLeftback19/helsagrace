import type { NextConfig } from "next";

type RemotePatterns = NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]>;

/**
 * Uploaded screenshots are served from Supabase Storage, so the public site's
 * `next/image` needs those hosts allow-listed. The project host is derived from
 * the env var; the wildcards cover projects whose URL isn't known at build time.
 */
function supabaseRemotePatterns(): RemotePatterns {
  const patterns: RemotePatterns = [
    { protocol: "https", hostname: "**.supabase.co", pathname: "/storage/v1/object/public/**" },
    { protocol: "https", hostname: "**.supabase.in", pathname: "/storage/v1/object/public/**" },
  ];

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (url) {
    try {
      const { hostname } = new URL(url);
      if (!patterns.some((pattern) => pattern.hostname === hostname)) {
        patterns.push({
          protocol: "https",
          hostname,
          pathname: "/storage/v1/object/public/**",
        });
      }
    } catch {
      // Ignore a malformed URL — the wildcards above still apply.
    }
  }

  return patterns;
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: supabaseRemotePatterns(),
  },
};

export default nextConfig;
