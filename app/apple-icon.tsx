import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** iOS home-screen icon (SVG favicons aren't used there). */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f0f14",
          color: "#ffffff",
          fontSize: 96,
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        H
        <div
          style={{
            width: 44,
            height: 6,
            marginTop: 4,
            borderRadius: 3,
            background: "#5b4fe8",
          }}
        />
      </div>
    ),
    size,
  );
}
