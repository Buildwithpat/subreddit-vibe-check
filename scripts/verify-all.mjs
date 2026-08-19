import Sentiment from "sentiment";

const sentimentAnalyzer = new Sentiment();

function decodeHtmlEntities(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

function parseRedditRss(xmlText, subreddit) {
  const entries = xmlText.split("<entry>").slice(1);
  const posts = [];

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

async function fetchSubreddit(subreddit, limit = 50) {
  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 (subreddit-vibe-check/1.0)",
  };

  const jsonUrl = `https://www.reddit.com/r/${subreddit}/hot.json?limit=${limit}`;
  const rssUrl = `https://www.reddit.com/r/${subreddit}/hot.rss?limit=${limit}`;

  try {
    const res = await fetch(jsonUrl, { headers });
    if (res.ok) {
      const json = await res.json();
      const children = json.data?.children || [];
      if (children.length > 0) {
        return children.map((c) => ({
          id: c.data.id,
          title: decodeHtmlEntities(c.data.title),
          author: c.data.author,
          score: c.data.score,
          numComments: c.data.num_comments,
          permalink: `https://reddit.com${c.data.permalink}`,
          createdUtc: c.data.created_utc,
          subreddit,
        }));
      }
    }
  } catch {
    // fallback
  }

  const res = await fetch(rssUrl, { headers });
  if (!res.ok) {
    throw new Error(`Failed to fetch r/${subreddit}: HTTP ${res.status}`);
  }

  const xml = await res.text();
  return parseRedditRss(xml, subreddit).slice(0, limit);
}

function processSentiment(posts) {
  let positiveCount = 0;
  let neutralCount = 0;
  let negativeCount = 0;
  let totalScore = 0;
  let mostPositive = null;
  let mostNegative = null;

  const analyzed = posts.map((post) => {
    const res = sentimentAnalyzer.analyze(post.title);
    const score = res.score;
    const classification = score > 0 ? "positive" : score < 0 ? "negative" : "neutral";

    totalScore += score;
    if (classification === "positive") positiveCount++;
    else if (classification === "negative") negativeCount++;
    else neutralCount++;

    const item = { ...post, sentimentScore: score, classification };

    if (!mostPositive || score > mostPositive.sentimentScore) mostPositive = item;
    if (!mostNegative || score < mostNegative.sentimentScore) mostNegative = item;

    return item;
  });

  const totalPosts = analyzed.length;
  const rawAvg = totalScore / (totalPosts || 1);
  const averageSentimentScore = Number(rawAvg.toFixed(2));
  const overallVibe = averageSentimentScore > 0 ? "Positive" : averageSentimentScore < 0 ? "Negative" : "Neutral";

  return {
    positiveCount,
    neutralCount,
    negativeCount,
    totalPosts,
    averageSentimentScore,
    overallVibe,
    mostPositivePost: mostPositive,
    mostNegativePost: mostNegative,
  };
}

const subreddits = ["reactjs", "javascript", "webdev", "nextjs", "programming"];

async function run() {
  console.log("=== SUBREDDIT VIBE CHECK ENGINE VALIDATION ===\n");
  for (const sub of subreddits) {
    console.log(`[Testing r/${sub}]`);
    const startTime = Date.now();
    try {
      const posts = await fetchSubreddit(sub, 50);
      const analytics = processSentiment(posts);
      const duration = Date.now() - startTime;

      console.log(`✓ Fetched & Analyzed: ${analytics.totalPosts} posts (${duration}ms)`);
      console.log(`  - Positive Posts: ${analytics.positiveCount}`);
      console.log(`  - Neutral Posts:  ${analytics.neutralCount}`);
      console.log(`  - Negative Posts: ${analytics.negativeCount}`);
      console.log(`  - Average Score:  ${analytics.averageSentimentScore}`);
      console.log(`  - Overall Vibe:   ${analytics.overallVibe}`);
      if (analytics.mostPositivePost) {
        console.log(`  - Most Positive:  "${analytics.mostPositivePost.title.substring(0, 50)}..." (Score: +${analytics.mostPositivePost.sentimentScore})`);
      }
      if (analytics.mostNegativePost) {
        console.log(`  - Most Negative:  "${analytics.mostNegativePost.title.substring(0, 50)}..." (Score: ${analytics.mostNegativePost.sentimentScore})`);
      }
      console.log("");
    } catch (e) {
      console.error(`❌ Failed on r/${sub}:`, e.message);
    }
    // Respect Reddit public rate limit
    await new Promise((resolve) => setTimeout(resolve, 2500));
  }
}

run();
