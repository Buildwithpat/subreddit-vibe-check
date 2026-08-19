"use client";

import React from "react";

interface EmptyStateProps {
  onSelectSubreddit: (sub: string) => void;
  isLoading: boolean;
  hasInitiated?: boolean;
}

export function EmptyState({ hasInitiated }: EmptyStateProps) {
  if (hasInitiated) return null;

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center", paddingTop: "40px" }}>
      <div style={{
        maxWidth: "600px",
        width: "100%",
        background: "var(--card)",
        border: "1px solid var(--border-g)",
        borderRadius: "8px",
        padding: "32px",
        textAlign: "center",
        boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
      }}>
        <div style={{
          width: "48px", height: "48px", borderRadius: "50%",
          background: "var(--surface)", border: "1px solid var(--border-g)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px auto", color: "var(--accent)"
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 18V12" />
            <path d="M12 18V8" />
            <path d="M20 18V4" />
            <circle cx="20" cy="4" r="2.5" fill="currentColor" stroke="none" />
          </svg>
        </div>
        
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--tx-1)", marginBottom: "12px", letterSpacing: "-0.01em" }}>
          Analyze any subreddit
        </h2>
        
        <p style={{ fontSize: "14px", color: "var(--tx-2)", lineHeight: "1.5", marginBottom: "24px", maxWidth: "480px", margin: "0 auto 24px auto" }}>
          Fetch the latest 50 hot posts and uncover the community&apos;s sentiment, mood, and discussion patterns.
        </p>

        <div style={{
          background: "var(--surface)",
          border: "1px solid var(--border-g)",
          borderRadius: "8px",
          padding: "16px",
          textAlign: "left",
        }}>
          <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--tx-2)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
            Sample Insights
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={{ background: "var(--card)", padding: "12px", borderRadius: "6px", border: "1px solid var(--border-g)" }}>
              <span style={{ fontSize: "11px", color: "var(--tx-3)", display: "block", marginBottom: "4px" }}>Community Mood</span>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--positive)" }}>Positive</span>
            </div>
            <div style={{ background: "var(--card)", padding: "12px", borderRadius: "6px", border: "1px solid var(--border-g)" }}>
              <span style={{ fontSize: "11px", color: "var(--tx-3)", display: "block", marginBottom: "4px" }}>Sentiment Score</span>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--tx-1)" }}>+1.42</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
