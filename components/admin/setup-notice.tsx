import Link from "next/link";

export function SetupNotice() {
  return (
    <main className="mx-auto max-w-[720px] px-6 py-20">
      <h1 className="mb-3 font-serif text-3xl">Connect Supabase to enable the admin</h1>
      <p className="mb-6 text-ink-mid">
        The public site is running on the in-repo defaults. To edit content from this admin,
        create a Supabase project and add these variables to <code>.env.local</code>:
      </p>
      <pre className="mb-6 overflow-x-auto rounded-xl border border-border bg-surface p-5 text-sm leading-relaxed">
        {`NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_…   # or NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SECRET_KEY=sb_secret_…                        # or SUPABASE_SERVICE_ROLE_KEY (seed only)`}
      </pre>
      <ol className="mb-6 list-decimal space-y-2 pl-5 text-ink-mid">
        <li>
          Run the SQL in <code>supabase/schema.sql</code> in the Supabase SQL editor.
        </li>
        <li>
          Create an admin user under <strong>Authentication → Users</strong>, then add that
          email to the <code>admin_users</code> table.
        </li>
        <li>
          Run <code>npm run seed</code> to load the current content into the database.
        </li>
        <li>Restart the dev server and sign in.</li>
      </ol>
      <p className="text-sm text-muted">
        Full steps are in the project README. The public site never depends on these variables —
        it falls back to the defaults in <code>lib/content.ts</code>.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full border border-border px-5 py-2.5 text-sm font-medium text-ink-mid transition-colors hover:border-ink hover:text-ink"
      >
        Back to site
      </Link>
    </main>
  );
}
