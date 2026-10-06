import { signOut } from "@/app/admin/actions";

export function UnauthorizedNotice({ email }: { email?: string | null }) {
  return (
    <main className="mx-auto max-w-[560px] px-6 py-20">
      <h1 className="mb-3 font-serif text-2xl">This account isn&apos;t an owner</h1>
      <p className="mb-6 text-ink-mid">
        {email ? (
          <>
            <strong className="font-medium text-ink">{email}</strong> is signed in, but it isn&apos;t
            on the owner allowlist.
          </>
        ) : (
          "This account isn't on the owner allowlist."
        )}{" "}
        Add the email to the <code>admin_users</code> table in Supabase to grant access.
      </p>
      <form action={signOut}>
        <button
          type="submit"
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent"
        >
          Sign out
        </button>
      </form>
    </main>
  );
}
