import type {
  RedditListingResponse,
  RedditPost,
  RedditRawChild,
} from "@/types";

export interface FetchSubredditOptions {
  limit?: number;
  timeframe?: "hour" | "day" | "week" | "month" | "year" | "all";
  retries?: number;
}

export type RedditErrorCode =
  | "INVALID_SUBREDDIT_NAME"
  | "SUBREDDIT_NOT_FOUND"
  | "SUBREDDIT_PRIVATE"
  | "SUBREDDIT_BANNED"
  | "RATE_LIMITED"
  | "EMPTY_SUBREDDIT"
  | "NETWORK_ERROR"
  | "UNEXPECTED_RESPONSE";

export class RedditApiError extends Error {
  public readonly code: RedditErrorCode;
  public readonly statusCode?: number;

  constructor(message: string, code: RedditErrorCode, statusCode?: number) {
    super(message);
    this.name = "RedditApiError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

/**
 * Validates subreddit name format
 */
export function validateSubredditName(subreddit: string): string {
  const cleanName = subreddit.trim().replace(/^r\//i, "").replace(/^\//, "");

  if (!cleanName) {
    throw new RedditApiError(
      "Please enter a subreddit name.",
      "INVALID_SUBREDDIT_NAME"
    );
  }

  const subredditRegex = /^[A-Za-z0-9_]{2,21}$/;
  if (!subredditRegex.test(cleanName)) {
    throw new RedditApiError(
      `Invalid subreddit name "r/${cleanName}". Subreddit names must be 2-21 alphanumeric characters or underscores.`,
      "INVALID_SUBREDDIT_NAME"
    );
  }

  return cleanName;
}

/**
 * Unescapes HTML entities in text
 */
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

/**
 * Parses and normalizes raw Reddit post JSON child
 */
function normalizeRedditChild(child: RedditRawChild): RedditPost | null {
  if (!child || !child.data) return null;
  const data = child.data;

  if (!data.id || !data.title) return null;

  return {
    id: data.id,
    title: decodeHtmlEntities(data.title),
    author: data.author ? data.author.replace(/^\/u\//, "") : "[deleted]",
    score: typeof data.score === "number" ? data.score : 0,
    numComments: typeof data.num_comments === "number" ? data.num_comments : 0,
    permalink: data.permalink ? `https://reddit.com${data.permalink}` : "",
    createdUtc: typeof data.created_utc === "number" ? data.created_utc : Math.floor(Date.now() / 1000),
    subreddit: data.subreddit || "",
    url: data.url,
    selftext: data.selftext,
  };
}

/**
 * Parses Reddit's public Atom / RSS XML feed into normalized RedditPost items
 */
function parseRedditRssFeed(xmlText: string, subreddit: string): RedditPost[] {
  const entries = xmlText.split("<entry>").slice(1);
  const posts: RedditPost[] = [];

  for (const entry of entries) {
    const titleMatch = entry.match(/<title>([\s\S]*?)<\/title>/);
    const idMatch = entry.match(/<id>([\s\S]*?)<\/id>/);
    const authorMatch = entry.match(/<author>[\s\S]*?<name>([\s\S]*?)<\/name>[\s\S]*?<\/author>/);
    const linkMatch = entry.match(/<link href="([\s\S]*?)"/);
    const updatedMatch = entry.match(/<updated>([\s\S]*?)<\/updated>/);

    if (titleMatch) {
      const rawTitle = decodeHtmlEntities(titleMatch[1].trim());
      const rawId = idMatch
        ? idMatch[1].replace(/.*\/comments\/([^/]+).*/, "$1")
        : `post_${Math.random().toString(36).substring(2, 9)}`;

      posts.push({
        id: rawId,
        title: rawTitle,
        author: authorMatch ? decodeHtmlEntities(authorMatch[1].replace(/^\/u\//, "")) : "[deleted]",
        score: 0,
        numComments: 0,
        permalink: linkMatch ? linkMatch[1] : "",
        createdUtc: updatedMatch
          ? Math.floor(new Date(updatedMatch[1]).getTime() / 1000)
          : Math.floor(Date.now() / 1000),
        subreddit,
      });
    }
  }

  return posts;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetches hot posts from Reddit's public API endpoint with dual-strategy fallback and rate-limit backoff
 */
export async function fetchSubredditHotPosts(
  subredditInput: string,
  options: FetchSubredditOptions = {}
): Promise<RedditPost[]> {
  const cleanSubreddit = validateSubredditName(subredditInput);
  const limit = options.limit ?? 50;
  const maxRetries = options.retries ?? 2;

  const jsonEndpoint = `https://www.reddit.com/r/${encodeURIComponent(
    cleanSubreddit
  )}/hot.json?limit=${limit}`;

  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 (subreddit-vibe-check/1.0)",
    Accept: "application/json, text/xml, application/xml, */*",
  };

  // Attempt 1: Standard JSON API
  try {
    const jsonResponse = await fetch(jsonEndpoint, {
      headers,
      next: { revalidate: 60 },
    });

    if (jsonResponse.status === 404) {
      throw new RedditApiError(
        `Subreddit "r/${cleanSubreddit}" was not found or does not exist.`,
        "SUBREDDIT_NOT_FOUND",
        404
      );
    }

    if (jsonResponse.status === 403) {
      // 403 on JSON may mean Cloudflare bot protection, so fallback to RSS
    } else if (jsonResponse.ok) {
      const payload = (await jsonResponse.json()) as RedditListingResponse;
      if (payload && payload.data && Array.isArray(payload.data.children)) {
        const normalizedPosts: RedditPost[] = [];
        for (const child of payload.data.children) {
          const post = normalizeRedditChild(child);
          if (post) normalizedPosts.push(post);
        }
        if (normalizedPosts.length > 0) {
          return normalizedPosts.slice(0, limit);
        }
      }
    }
  } catch (err: unknown) {
    if (err instanceof RedditApiError) throw err;
  }

  // Attempt 2: Public Atom/RSS feed endpoint with automatic retry on 429
  const rssEndpoint = `https://www.reddit.com/r/${encodeURIComponent(
    cleanSubreddit
  )}/hot.rss?limit=${limit}`;

  let attempts = 0;
  while (attempts <= maxRetries) {
    attempts++;
    try {
      const rssResponse = await fetch(rssEndpoint, {
        headers,
        next: { revalidate: 60 },
      });

      if (rssResponse.status === 404) {
        throw new RedditApiError(
          `Subreddit "r/${cleanSubreddit}" was not found or does not exist.`,
          "SUBREDDIT_NOT_FOUND",
          404
        );
      }

      if (rssResponse.status === 403) {
        throw new RedditApiError(
          `Subreddit "r/${cleanSubreddit}" is private or restricted.`,
          "SUBREDDIT_PRIVATE",
          403
        );
      }

      if (rssResponse.status === 429) {
        if (attempts <= maxRetries) {
          await delay(2000 * attempts);
          continue;
        }
        throw new RedditApiError(
          "Reddit rate limit reached. Please wait a moment and try again.",
          "RATE_LIMITED",
          429
        );
      }

      if (!rssResponse.ok) {
        throw new RedditApiError(
          `Reddit API responded with status ${rssResponse.status}.`,
          "UNEXPECTED_RESPONSE",
          rssResponse.status
        );
      }

      const xmlText = await rssResponse.text();
      const rssPosts = parseRedditRssFeed(xmlText, cleanSubreddit);

      if (rssPosts.length === 0) {
        throw new RedditApiError(
          `No posts found in "r/${cleanSubreddit}".`,
          "EMPTY_SUBREDDIT"
        );
      }

      return rssPosts.slice(0, limit);
    } catch (err: unknown) {
      if (err instanceof RedditApiError) throw err;
      if (attempts > maxRetries) {
        const errorMsg = err instanceof Error ? err.message : "Network error";
        throw new RedditApiError(
          `Failed to connect to Reddit: ${errorMsg}`,
          "NETWORK_ERROR"
        );
      }
      await delay(1500 * attempts);
    }
  }

  throw new RedditApiError(
    `Failed to fetch posts for "r/${cleanSubreddit}".`,
    "UNEXPECTED_RESPONSE"
  );
}
