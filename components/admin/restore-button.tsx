"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { restoreRevision } from "@/app/admin/actions";

export function RestoreButton({ id }: { id: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function restore() {
    if (
      !window.confirm(
        `Restore revision #${id}? The current content is saved as a new revision first, so this is reversible.`,
      )
    ) {
      return;
    }
    setBusy(true);
    const result = await restoreRevision(id);
    setBusy(false);
    if (result.ok) router.refresh();
    else window.alert(result.error);
  }

  return (
    <button
      type="button"
      onClick={restore}
      disabled={busy}
      className="rounded-full border border-border px-4 py-1.5 text-xs font-medium text-ink-mid transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
    >
      {busy ? "Restoring…" : "Restore"}
    </button>
  );
}
