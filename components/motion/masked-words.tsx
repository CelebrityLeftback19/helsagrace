import { Fragment } from "react";

/** Splits a line into word masks so it can be revealed from below. */
export function MaskedWords({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span className="hero-mask">
            <span className="hero-word inline-block">{word}</span>
          </span>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}
