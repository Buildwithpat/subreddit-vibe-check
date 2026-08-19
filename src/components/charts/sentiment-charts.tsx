"use client";

import React, { useSyncExternalStore } from "react";
import type { SubredditAnalytics } from "@/types";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

interface SentimentChartsProps {
  analytics: SubredditAnalytics;
  subreddit: string;
}

const C = { positive: "#10B981", neutral: "#F59E0B", negative: "#EF4444" };

const GLASS_PANEL: React.CSSProperties = {
  background: "rgba(15, 15, 17, 0.65)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "10px",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  boxShadow: "0 2px 16px rgba(0,0,0,0.35)",
};

interface TPItem {
  name: string;
  value: number;
  payload: { name: string; value: number; pct: number };
}

function ChartTip({ active, payload }: { active?: boolean; payload?: TPItem[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div
      style={{
        background: "rgba(22,22,25,0.92)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "8px",
        padding: "10px 14px",
        fontSize: "12px",
        color: "#A1A1AA",
        lineHeight: "22px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      }}
    >
      <div style={{ color: "#FAFAFA", fontWeight: 600, marginBottom: "2px" }}>{d.name}</div>
      <div>Posts: <span style={{ color: "#FAFAFA", fontFamily: "monospace" }}>{d.value}</span></div>
      {d.payload?.pct != null && (
        <div>Share: <span style={{ color: "#FAFAFA", fontFamily: "monospace" }}>{d.payload.pct}%</span></div>
      )}
    </div>
  );
}

const emptySub = () => () => {};

export function SentimentCharts({ analytics }: SentimentChartsProps) {
  const isClient = useSyncExternalStore(emptySub, () => true, () => false);
  const total = analytics.totalPosts || 1;

  const donutData = [
    { name: "Positive", value: analytics.positiveCount, pct: Math.round((analytics.positiveCount / total) * 100), fill: C.positive },
    { name: "Neutral",  value: analytics.neutralCount,  pct: Math.round((analytics.neutralCount  / total) * 100), fill: C.neutral  },
    { name: "Negative", value: analytics.negativeCount, pct: Math.round((analytics.negativeCount / total) * 100), fill: C.negative },
  ];

  const barData = [
    { name: "Positive", value: analytics.positiveCount, fill: C.positive },
    { name: "Neutral",  value: analytics.neutralCount,  fill: C.neutral  },
    { name: "Negative", value: analytics.negativeCount, fill: C.negative },
  ];

  if (!isClient) {
    return (
      <div className="chart-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {[0, 1].map((i) => (
          <div key={i} className="skeleton" style={{ height: "300px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)" }} />
        ))}
      </div>
    );
  }

  return (
    <div
      className="chart-grid card-enter"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "10px",
        width: "100%",
        "--stagger": "240ms",
      } as React.CSSProperties}
    >
      {/* ── Donut ── */}
      <div style={GLASS_PANEL}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#FAFAFA", letterSpacing: "-0.01em" }}>
              Sentiment Distribution
            </div>
            <div style={{ fontSize: "11px", color: "#71717A", marginTop: "2px" }}>
              Share across {analytics.totalPosts} posts
            </div>
          </div>
        </div>

        <div style={{ height: "190px", position: "relative" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<ChartTip />} />
              <Pie
                data={donutData}
                cx="50%" cy="50%"
                innerRadius={58} outerRadius={82}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {donutData.map((d) => <Cell key={d.name} fill={d.fill} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center */}
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            pointerEvents: "none",
          }}>
            <span style={{
              fontSize: "20px",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              color:
                analytics.overallVibe === "Positive" ? C.positive :
                analytics.overallVibe === "Negative" ? C.negative : C.neutral,
            }}>
              {analytics.overallVibe}
            </span>
            <span style={{ fontSize: "10px", color: "#71717A", letterSpacing: "0.07em", textTransform: "uppercase", marginTop: "1px" }}>
              vibe
            </span>
          </div>
        </div>

        {/* Segmented legend */}
        <div style={{ display: "flex", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {donutData.map((d, i) => (
            <div
              key={d.name}
              style={{
                flex: 1,
                padding: "12px 0 0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "3px",
                borderRight: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: d.fill, flexShrink: 0, boxShadow: `0 0 6px ${d.fill}` }} />
                <span style={{ fontSize: "11px", color: "#A1A1AA" }}>{d.name}</span>
              </div>
              <span style={{ fontSize: "15px", fontWeight: 700, color: "#FAFAFA", fontVariantNumeric: "tabular-nums" }}>
                {d.value}
              </span>
              <span style={{ fontSize: "10px", color: "#71717A" }}>{d.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bar chart ── */}
      <div style={GLASS_PANEL}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#FAFAFA", letterSpacing: "-0.01em" }}>
              Sentiment Breakdown
            </div>
            <div style={{ fontSize: "11px", color: "#71717A", marginTop: "2px" }}>
              Raw post count per tier
            </div>
          </div>
          <span style={{ fontSize: "11px", color: "#71717A", fontFamily: "monospace" }}>n={analytics.totalPosts}</span>
        </div>

        <div style={{ flex: 1, height: "206px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 4, right: 0, left: -22, bottom: 0 }} barCategoryGap="32%">
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="0" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: "#71717A", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: "#71717A", fontSize: 11, fontFamily: "monospace" }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(255,255,255,0.025)" }} />
              <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                {barData.map((d) => <Cell key={d.name} fill={d.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          paddingTop: "12px",
          display: "flex",
          justifyContent: "space-between",
          fontSize: "11px",
        }}>
          <span style={{ color: "#71717A" }}>Dominant tier</span>
          <span style={{ color: "#FAFAFA", fontWeight: 600 }}>
            {analytics.positiveCount >= analytics.negativeCount && analytics.positiveCount >= analytics.neutralCount
              ? "Positive" : analytics.negativeCount >= analytics.neutralCount ? "Negative" : "Neutral"}
          </span>
        </div>
      </div>
    </div>
  );
}
