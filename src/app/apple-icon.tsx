import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FFFFFF",
          borderRadius: 40,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 12,
            height: 90,
            position: "relative"
          }}
        >
          <div style={{ width: 18, height: 45, background: "#FF4500", borderRadius: 4 }} />
          <div style={{ width: 18, height: 65, background: "#FF4500", borderRadius: 4 }} />
          <div style={{ width: 18, height: 90, background: "#FF4500", borderRadius: 4 }} />
          <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#FF4500", position: "absolute", top: -10, left: 48 }} />
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
