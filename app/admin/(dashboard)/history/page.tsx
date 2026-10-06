import { RestoreButton } from "@/components/admin/restore-button";
import { getRevisions } from "@/lib/admin-data";

export default async function HistoryPage() {
  const revisions = await getRevisions();

  return (
    <div>
      <h1 className="mb-2 font-serif text-3xl">History</h1>
      <p className="mb-6 text-ink-mid">
        The last {revisions.length} saves. Restoring keeps the current content as a new
        revision, so nothing is lost.
      </p>

      {revisions.length === 0 ? (
        <p className="rounded-2xl border border-border bg-surface p-6 text-sm text-muted">
          No revisions yet. Save something and it will appear here.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {revisions.map((revision) => (
            <li
              key={revision.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-ink">{revision.label ?? "Content updated"}</p>
                <p className="text-xs text-muted">
                  #{revision.id} · {new Date(revision.createdAt).toLocaleString("en-GB")}
                </p>
              </div>
              <RestoreButton id={revision.id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
