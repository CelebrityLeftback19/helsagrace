export function StackSection({ stack }: { stack: string[] }) {
  return (
    <section
      id="stack"
      aria-label="Technology stack"
      className="border-y border-border px-[var(--px)] py-20"
    >
      <div className="mx-auto max-w-[var(--max)]">
        <p className="mb-7 text-center text-[13px] font-medium text-muted">
          Technologies I work with
        </p>
        <div className="mx-auto flex max-w-[800px] flex-wrap justify-center gap-2.5">
          {stack.map((item) => (
            <span
              key={item}
              className="rounded-full border border-border bg-surface px-[18px] py-2 text-[13px] font-medium text-ink-mid"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
