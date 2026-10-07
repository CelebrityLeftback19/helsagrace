"use client";

import { cn } from "@/lib/utils";

function MarqueeRow({ items, direction }: { items: string[]; direction: "left" | "right" }) {
  return (
    <div className="marquee flex w-max" data-direction={direction}>
      {[0, 1].map((set) => (
        <div
          key={set}
          className={cn("flex shrink-0 gap-3 pr-3", set === 1 && "marquee-clone")}
          aria-hidden={set === 1}
        >
          {items.map((item) => (
            <span
              key={item}
              className="whitespace-nowrap rounded-full border border-border bg-surface px-[18px] py-2 text-[13px] font-medium text-ink-mid"
            >
              {item}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export function StackSection({ stack }: { stack: string[] }) {
  const half = Math.ceil(stack.length / 2);
  const rowA = stack.slice(0, half);
  const rowB = stack.slice(half);

  return (
    <section id="stack" aria-label="Technology stack" className="border-y border-border py-16">
      <p className="mb-7 px-[var(--px)] text-center text-[13px] font-medium text-muted">
        Technologies I work with
      </p>
      <div className="flex flex-col gap-3 overflow-hidden">
        <MarqueeRow items={rowA} direction="left" />
        <MarqueeRow items={rowB} direction="right" />
      </div>
    </section>
  );
}
