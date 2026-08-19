"use client";

import React, { useRef, useState } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onSelectSuggestion: (sub: string) => void;
  isLoading: boolean;
  currentSubreddit?: string | null;
}

const CHIPS = [
  { label: "reactjs",     value: "reactjs"     },
  { label: "javascript",  value: "javascript"  },
  { label: "webdev",      value: "webdev"      },
  { label: "nextjs",      value: "nextjs"      },
  { label: "programming", value: "programming" },
];

export function SearchBar({
  value, onChange, onSubmit, onSelectSuggestion, isLoading, currentSubreddit,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const canSubmit = !!value.trim() && !isLoading;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit();
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          alignItems: "stretch",
          width: "100%",
          background: "var(--card)",
          border: `1px solid ${focused ? "var(--accent)" : "var(--border-g)"}`,
          borderRadius: "999px",
          overflow: "hidden",
          transition: "border-color 150ms ease, box-shadow 150ms ease",
          boxShadow: focused
            ? "0 0 0 1px var(--accent)"
            : "none",
        }}
      >
        <span
          style={{
            display: "flex", alignItems: "center",
            paddingLeft: "20px", paddingRight: "4px",
            fontSize: "15px", fontWeight: 500,
            color: "var(--tx-2)",
            flexShrink: 0, userSelect: "none",
          }}
        >
          r/
        </span>

        <input
          ref={inputRef}
          type="text"
          id="subreddit-input"
          name="subreddit"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => { if (e.key === "Escape") { onChange(""); inputRef.current?.blur(); } }}
          placeholder="Enter a subreddit (e.g. reactjs)"
          disabled={isLoading}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="Subreddit name"
          style={{
            flex: 1, height: "48px",
            background: "transparent", border: "none", outline: "none",
            fontSize: "15px", fontWeight: 400,
            color: "var(--tx-1)", padding: "0 12px 0 6px", minWidth: 0,
          }}
        />

        <button
          type="submit"
          disabled={!canSubmit}
          className="btn-analyze"
          style={{
            background: canSubmit ? "var(--accent)" : "var(--surface)",
            color: canSubmit ? "#FFFFFF" : "var(--tx-3)",
            opacity: !value.trim() && !isLoading ? 0.5 : 1,
            borderRadius: "0 999px 999px 0",
            borderLeft: "none",
          }}
        >
          {isLoading ? (
            <>
              <svg className="spin" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.5"/>
                <path d="M7 1.5A5.5 5.5 0 0112.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </>
          ) : (
            <span style={{ padding: "0 8px" }}>Analyze</span>
          )}
        </button>
      </form>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center", paddingLeft: "8px" }} role="group" aria-label="Popular subreddits">
        <span style={{ fontSize: "12px", color: "var(--tx-3)", marginRight: "4px", userSelect: "none" }} aria-hidden="true">Popular:</span>
        {CHIPS.map((chip) => (
          <button
            key={chip.value}
            type="button"
            onClick={() => onSelectSuggestion(chip.value)}
            disabled={isLoading}
            className={`chip-btn${currentSubreddit === chip.value ? " active" : ""}`}
            aria-label={`Analyze r/${chip.value}`}
            aria-pressed={currentSubreddit === chip.value}
          >
            r/{chip.label}
          </button>
        ))}
      </div>
    </div>
  );
}
