import { Fragment, type ReactNode } from "react";

/**
 * Renders a string where **double asterisks** denote emphasis.
 * Keeps authored copy in `lib/content.ts` readable as plain text.
 */
export function RichText({ text }: { text: string }): ReactNode {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-medium text-ink">
            {part}
          </strong>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
