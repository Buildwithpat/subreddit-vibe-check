import Sentiment from "sentiment";

const sentimentAnalyzer = new Sentiment();

const subreddits = ["reactjs", "javascript", "webdev", "nextjs", "programming"];

async function validateSubreddit(subreddit) {
  console.log(`\n========================================`);
  console.log(`Testing r/${subreddit}...`);
  console.log(`========================================`);

  const url = `https://www.reddit.com/r/${subreddit}/hot.json?limit=50`;
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 (subreddit-vibe-check/1.0)",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch r/${subreddit}: HTTP ${response.status}`);
  }

  const json = await response.json();
  const children = json.data?.children || [];
  console.log(`✓ Fetched ${children.length} posts from Reddit API`);

  const analyzed = children.map((c) => {
    const title = c.data?.title || "";
    const res = sentimentAnalyzer.analyze(title);
    return {
      title,
      score: res.score,
      classification: res.score > 0 ? "positive" : res.score < 0 ? "negative" : "neutral",
    };
  });

  const positive = analyzed.filter((p) => p.classification === "positive").length;
  const neutral = analyzed.filter((p) => p.classification === "neutral").length;
  const negative = analyzed.filter((p) => p.classification === "negative").length;
  const totalScore = analyzed.reduce((acc, p) => acc + p.score, 0);
  const avgScore = Number((totalScore / (analyzed.length || 1)).toFixed(2));
  const overallVibe = avgScore > 0 ? "Positive" : avgScore < 0 ? "Negative" : "Neutral";

  console.log(`✓ Total Posts: ${analyzed.length}`);
  console.log(`✓ Positive Posts: ${positive}`);
  console.log(`✓ Neutral Posts: ${neutral}`);
  console.log(`✓ Negative Posts: ${negative}`);
  console.log(`✓ Average Sentiment Score: ${avgScore}`);
  console.log(`✓ Overall Vibe: ${overallVibe}`);
}

async function runAll() {
  for (const sub of subreddits) {
    try {
      await validateSubreddit(sub);
    } catch (err) {
      console.error(`❌ Error on r/${sub}:`, err.message);
    }
    // Small delay to respect rate limits
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

runAll();
