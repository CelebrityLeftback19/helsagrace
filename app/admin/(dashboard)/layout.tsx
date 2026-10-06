import { redirect } from "next/navigation";

import { signOut } from "@/app/admin/actions";
import { AdminNav } from "@/components/admin/admin-nav";
import { SetupNotice } from "@/components/admin/setup-notice";
import { UnauthorizedNotice } from "@/components/admin/unauthorized-notice";
import { isSupabaseConfigured } from "@/lib/cms";
import { getCurrentUser, isCurrentUserAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) {
    return <SetupNotice />;
  }

  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  if (!(await isCurrentUserAdmin())) {
    return <UnauthorizedNotice email={user.email} />;
  }

  return (
    <div className="min-h-screen bg-base">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-8 px-6 py-8 lg:flex-row lg:gap-12">
        <aside className="lg:w-56 lg:shrink-0">
          <div className="mb-6">
            <p className="font-serif text-lg">
              Helsa<em className="italic text-accent">Grace</em>
            </p>
            <p className="text-xs text-muted">Content admin</p>
          </div>

          <AdminNav />

          <form action={signOut} className="mt-6">
            <button
              type="submit"
              className="text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              Sign out
            </button>
          </form>
          <p className="mt-3 truncate text-xs text-muted" title={user.email ?? ""}>
            {user.email}
          </p>
        </aside>

        <main className="min-w-0 flex-1 pb-24">{children}</main>
      </div>
    </div>
  );
}
