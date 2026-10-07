"use client";

/**
 * Last-resort boundary: replaces the root layout, so it carries its own
 * <html>/<body> and uses inline styles (the stylesheet may not be loaded yet).
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          textAlign: "center",
          background: "#0f0f14",
          color: "#ffffff",
          fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
        }}
      >
        <div style={{ maxWidth: 480 }}>
          <p
            style={{
              margin: "0 0 16px",
              fontSize: 12,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            HelsaGrace
          </p>
          <h1
            style={{
              margin: "0 0 16px",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontWeight: 400,
              fontSize: "clamp(32px, 6vw, 56px)",
              lineHeight: 1.05,
            }}
          >
            Something broke.
          </h1>
          <p style={{ margin: "0 0 28px", color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>
            A fatal error stopped the app from loading. Reloading usually clears it.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              background: "#5b4fe8",
              color: "#ffffff",
              border: 0,
              borderRadius: 9999,
              padding: "14px 28px",
              fontSize: 15,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
