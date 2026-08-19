import React from "react";

export function DashboardSkeleton() {
  const shimmer: React.CSSProperties = {
    background: "linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.03) 75%)",
    backgroundSize: "600px 100%",
    animation: "shimmer 1.6s ease infinite",
    borderRadius: "6px",
  };

  const glass: React.CSSProperties = {
    background: "rgba(15,15,17,0.65)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "10px",
    padding: "18px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  };

  return (
    <div
      role="status"
      aria-label="Loading analysis…"
      aria-busy="true"
      style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}
    >
      {/* KPI row */}
      <div className="kpi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "10px" }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={glass}>
            <div style={{ ...shimmer, height: 10, width: "50%" }} />
            <div style={{ ...shimmer, height: 28, width: "55%" }} />
            <div style={{ ...shimmer, height: 10, width: "70%" }} />
          </div>
        ))}
      </div>

      {/* Chart row */}
      <div className="chart-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {[0,1].map(i => (
          <div key={i} style={{ ...glass, height: 290 }}>
            <div style={{ ...shimmer, height: 12, width: "40%" }} />
            <div style={{ ...shimmer, flex: 1, height: 220 }} />
          </div>
        ))}
      </div>

      {/* Insight row */}
      <div className="insight-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ ...glass, height: 164 }}>
            <div style={{ ...shimmer, height: 10, width: "30%" }} />
            <div style={{ ...shimmer, height: 13, width: "90%" }} />
            <div style={{ ...shimmer, height: 13, width: "72%" }} />
            <div style={{ ...shimmer, height: 10, width: "50%" }} />
          </div>
        ))}
      </div>

      {/* Visually-hidden text for screen readers */}
      <span style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}>
        Loading analysis results…
      </span>
    </div>
  );
}
