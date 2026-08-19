async function parseRssTest() {
  const res = await fetch("https://www.reddit.com/r/reactjs/hot.rss?limit=50", {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });

  const text = await res.text();
  console.log("Status:", res.status);

  // Extract <entry> items
  const entries = text.split("<entry>").slice(1);
  console.log("Total entries found:", entries.length);

  const posts = [];
  for (const entry of entries) {
    const titleMatch = entry.match(/<title>([\s\S]*?)<\/title>/);
    const idMatch = entry.match(/<id>([\s\S]*?)<\/id>/);
    const authorMatch = entry.match(/<author>[\s\S]*?<name>([\s\S]*?)<\/name>[\s\S]*?<\/author>/);
    const linkMatch = entry.match(/<link href="([\s\S]*?)"/);
    const updatedMatch = entry.match(/<updated>([\s\S]*?)<\/updated>/);

    if (titleMatch) {
      const rawTitle = titleMatch[1]
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");

      posts.push({
        id: idMatch ? idMatch[1].replace(/.*\/comments\/([^/]+).*/, "$1") : Math.random().toString(),
        title: rawTitle,
        author: authorMatch ? authorMatch[1].replace(/^\/u\//, "") : "[deleted]",
        score: 0,
        numComments: 0,
        permalink: linkMatch ? linkMatch[1] : "",
        createdUtc: updatedMatch ? Math.floor(new Date(updatedMatch[1]).getTime() / 1000) : 0,
        subreddit: "reactjs",
      });
    }
  }

  console.log(`Parsed ${posts.length} posts successfully.`);
  console.log("First 3 posts:", JSON.stringify(posts.slice(0, 3), null, 2));
}

parseRssTest();
