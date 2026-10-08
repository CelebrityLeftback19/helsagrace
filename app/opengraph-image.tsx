import { ImageResponse } from "next/og";

export const alt = "HelsaGrace — Product Designer & Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Share card for links to the portfolio. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0f0f14",
          padding: 72,
          color: "#ffffff",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 420,
            background:
              "radial-gradient(55% 100% at 25% 0%, rgba(91,79,232,0.5), rgba(15,15,20,0))",
          }}
        />

        <div style={{ display: "flex", fontSize: 30, letterSpacing: -0.5 }}>
          Helsa
          <span style={{ color: "#a79fff", fontStyle: "italic" }}>Grace</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 68, lineHeight: 1.06, letterSpacing: -2, maxWidth: 900 }}>
            I design products. I also build them.
          </div>
          <div style={{ marginTop: 28, fontSize: 26, color: "rgba(255,255,255,0.62)" }}>
            Product Designer · UI/UX · Full-Stack Developer · AI
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 22, color: "rgba(255,255,255,0.4)" }}>
          helsagrace.site
        </div>
      </div>
    ),
    size,
  );
}
