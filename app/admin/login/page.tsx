import Link from "next/link";

import { LoginForm } from "@/components/admin/login-form";
import { isSupabaseConfigured } from "@/lib/cms";
import { SetupNotice } from "@/components/admin/setup-notice";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  if (!isSupabaseConfigured()) return <SetupNotice />;

  const { next } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-[400px]">
        <Link href="/" className="mb-8 block font-serif text-2xl">
          Helsa<em className="italic text-accent">Grace</em>
        </Link>
        <h1 className="mb-1 font-serif text-2xl">Content admin</h1>
        <p className="mb-6 text-sm text-muted">Sign in to edit the portfolio.</p>
        <LoginForm next={next} />
      </div>
    </main>
  );
}
