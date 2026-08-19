const userAgents = [
  "subreddit-vibe-check/1.0.0 (by /u/vibecheck_dev)",
  "web:subreddit-vibe-check:v1.0 (by /u/intern_dev)",
  "android:com.subredditvibecheck:v1.0.0 (by /u/intern_test)",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0",
  "curl/7.88.1",
  "PostmanRuntime/7.32.3",
  "SubredditVibeBot/0.1 by intern_researcher",
];

async function testUserAgents() {
  for (const ua of userAgents) {
    console.log(`\nTesting User-Agent: "${ua}"`);
    try {
      const res = await fetch("https://www.reddit.com/r/reactjs/hot.json?limit=5", {
        headers: {
          "User-Agent": ua,
          "Accept": "application/json, text/plain, */*",
        },
      });
      console.log(`Status: ${res.status}`);
      if (res.ok) {
        const data = await res.json();
        console.log(`✓ Success! Received ${data.data?.children?.length} posts.`);
        return ua;
      }
    } catch (e) {
      console.log(`Error: ${e.message}`);
    }
  }
}

testUserAgents();
