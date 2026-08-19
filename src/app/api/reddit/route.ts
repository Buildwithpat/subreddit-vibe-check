import { NextRequest, NextResponse } from "next/server";
import { fetchSubredditHotPosts, RedditApiError } from "@/lib/reddit";
import { processSubredditVibe } from "@/lib/sentiment";

const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT = 10;
const TIME_WINDOW = 60 * 1000; // 1 minute

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const now = Date.now();
  
  if (ip !== "unknown") {
    const rateLimitInfo = rateLimitMap.get(ip);
    if (rateLimitInfo) {
      if (now - rateLimitInfo.timestamp < TIME_WINDOW) {
        if (rateLimitInfo.count >= RATE_LIMIT) {
          return NextResponse.json(
            { success: false, error: "Too many requests", code: "RATE_LIMIT_EXCEEDED" },
            { status: 429, headers: { "Retry-After": "60" } }
          );
        }
        rateLimitInfo.count += 1;
      } else {
        rateLimitMap.set(ip, { count: 1, timestamp: now });
      }
    } else {
      rateLimitMap.set(ip, { count: 1, timestamp: now });
    }
  }

  const { searchParams } = new URL(request.url);
  const subreddit = searchParams.get("subreddit");
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : 50;

  if (!subreddit) {
    return NextResponse.json(
      {
        success: false,
        error: "Subreddit query parameter is required.",
        code: "MISSING_SUBREDDIT_PARAMETER",
      },
      { status: 400 }
    );
  }

  try {
    const posts = await fetchSubredditHotPosts(subreddit, { limit });
    const result = processSubredditVibe(subreddit, posts);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err: unknown) {
    if (err instanceof RedditApiError) {
      return NextResponse.json(
        {
          success: false,
          error: err.message,
          code: err.code,
        },
        { status: err.statusCode || 400 }
      );
    }

    const errorMessage =
      err instanceof Error ? err.message : "An unexpected error occurred.";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        code: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}
