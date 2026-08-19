/**
 * Sentiment classification for an individual post
 */
export type SentimentClassification = "positive" | "neutral" | "negative";

/**
 * Overall sentiment category for the subreddit
 */
export type OverallVibe = "Positive" | "Neutral" | "Negative";

/**
 * Normalized Reddit Post entity extracted from Reddit API
 */
export interface RedditPost {
  id: string;
  title: string;
  score: number;
  author: string;
  numComments: number;
  permalink: string;
  createdUtc: number;
  subreddit: string;
  url?: string;
  selftext?: string;
}

/**
 * Sentiment analysis scoring result for a single text title
 */
export interface SentimentAnalysisResult {
  score: number;
  comparative: number;
  calculation: Array<{ [word: string]: number }>;
  tokens: string[];
  words: string[];
  positive: string[];
  negative: string[];
  classification: SentimentClassification;
}

/**
 * Post combined with its sentiment evaluation
 */
export interface AnalyzedPost extends RedditPost {
  sentimentScore: number;
  comparativeScore: number;
  classification: SentimentClassification;
  positiveWords: string[];
  negativeWords: string[];
}

/**
 * Aggregated analytics generated across all analyzed posts
 */
export interface SubredditAnalytics {
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  totalPosts: number;
  averageSentimentScore: number;
  overallVibe: OverallVibe;
  mostPositivePost: AnalyzedPost | null;
  mostNegativePost: AnalyzedPost | null;
}

/**
 * Complete analysis payload returned by the vibe check engine
 */
export interface SubredditVibeResult {
  subreddit: string;
  analytics: SubredditAnalytics;
  posts: AnalyzedPost[];
  fetchedAt: string;
}

/**
 * Raw Reddit API schema definitions
 */
export interface RedditRawPostData {
  id: string;
  title: string;
  author: string;
  score: number;
  num_comments: number;
  permalink: string;
  created_utc: number;
  subreddit: string;
  url?: string;
  selftext?: string;
  over_18?: boolean;
  is_video?: boolean;
  stickied?: boolean;
}

export interface RedditRawChild {
  kind: string;
  data: RedditRawPostData;
}

export interface RedditRawListingData {
  after: string | null;
  before: string | null;
  dist: number;
  children: RedditRawChild[];
}

export interface RedditListingResponse {
  kind: string;
  data: RedditRawListingData;
}

export interface RedditErrorResponse {
  message?: string;
  error?: number | string;
  reason?: string;
}
