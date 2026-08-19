import React from "react";

export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid #27272A",
        marginTop: "auto",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "16px clamp(16px, 3vw, 40px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: "12px", color: "#71717A" }}>
          © {new Date().getFullYear()} Vibecheck
        </span>
        <span style={{ fontSize: "12px", color: "#71717A" }}>
          AFINN NLP · Top 50 Hot · Public Reddit API
        </span>
      </div>
    </footer>
  );
}
