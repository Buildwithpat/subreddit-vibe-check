import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Vibecheck — Reddit Sentiment Intelligence";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
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
          background: "#FFFFFF",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "8px",
            background: "#FF4500",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 8,
              height: 48,
            }}
          >
            <div style={{ width: 8, height: 24, background: "#FF4500", borderRadius: 4 }} />
            <div style={{ width: 8, height: 36, background: "#FF4500", borderRadius: 4 }} />
            <div style={{ width: 8, height: 48, background: "#FF4500", borderRadius: 4 }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF4500", position: "absolute", top: 12, left: 32 }} />
          </div>
          <span
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: "#1A1A1B",
              letterSpacing: "-0.03em",
            }}
          >
            Vibecheck
          </span>
        </div>

        <h1
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "#1A1A1B",
            letterSpacing: "-0.04em",
            margin: 0,
            lineHeight: 1.05,
            textAlign: "center",
            maxWidth: 900,
          }}
        >
          Reddit Sentiment
          <br />
          <span style={{ color: "#FF4500" }}>Intelligence</span>
        </h1>

        <p
          style={{
            fontSize: 28,
            color: "#787C7E",
            marginTop: 24,
            letterSpacing: "-0.01em",
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.5,
          }}
        >
          Analyze any subreddit&apos;s mood with real-time NLP scoring across the top hot posts.
        </p>

        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 48,
          }}
        >
          {[
            { label: "Positive", color: "#46D160", bg: "#F6F7F8", border: "#E2E5E9" },
            { label: "Neutral",  color: "#FFB000", bg: "#F6F7F8", border: "#E2E5E9" },
            { label: "Negative", color: "#EA0027", bg: "#F6F7F8", border: "#E2E5E9" },
          ].map((chip) => (
            <div
              key={chip.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: chip.bg,
                border: `1px solid ${chip.border}`,
                borderRadius: 32,
                padding: "12px 24px",
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: chip.color,
                }}
              />
              <span style={{ color: "#1A1A1B", fontSize: 22, fontWeight: 600 }}>
                {chip.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
