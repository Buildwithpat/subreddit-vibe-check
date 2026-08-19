async function testReddit() {
  // Test 1: RSS
  try {
    const rss = await fetch("https://www.reddit.com/r/reactjs/hot.rss?limit=50", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    console.log("RSS Status:", rss.status);
    if (rss.ok) {
      const text = await rss.text();
      console.log("RSS Length:", text.length, "Starts with:", text.substring(0, 100));
    }
  } catch (e) {
    console.log("RSS error:", e.message);
  }

  // Test 2: Reddit App User Agent
  try {
    const jsonRes = await fetch("https://www.reddit.com/r/reactjs/hot.json?limit=50&raw_json=1", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0",
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.5",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site"
      }
    });
    console.log("JSON with browser headers:", jsonRes.status);
  } catch (e) {
    console.log("JSON error:", e.message);
  }
}

testReddit();
