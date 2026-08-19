"use client";

import { useCallback, useRef, useState } from "react";
import type {
  AnalyzedPost,
  SubredditAnalytics,
  SubredditVibeResult,
} from "@/types";
import { validateSubredditName } from "@/lib/reddit";

/** Typed error codes surfaced to the UI for special-cased rendering */
export type VibeErrorCode =
  | "INVALID_SUBREDDIT_NAME"
  | "SUBREDDIT_NOT_FOUND"
  | "SUBREDDIT_PRIVATE"
  | "SUBREDDIT_BANNED"
  | "RATE_LIMITED"
  | "EMPTY_SUBREDDIT"
  | "NETWORK_ERROR"
  | "TIMEOUT"
  | "UNEXPECTED_RESPONSE"
  | "UNKNOWN";

export interface UseSubredditVibeReturn {
  subredditInput: string;
  setSubredditInput: (value: string) => void;
  isLoading: boolean;
  error: string | null;
  errorCode: VibeErrorCode | null;
  analytics: SubredditAnalytics | null;
  posts: AnalyzedPost[];
  currentSubreddit: string | null;
  analyzeSubreddit: (customSubreddit?: string) => Promise<void>;
  reset: () => void;
}

/** Fetch with a hard 15 s timeout via AbortController */
async function fetchWithTimeout(
  url: string,
  timeoutMs = 15_000
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export function useSubredditVibe(initialSubreddit: string = ""): UseSubredditVibeReturn {
  const [subredditInput, setSubredditInput] = useState<string>(initialSubreddit);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<VibeErrorCode | null>(null);
  const [analytics, setAnalytics] = useState<SubredditAnalytics | null>(null);
  const [posts, setPosts] = useState<AnalyzedPost[]>([]);
  const [currentSubreddit, setCurrentSubreddit] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    setError(null);
    setErrorCode(null);
    setAnalytics(null);
    setPosts([]);
    setCurrentSubreddit(null);
  }, []);

  const analyzeSubreddit = useCallback(
    async (customSubreddit?: string) => {
      const rawTarget = customSubreddit ?? subredditInput;

      // Abort any in-flight request
      abortRef.current?.abort();

      let validatedName: string;
      try {
        validatedName = validateSubredditName(rawTarget);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Invalid subreddit name provided.";
        setError(message);
        setErrorCode("INVALID_SUBREDDIT_NAME");
        setAnalytics(null);
        setPosts([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      setErrorCode(null);

      try {
        const response = await fetchWithTimeout(
          `/api/reddit?subreddit=${encodeURIComponent(validatedName)}&limit=50`
        );

        const data: {
          success: boolean;
          data?: SubredditVibeResult;
          error?: string;
          code?: string;
        } = await response.json();

        if (!response.ok || !data.success || !data.data) {
          const code = (data.code as VibeErrorCode) ?? "UNKNOWN";
          const msg = humanizeError(code, validatedName, data.error);
          setError(msg);
          setErrorCode(code);
          setAnalytics(null);
          setPosts([]);
          return;
        }

        setAnalytics(data.data.analytics);
        setPosts(data.data.posts);
        setCurrentSubreddit(data.data.subreddit);
        setSubredditInput(data.data.subreddit);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          setError("The request timed out. Reddit may be slow — please try again.");
          setErrorCode("TIMEOUT");
        } else {
          setError("Could not connect. Check your internet and try again.");
          setErrorCode("NETWORK_ERROR");
        }
        setAnalytics(null);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    },
    [subredditInput]
  );

  return {
    subredditInput,
    setSubredditInput,
    isLoading,
    error,
    errorCode,
    analytics,
    posts,
    currentSubreddit,
    analyzeSubreddit,
    reset,
  };
}

/** Maps error codes to user-friendly messages */
function humanizeError(code: string, subreddit: string, fallback?: string): string {
  switch (code) {
    case "SUBREDDIT_NOT_FOUND":
      return `r/${subreddit} doesn't exist. Check the spelling and try again.`;
    case "SUBREDDIT_PRIVATE":
      return `r/${subreddit} is private — only approved members can view it.`;
    case "SUBREDDIT_BANNED":
      return `r/${subreddit} has been banned by Reddit administrators.`;
    case "RATE_LIMITED":
      return "Reddit is rate limiting us right now. Wait a moment and retry.";
    case "EMPTY_SUBREDDIT":
      return `r/${subreddit} exists but has no public posts to analyze.`;
    case "NETWORK_ERROR":
      return "Could not reach Reddit. Check your connection and try again.";
    case "INVALID_SUBREDDIT_NAME":
      return fallback ?? `"${subreddit}" is not a valid subreddit name.`;
    default:
      return fallback ?? "Something went wrong. Please try again.";
  }
}
