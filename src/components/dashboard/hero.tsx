import React from "react";

export function Hero() {
  return (
    <div className="flex flex-col items-center text-center" style={{ paddingTop: "64px", paddingBottom: "48px", gap: "16px" }}>
      <h1
        className="font-bold text-balance"
        style={{
          fontSize: "clamp(36px, 5.5vw, 56px)",
          lineHeight: "1.08",
          letterSpacing: "-0.03em",
          color: "#FAFAFA",
          maxWidth: "700px",
        }}
      >
        Subreddit Vibe Check
      </h1>
      <p
        style={{
          fontSize: "17px",
          lineHeight: "26px",
          letterSpacing: "-0.01em",
          color: "#A1A1AA",
          maxWidth: "520px",
        }}
      >
        Measure the sentiment behind Reddit&apos;s most active conversations.
      </p>
    </div>
  );
}
