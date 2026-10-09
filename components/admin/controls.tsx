"use client";

import { ArrowDown, ArrowUp, Check, Images, Plus, Trash2, Upload } from "lucide-react";
import { useCallback, useRef, useState, type ReactNode } from "react";

import { mediaList, uploadImage, type ActionResult } from "@/app/admin/actions";
import { Field, inputClass } from "@/components/admin/ui";
import type { MediaItem } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

/* ── Save lifecycle ──────────────────────────────────────────── */

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export function useSave() {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async (fn: () => Promise<ActionResult>) => {
    setStatus("saving");
    setError(null);
    const result = await fn();
    if (result.ok) {
      setStatus("saved");
      window.setTimeout(() => setStatus("idle"), 3000);
    } else {
      setStatus("error");
      setError(result.error);
    }
  }, []);

  return { status, error, run };
}

export function SaveBar({
  status,
  error,
  onSave,
  label = "Save changes",
}: {
  status: SaveStatus;
  error?: string | null;
  onSave: () => void;
  label?: string;
}) {
  return (
    <div className="sticky bottom-0 z-10 mt-6 flex items-center gap-3 border-t border-border bg-base/90 py-4 backdrop-blur">
      <button
        type="button"
        onClick={onSave}
        disabled={status === "saving"}
        className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent disabled:opacity-60"
      >
        {status === "saving" ? "Saving…" : label}
      </button>

      {status === "saved" ? (
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1a7a4a]">
          <Check className="h-4 w-4" aria-hidden />
          Saved
        </span>
      ) : null}

      {status === "error" ? (
        <span role="alert" className="text-sm font-medium text-red-600">
          {error ?? "Something went wrong."}
        </span>
      ) : null}
    </div>
  );
}

/* ── Small button ────────────────────────────────────────────── */

export function IconButton({
  label,
  onClick,
  disabled,
  children,
  tone = "default",
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
  tone?: "default" | "danger";
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-md border border-border bg-surface p-1.5 transition-colors disabled:opacity-40",
        tone === "danger" ? "text-muted hover:text-red-600" : "text-muted hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 self-start rounded-lg border border-dashed border-border px-3 py-2 text-sm font-medium text-ink-mid transition-colors hover:border-accent hover:text-accent"
    >
      <Plus className="h-3.5 w-3.5" aria-hidden />
      {label}
    </button>
  );
}

/* ── String list ─────────────────────────────────────────────── */

export function StringList({
  value,
  onChange,
  addLabel = "Add item",
  placeholder,
  multiline = false,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  addLabel?: string;
  placeholder?: string;
  multiline?: boolean;
}) {
  function update(index: number, next: string) {
    onChange(value.map((item, i) => (i === index ? next : item)));
  }
  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    const a = next[index]!;
    next[index] = next[target]!;
    next[target] = a;
    onChange(next);
  }
  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-2">
      {value.map((item, index) => (
        <div key={index} className="flex items-start gap-2">
          {multiline ? (
            <textarea
              value={item}
              onChange={(event) => update(index, event.target.value)}
              placeholder={placeholder}
              className={cn(inputClass, "min-h-[90px] resize-y")}
            />
          ) : (
            <input
              value={item}
              onChange={(event) => update(index, event.target.value)}
              placeholder={placeholder}
              className={inputClass}
            />
          )}
          <div className="flex flex-col gap-1">
            <IconButton label="Move up" onClick={() => move(index, -1)} disabled={index === 0}>
              <ArrowUp className="h-3.5 w-3.5" />
            </IconButton>
            <IconButton
              label="Move down"
              onClick={() => move(index, 1)}
              disabled={index === value.length - 1}
            >
              <ArrowDown className="h-3.5 w-3.5" />
            </IconButton>
            <IconButton label="Remove" tone="danger" onClick={() => remove(index)}>
              <Trash2 className="h-3.5 w-3.5" />
            </IconButton>
          </div>
        </div>
      ))}
      <AddButton onClick={() => onChange([...value, ""])} label={addLabel} />
    </div>
  );
}

/* ── Repeatable object list ──────────────────────────────────── */

export type RepeaterField = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number" | "select" | "image";
  options?: { value: string; label: string }[];
  placeholder?: string;
  full?: boolean;
};

/* ── Image field with upload ─────────────────────────────────── */

function ImageControl({
  value,
  onChange,
  onUploadMany,
  placeholder,
}: {
  value: string;
  onChange: (next: string) => void;
  onUploadMany?: (urls: string[]) => void;
  placeholder?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [library, setLibrary] = useState<MediaItem[] | null>(null);

  async function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    setBusy(true);
    setError(null);

    const urls: string[] = [];
    let firstError: string | null = null;

    for (const file of files) {
      const result = await uploadImage(file);
      if (result.ok) urls.push(result.url);
      else if (!firstError) firstError = result.error;
    }

    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";

    if (firstError) {
      setError(
        urls.length > 0
          ? `${firstError} (${urls.length} of ${files.length} uploaded.)`
          : firstError,
      );
    }
    if (urls.length === 0) return;

    if (urls.length === 1 || !onUploadMany) onChange(urls[0]!);
    else onUploadMany(urls);
  }

  async function toggleLibrary() {
    const next = !libraryOpen;
    setLibraryOpen(next);
    if (next && library === null) {
      setLibrary(await mediaList());
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <input
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className={cn(inputClass, "min-w-0 flex-1")}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-ink-mid transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
        >
          <Upload className="h-3.5 w-3.5" aria-hidden />
          {busy ? "Uploading…" : "Upload"}
        </button>
        <button
          type="button"
          onClick={toggleLibrary}
          aria-expanded={libraryOpen}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-ink-mid transition-colors hover:border-accent hover:text-accent"
        >
          <Images className="h-3.5 w-3.5" aria-hidden />
          Library
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFiles}
      />

      {libraryOpen ? (
        <div className="rounded-lg border border-border bg-surface p-2">
          {library === null ? (
            <p className="px-1 py-2 text-xs text-muted">Loading…</p>
          ) : library.length === 0 ? (
            <p className="px-1 py-2 text-xs text-muted">Nothing uploaded yet.</p>
          ) : (
            <div className="grid max-h-56 grid-cols-3 gap-2 overflow-y-auto p-1 sm:grid-cols-4">
              {library.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  title={item.name}
                  onClick={() => {
                    onChange(item.url);
                    setLibraryOpen(false);
                  }}
                  className="overflow-hidden rounded-md border border-border transition-colors hover:border-accent"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.url} alt={item.name} className="h-14 w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {error ? (
        <span role="alert" className="text-xs font-medium text-red-600">
          {error}
        </span>
      ) : null}

      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt=""
          className="max-h-24 w-auto rounded-md border border-border object-contain"
        />
      ) : null}
    </div>
  );
}

export function Repeatable<T extends object>({
  value,
  onChange,
  fields,
  blank,
  addLabel = "Add item",
  titleField,
}: {
  value: T[];
  onChange: (next: T[]) => void;
  fields: RepeaterField[];
  blank: T;
  addLabel?: string;
  /** Field whose value is shown as the item heading. */
  titleField?: string;
}) {
  function update(index: number, field: RepeaterField, raw: string) {
    const coerced: unknown =
      field.type === "number" ? (raw === "" ? undefined : Number(raw)) : raw;
    onChange(
      value.map((item, i) =>
        i === index ? ({ ...item, [field.key]: coerced } as T) : item,
      ),
    );
  }
  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    const a = next[index]!;
    next[index] = next[target]!;
    next[target] = a;
    onChange(next);
  }
  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-3">
      {value.map((item, index) => (
        <div key={index} className="rounded-xl border border-border bg-base p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.05em] text-muted">
              {(titleField
                ? String((item as Record<string, unknown>)[titleField] ?? "")
                : "") || `Item ${index + 1}`}
            </span>
            <div className="flex items-center gap-1">
              <IconButton label="Move up" onClick={() => move(index, -1)} disabled={index === 0}>
                <ArrowUp className="h-3.5 w-3.5" />
              </IconButton>
              <IconButton
                label="Move down"
                onClick={() => move(index, 1)}
                disabled={index === value.length - 1}
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </IconButton>
              <IconButton label="Remove" tone="danger" onClick={() => remove(index)}>
                <Trash2 className="h-3.5 w-3.5" />
              </IconButton>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {fields.map((field) => (
              <div
                key={field.key}
                className={
                  field.full || field.type === "textarea" || field.type === "image"
                    ? "sm:col-span-2"
                    : ""
                }
              >
                <Field label={field.label}>
                  {(() => {
                    const current = String(
                      (item as Record<string, unknown>)[field.key] ?? "",
                    );
                    if (field.type === "image") {
                      return (
                        <ImageControl
                          value={current}
                          placeholder={field.placeholder}
                          onChange={(next) => update(index, field, next)}
                          onUploadMany={(urls) => {
                            const [first, ...rest] = urls;
                            if (first === undefined) return;
                            const next = value.map((entry, i) =>
                              i === index
                                ? ({ ...entry, [field.key]: first } as T)
                                : entry,
                            );
                            for (const url of rest) {
                              next.push({ ...blank, [field.key]: url } as T);
                            }
                            onChange(next);
                          }}
                        />
                      );
                    }
                    if (field.type === "textarea") {
                      return (
                        <textarea
                          value={current}
                          placeholder={field.placeholder}
                          onChange={(event) => update(index, field, event.target.value)}
                          className={cn(inputClass, "min-h-[90px] resize-y")}
                        />
                      );
                    }
                    if (field.type === "select") {
                      return (
                        <select
                          value={current}
                          onChange={(event) => update(index, field, event.target.value)}
                          className={inputClass}
                        >
                          {(field.options ?? []).map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      );
                    }
                    return (
                      <input
                        type={field.type === "number" ? "number" : "text"}
                        value={current}
                        placeholder={field.placeholder}
                        onChange={(event) => update(index, field, event.target.value)}
                        className={inputClass}
                      />
                    );
                  })()}
                </Field>
              </div>
            ))}
          </div>
        </div>
      ))}
      <AddButton onClick={() => onChange([...value, { ...blank }])} label={addLabel} />
    </div>
  );
}
