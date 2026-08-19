"use client";

import React from "react";
import type { SubredditAnalytics } from "@/types";

interface KpiCardsProps {
  analytics: SubredditAnalytics;
  subreddit: string;
}

const VIBE = {
  Positive: { color: "#10B981", glow: "rgba(16,185,129,0.18)",  border: "rgba(16,185,129,0.22)",  badge: "Bullish",  badgeBg: "rgba(16,185,129,0.1)"  },
  Negative: { color: "#EF4444", glow: "rgba(239,68,68,0.18)",   border: "rgba(239,68,68,0.22)",   badge: "Critical", badgeBg: "rgba(239,68,68,0.1)"   },
  Neutral:  { color: "#F59E0B", glow: "rgba(245,158,11,0.18)",  border: "rgba(245,158,11,0.22)",  badge: "Balanced", badgeBg: "rgba(245,158,11,0.1)"  },
};

function KpiCard({
  label, value, sub, stagger,
  accentColor, glowColor, borderColor, badge, badgeBg,
}: {
  label: string; value: string; sub: string; stagger: number;
  accentColor?: string; glowColor?: string; borderColor?: string;
  badge?: string; badgeBg?: string;
}) {
  return (
    /* .kpi-card handles CSS hover lift — no JS handlers */
    <div
      className="kpi-card card-enter"
      style={{
        border: `1px solid ${borderColor ?? "rgba(255,255,255,0.07)"}`,
        boxShadow: glowColor
          ? `0 0 28px ${glowColor}, 0 2px 12px rgba(0,0,0,0.35)`
          : "0 2px 12px rgba(0,0,0,0.28)",
        "--stagger": `${stagger}ms`,
      } as React.CSSProperties}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="label">{label}</span>
        {badge && (
          <span style={{
            fontSize: "10px", fontWeight: 600,
            color: accentColor, background: badgeBg,
            border: `1px solid ${borderColor}`,
            borderRadius: "4px", padding: "2px 7px", letterSpacing: "0.05em",
          }}>
            {badge}
          </span>
        )}
      </div>

      <span className="stat" style={{ color: accentColor ?? "#FAFAFA" }}>
        {value}
      </span>

      <span style={{ fontSize: "11px", color: "#71717A", lineHeight: "15px" }}>
        {sub}
      </span>
    </div>
  );
}

export function KpiCards({ analytics }: KpiCardsProps) {
  const vibe = VIBE[analytics.overallVibe];
  const positiveRatio = analytics.totalPosts > 0
    ? Math.round((analytics.positiveCount / analytics.totalPosts) * 100) : 0;
  const avgSign = analytics.averageSentimentScore > 0 ? "+" : "";

  return (
    <div className="kpi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "10px", width: "100%" }}>
      <KpiCard label="Overall Vibe"    value={analytics.overallVibe}                           sub={analytics.overallVibe === "Positive" ? "Constructive community tone" : analytics.overallVibe === "Negative" ? "Critical community tone" : "Balanced community tone"} stagger={0}   accentColor={vibe.color} glowColor={vibe.glow} borderColor={vibe.border} badge={vibe.badge} badgeBg={vibe.badgeBg} />
      <KpiCard label="Avg Sentiment"   value={`${avgSign}${analytics.averageSentimentScore}`} sub="AFINN lexical score per post"                     stagger={60}  />
      <KpiCard label="Posts Analyzed"  value={String(analytics.totalPosts)}                   sub="Top hot posts sampled"                            stagger={120} />
      <KpiCard label="Positive Ratio"  value={`${positiveRatio}%`}                            sub={`${analytics.positiveCount} of ${analytics.totalPosts} posts`} stagger={180} accentColor="#10B981" />
    </div>
  );
}
