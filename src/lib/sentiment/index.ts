import Sentiment from "sentiment";
import type {
  AnalyzedPost,
  OverallVibe,
  RedditPost,
  SentimentAnalysisResult,
  SentimentClassification,
  SubredditAnalytics,
  SubredditVibeResult,
} from "@/types";

const sentimentAnalyzer = new Sentiment();

/**
 * Classifies numeric sentiment score into positive / neutral / negative
 * Rule:
 *  score > 0  => positive
 *  score < 0  => negative
 *  score === 0 => neutral
 */
export function classifySentimentScore(score: number): SentimentClassification {
  if (score > 0) return "positive";
  if (score < 0) return "negative";
  return "neutral";
}

/**
 * Calculates overall vibe category based on average sentiment score
 * Rule:
 *  averageScore > 0  => Positive
 *  averageScore < 0  => Negative
 *  averageScore === 0 => Neutral
 */
export function calculateOverallVibe(averageScore: number): OverallVibe {
  if (averageScore > 0) return "Positive";
  if (averageScore < 0) return "Negative";
  return "Neutral";
}

/**
 * Analyzes sentiment of a single post title
 */
export function analyzeTitleSentiment(title: string): SentimentAnalysisResult {
  const result = sentimentAnalyzer.analyze(title || "");
  const classification = classifySentimentScore(result.score);

  return {
    score: result.score,
    comparative: result.comparative,
    calculation: result.calculation as unknown as Array<{ [word: string]: number }>,
    tokens: result.tokens,
    words: result.words,
    positive: result.positive,
    negative: result.negative,
    classification,
  };
}

/**
 * Maps Reddit posts to AnalyzedPost entities with sentiment calculations
 */
export function analyzePosts(posts: RedditPost[]): AnalyzedPost[] {
  return posts.map((post) => {
    const analysis = analyzeTitleSentiment(post.title);
    return {
      ...post,
      sentimentScore: analysis.score,
      comparativeScore: analysis.comparative,
      classification: analysis.classification,
      positiveWords: analysis.positive,
      negativeWords: analysis.negative,
    };
  });
}

/**
 * Generates dashboard-ready analytics across all analyzed posts
 */
export function generateSubredditAnalytics(
  analyzedPosts: AnalyzedPost[]
): SubredditAnalytics {
  const totalPosts = analyzedPosts.length;

  if (totalPosts === 0) {
    return {
      positiveCount: 0,
      neutralCount: 0,
      negativeCount: 0,
      totalPosts: 0,
      averageSentimentScore: 0,
      overallVibe: "Neutral",
      mostPositivePost: null,
      mostNegativePost: null,
    };
  }

  let positiveCount = 0;
  let neutralCount = 0;
  let negativeCount = 0;
  let totalScore = 0;

  let mostPositivePost: AnalyzedPost | null = null;
  let mostNegativePost: AnalyzedPost | null = null;

  for (const post of analyzedPosts) {
    totalScore += post.sentimentScore;

    if (post.classification === "positive") {
      positiveCount++;
    } else if (post.classification === "negative") {
      negativeCount++;
    } else {
      neutralCount++;
    }

    if (!mostPositivePost || post.sentimentScore > mostPositivePost.sentimentScore) {
      mostPositivePost = post;
    }

    if (!mostNegativePost || post.sentimentScore < mostNegativePost.sentimentScore) {
      mostNegativePost = post;
    }
  }

  const rawAverage = totalScore / totalPosts;
  const averageSentimentScore = Number(rawAverage.toFixed(2));
  const overallVibe = calculateOverallVibe(averageSentimentScore);

  return {
    positiveCount,
    neutralCount,
    negativeCount,
    totalPosts,
    averageSentimentScore,
    overallVibe,
    mostPositivePost,
    mostNegativePost,
  };
}

/**
 * End-to-end pipeline: analyzes raw posts and creates full vibe result
 */
export function processSubredditVibe(
  subreddit: string,
  posts: RedditPost[]
): SubredditVibeResult {
  const analyzedPosts = analyzePosts(posts);
  const analytics = generateSubredditAnalytics(analyzedPosts);

  return {
    subreddit,
    analytics,
    posts: analyzedPosts,
    fetchedAt: new Date().toISOString(),
  };
}
