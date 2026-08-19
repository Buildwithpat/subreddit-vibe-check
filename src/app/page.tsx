"use client";

import React, { useState } from "react";
import { useSubredditVibe } from "@/hooks";
import { Navbar, Footer } from "@/components/layout";
import { SearchBar, EmptyState, KpiCards, InsightsSection, DashboardSkeleton } from "@/components/dashboard";
import { SentimentCharts } from "@/components/charts";
import type { VibeErrorCode } from "@/hooks/use-subreddit-vibe";

const WRAP: React.CSSProperties = {
  maxWidth: "1280px",
  width: "100%",
  margin: "0 auto",
  paddingLeft: "clamp(16px,3vw,40px)",
  paddingRight: "clamp(16px,3vw,40px)",
};

/* ─── Error banner ───────────────────────────────────────────────────────── */
function ErrorBanner({
  error,
  errorCode,
  subreddit,
  onRetry,
}: {
  error: string;
  errorCode: VibeErrorCode | null;
  subreddit: string;
  onRetry: () => void;
}) {
  const isNotFound = errorCode === "SUBREDDIT_NOT_FOUND";
  const isPrivate  = errorCode === "SUBREDDIT_PRIVATE" || errorCode === "SUBREDDIT_BANNED";
  const isRateLimit = errorCode === "RATE_LIMITED";
  const isTimeout  = errorCode === "TIMEOUT" || errorCode === "NETWORK_ERROR";

  const icon = isNotFound ? "🔍"
    : isPrivate  ? "🔒"
    : isRateLimit ? "⏱"
    : isTimeout  ? "📡"
    : "⚠️";

  const title = isNotFound ? `r/${subreddit} not found`
    : isPrivate  ? `r/${subreddit} is private`
    : isRateLimit ? "Rate limited by Reddit"
    : isTimeout  ? "Connection issue"
    : "Analysis failed";

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        display: "flex", alignItems: "flex-start", justifyContent: "space-between",
        gap: "12px", marginBottom: "14px", padding: "14px 18px",
        background: "var(--surface)",
        border: "1px solid var(--negative)",
        borderRadius: "8px",
      }}
    >
      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
        <span style={{ fontSize: "18px", lineHeight: 1, marginTop: "1px", flexShrink: 0 }} aria-hidden="true">
          {icon}
        </span>
        <div>
          <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--tx-1)", marginBottom: "3px" }}>
            {title}
          </p>
          <p style={{ fontSize: "13px", color: "var(--tx-2)", lineHeight: "1.5" }}>
            {error}
          </p>
          {isNotFound && (
            <p style={{ fontSize: "12px", color: "var(--tx-3)", marginTop: "4px" }}>
              Make sure you typed the subreddit name correctly. Subreddit names are case-insensitive.
            </p>
          )}
          {isRateLimit && (
            <p style={{ fontSize: "12px", color: "var(--tx-3)", marginTop: "4px" }}>
              Reddit enforces rate limits on public API access. Wait 30–60 seconds before retrying.
            </p>
          )}
        </div>
      </div>
      {!isPrivate && !isNotFound && (
        <button
          onClick={onRetry}
          className="btn-ghost-danger"
          aria-label="Retry analysis"
          style={{ flexShrink: 0, marginTop: "2px" }}
        >
          Retry
        </button>
      )}
    </div>
  );
}

/* ─── Results header ─────────────────────────────────────────────────────── */
function ResultsHeader({
  subreddit,
  overallVibe,
  totalPosts,
}: {
  subreddit: string;
  overallVibe: "Positive" | "Neutral" | "Negative";
  totalPosts: number;
}) {
  const vibeColor =
    overallVibe === "Positive" ? "var(--positive)" :
    overallVibe === "Negative" ? "var(--negative)" : "var(--neutral)";
  
  return (
    <div
      className="card-enter"
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        paddingBottom: "14px",
        borderBottom: "1px solid var(--border-g)",
        marginBottom: "20px",
        "--stagger": "0ms",
      } as React.CSSProperties}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.01em", color: "var(--tx-1)", margin: 0 }}>
          r/{subreddit}
        </h1>
        <span
          aria-label={`Overall vibe: ${overallVibe}`}
          style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            fontSize: "12px", fontWeight: 600,
            color: vibeColor, background: "var(--surface)", border: `1px solid var(--border-g)`,
            padding: "4px 10px", borderRadius: "16px",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: "6px", height: "6px", borderRadius: "50%", flexShrink: 0,
              background: vibeColor,
            }}
          />
          {overallVibe}
        </span>
      </div>
      <span style={{ fontSize: "13px", color: "var(--tx-3)", whiteSpace: "nowrap", fontWeight: 500 }}>
        {totalPosts} posts · Top hot feed
      </span>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function Home() {
  const {
    subredditInput, setSubredditInput,
    isLoading, error, errorCode, analytics, currentSubreddit, analyzeSubreddit,
  } = useSubredditVibe("");

  const [hasInitiated, setHasInitiated] = useState(false);

  const handleSearch = async () => { setHasInitiated(true); await analyzeSubreddit(); };
  const handleSelect = async (sub: string) => {
    setSubredditInput(sub);
    setHasInitiated(true);
    await analyzeSubreddit(sub);
  };

  const showEmpty   = !isLoading && !analytics && !error && !hasInitiated;
  const showResults = !isLoading && !!analytics && !!currentSubreddit;

  return (
    <div style={{ position: "relative", minHeight: "100dvh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <Navbar />

      {/* Search strip */}
      <div
        role="search"
        aria-label="Subreddit search"
        style={{
          borderBottom: "1px solid var(--border-g)",
          background: "var(--bg)",
          padding: "20px 0",
        }}
      >
        <div style={WRAP}>
          {!hasInitiated && (
            <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--tx-1)", marginBottom: "12px" }}>
              Community Sentiment Intelligence
            </p>
          )}
          <SearchBar
            value={subredditInput}
            onChange={setSubredditInput}
            onSubmit={handleSearch}
            onSelectSuggestion={handleSelect}
            isLoading={isLoading}
            currentSubreddit={currentSubreddit}
          />
        </div>
      </div>

      {/* Main content */}
      <main id="main-content" style={{ flex: 1, background: "var(--surface)" }} aria-label="Analysis results">
        <div style={{ ...WRAP, paddingTop: "24px", paddingBottom: "48px" }}>

          <div aria-live="polite" aria-atomic="true" className="sr-only" style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}>
            {isLoading && `Analyzing r/${subredditInput}…`}
            {showResults && `Analysis complete for r/${currentSubreddit}. Overall vibe: ${analytics?.overallVibe}.`}
          </div>

          {error && !isLoading && (
            <ErrorBanner
              error={error}
              errorCode={errorCode}
              subreddit={subredditInput}
              onRetry={handleSearch}
            />
          )}

          {isLoading && <DashboardSkeleton />}

          {showResults && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <ResultsHeader
                subreddit={currentSubreddit!}
                overallVibe={analytics!.overallVibe}
                totalPosts={analytics!.totalPosts}
              />
              <KpiCards    analytics={analytics!} subreddit={currentSubreddit!} />
              <SentimentCharts analytics={analytics!} subreddit={currentSubreddit!} />
              <InsightsSection analytics={analytics!} subreddit={currentSubreddit!} />
            </div>
          )}

          {showEmpty && <EmptyState onSelectSubreddit={handleSelect} isLoading={isLoading} hasInitiated={hasInitiated} />}

        </div>
      </main>

      <Footer />
    </div>
  );
}
