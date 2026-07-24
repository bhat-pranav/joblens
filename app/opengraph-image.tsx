import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const VOID = "#10130f";
const INK = "#eef0e9";
const FOG = "#7c8579";
const SIGNAL = "#e8873f";

const tickStyle = (corner: React.CSSProperties): React.CSSProperties => ({
  position: "absolute",
  width: 28,
  height: 28,
  border: `2px solid ${FOG}`,
  ...corner,
});

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: VOID,
          position: "relative",
        }}
      >
        <div style={tickStyle({ top: 48, left: 48, borderRight: "none", borderBottom: "none" })} />
        <div style={tickStyle({ top: 48, right: 48, borderLeft: "none", borderBottom: "none" })} />
        <div style={tickStyle({ bottom: 48, left: 48, borderRight: "none", borderTop: "none" })} />
        <div style={tickStyle({ bottom: 48, right: 48, borderLeft: "none", borderTop: "none" })} />

        <div style={{ display: "flex", fontSize: 108, fontWeight: 700, color: INK }}>
          JobLens
        </div>
        <div style={{ display: "flex", marginTop: 20, fontSize: 32, color: FOG, maxWidth: 820 }}>
          What the job market is actually asking for, extracted from real
          postings.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 56,
            fontSize: 22,
            color: SIGNAL,
            letterSpacing: 1,
          }}
        >
          1,000 POSTINGS · 119 AGENCIES FILTERED · GPT-4o-mini EXTRACTION
        </div>
      </div>
    ),
    { ...size }
  );
}
