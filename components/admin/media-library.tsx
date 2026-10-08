"use client";

import { Check, Copy, Search, Trash2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";

import { deleteMedia, uploadImage } from "@/app/admin/actions";
import { inputClass } from "@/components/admin/ui";
import type { MediaItem } from "@/lib/admin-data";
import { cn, copyToClipboard } from "@/lib/utils";

function formatBytes(bytes: number): string {
  if (!bytes) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(unit === 0 || value >= 10 ? 0 : 1)} ${units[unit]}`;
}

export function MediaLibrary({ initial }: { initial: MediaItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState<MediaItem[]>(initial);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.name.toLowerCase().includes(q));
  }, [items, query]);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setBusy(true);
    setError(null);
    const result = await uploadImage(file);
    setBusy(false);
    if (fileRef.current) fileRef.current.value = "";

    if (!result.ok) {
      setError(result.error);
      return;
    }

    const name = result.url.split("/").pop() ?? result.url;
    setItems((prev) => [
      {
        name,
        url: result.url,
        size: file.size,
        mimeType: file.type,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    router.refresh();
  }

  async function copy(item: MediaItem) {
    const ok = await copyToClipboard(item.url);
    if (ok) {
      setCopied(item.name);
      window.setTimeout(() => setCopied(null), 2000);
    } else {
      setError("Couldn't copy automatically — select the URL and copy manually.");
    }
  }

  async function remove(item: MediaItem) {
    if (
      !window.confirm(
        `Delete ${item.name}? Any project still pointing at it will fall back to a placeholder.`,
      )
    ) {
      return;
    }
    setBusy(true);
    setError(null);
    const result = await deleteMedia(item.name);
    setBusy(false);
    if (result.ok) {
      setItems((prev) => prev.filter((entry) => entry.name !== item.name));
      router.refresh();
    } else {
      setError(result.error);
    }
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <label className="relative min-w-[220px] flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by filename…"
            className={cn(inputClass, "pl-9")}
          />
        </label>

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent disabled:opacity-60"
        >
          <Upload className="h-4 w-4" aria-hidden />
          {busy ? "Working…" : "Upload image"}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
      </div>

      {error ? (
        <p role="alert" className="mb-4 text-sm font-medium text-red-600">
          {error}
        </p>
      ) : null}

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-border bg-surface p-8 text-sm text-muted">
          {items.length === 0
            ? "Nothing uploaded yet. Upload an image, then copy its URL into any project screenshot."
            : "No files match that search."}
        </p>
      ) : (
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-4">
          {filtered.map((item) => (
            <li key={item.name} className="overflow-hidden rounded-xl border border-border bg-surface">
              <div className="aspect-[16/10] bg-base">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={item.name}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-3">
                <p className="truncate text-xs font-medium text-ink" title={item.name}>
                  {item.name}
                </p>
                <p className="mt-0.5 text-[11px] text-muted">
                  {formatBytes(item.size)}
                  {item.createdAt ? ` · ${new Date(item.createdAt).toLocaleDateString("en-GB")}` : ""}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copy(item)}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-ink-mid transition-colors hover:border-accent hover:text-accent"
                  >
                    {copied === item.name ? (
                      <>
                        <Check className="h-3.5 w-3.5" aria-hidden />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" aria-hidden />
                        Copy URL
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(item)}
                    aria-label={`Delete ${item.name}`}
                    className="rounded-lg border border-border p-1.5 text-muted transition-colors hover:border-red-300 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
