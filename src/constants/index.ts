export const APP_CONFIG = {
  name: "Subreddit Vibe Check",
  tagline: "Analyze the sentiment of the hottest discussions on Reddit.",
  description: "Real-time sentiment and vibe check analytics for any subreddit.",
  version: "0.1.0",
} as const;

export const DEFAULT_SUBREDDITS = [
  "technology",
  "webdev",
  "reactjs",
  "nextjs",
  "programming",
  "startups",
  "artificial",
] as const;

export const VIBE_THRESHOLDS = {
  EUPHORIC: 2.0,
  POSITIVE: 0.5,
  NEUTRAL_LOW: -0.5,
  NEGATIVE_LOW: -2.0,
} as const;
