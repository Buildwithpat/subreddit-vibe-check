"use client";

import React from "react";
import type { SubredditAnalytics } from "@/types";

interface InsightsSectionProps {
  analytics: SubredditAnalytics;
  subreddit: string;
}

function PostCard({
  label, accent, score, title, author, numComments, permalink,
}: {
  label: string; accent: string; score: number;
  title: string; author: string; numComments: number; permalink?: string;
}) {
  return (
    /* .post-card handles CSS hover lift — no JS handlers */
    <div className="post-card">
      {/* Glowing accent stripe */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0,
        width: "3px",
        background: `linear-gradient(to bottom, ${accent}, ${accent}66)`,
        boxShadow: `2px 0 10px ${accent}55`,
      }} />

      <div style={{ paddingLeft: "10px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span className="label">{label}</span>
          <span style={{
            fontSize: "12px", fontWeight: 700, color: accent,
            fontFamily: "var(--font-geist-mono, monospace)",
            background: `${accent}15`, padding: "2px 7px",
            borderRadius: "4px", border: `1px solid ${accent}30`,
          }}>
            {score > 0 ? `+${score}` : score}
          </span>
        </div>

        <p style={{
          fontSize: "13px", fontWeight: 500, color: "#FAFAFA",
          lineHeight: "1.5", letterSpacing: "-0.01em", margin: 0,
          display: "-webkit-box",
          WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {title}
        </p>

        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          paddingTop: "8px", borderTop: "1px solid rgba(255,255,255,0.05)",
          fontSize: "11px", color: "#71717A", gap: "8px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span>u/{author}</span>
            {numComments > 0 && (
              <><span style={{ opacity: 0.4 }}>·</span><span>{numComments.toLocaleString()} comments</span></>
            )}
          </div>
          {/* .link-accent handles CSS hover color change */}
          {permalink && (
            <a href={permalink} target="_blank" rel="noreferrer" className="link-accent">
              View →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function InsightsSection({ analytics, subreddit }: InsightsSectionProps) {
  const { mostPositivePost, mostNegativePost } = analytics;
  const net = analytics.positiveCount - analytics.negativeCount;

  const signals = [
    { key: "Net Sentiment",     val: net > 0 ? `+${net} positive` : net < 0 ? `${net} negative` : "Balanced" },
    { key: "Polarity Index",    val: analytics.positiveCount + analytics.negativeCount > 25 ? "High" : "Moderate" },
    { key: "Community Verdict", val: analytics.overallVibe === "Positive" ? "Constructive" : analytics.overallVibe === "Negative" ? "Critical" : "Inquiring" },
    { key: "Sample Size",       val: `${analytics.totalPosts} posts` },
    { key: "Positive Posts",    val: String(analytics.positiveCount) },
    { key: "Negative Posts",    val: String(analytics.negativeCount) },
    { key: "Neutral Posts",     val: String(analytics.neutralCount) },
    { key: "Peak Score",        val: mostPositivePost ? `+${mostPositivePost.sentimentScore}` : "—" },
  ];

  const emptyCard: React.CSSProperties = {
    background: "rgba(15,15,17,0.65)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "10px",
    display: "flex", alignItems: "center", justifyContent: "center",
    minHeight: "140px",
  };

  return (
    <div
      className="card-enter"
      style={{ width: "100%", display: "flex", flexDirection: "column", gap: "12px", "--stagger": "380ms" } as React.CSSProperties}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span className="label">Discussion Anchors</span>
        <span style={{ fontSize: "11px", color: "#52525B" }}>· r/{subreddit}</span>
      </div>

      <div className="insight-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>

        {mostPositivePost ? (
          <PostCard label="Most Positive" accent="#10B981" score={mostPositivePost.sentimentScore}
            title={mostPositivePost.title} author={mostPositivePost.author}
            numComments={mostPositivePost.numComments} permalink={mostPositivePost.permalink} />
        ) : (
          <div style={emptyCard}><span style={{ fontSize: "12px", color: "#71717A" }}>No positive post found</span></div>
        )}

        {mostNegativePost ? (
          <PostCard label="Most Critical" accent="#EF4444" score={mostNegativePost.sentimentScore}
            title={mostNegativePost.title} author={mostNegativePost.author}
            numComments={mostNegativePost.numComments} permalink={mostNegativePost.permalink} />
        ) : (
          <div style={emptyCard}><span style={{ fontSize: "12px", color: "#71717A" }}>No negative post found</span></div>
        )}

        {/* Key signals — .panel-hover for CSS lift */}
        <div className="panel-hover" style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <span className="label">Key Signals</span>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {signals.map(({ key, val }, i) => (
              <div key={key} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "6px 0",
                borderBottom: i < signals.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                fontSize: "12px",
              }}>
                <span style={{ color: "#71717A" }}>{key}</span>
                <span style={{ color: "#FAFAFA", fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
