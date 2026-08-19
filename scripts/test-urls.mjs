const urls = [
  "https://old.reddit.com/r/reactjs/hot.json?limit=50",
  "https://api.reddit.com/r/reactjs/hot?limit=50",
  "https://www.reddit.com/r/reactjs.json?limit=50",
  "https://oauth.reddit.com/r/reactjs/hot?limit=50",
  "https://www.reddit.com/r/reactjs/hot/.json?limit=50",
];

async function testUrls() {
  for (const url of urls) {
    console.log(`\nTesting URL: ${url}`);
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "application/json, text/plain, */*",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });
      console.log(`Status: ${res.status}`);
      if (res.ok) {
        const json = await res.json();
        console.log(`✓ Success on ${url}! Posts: ${json.data?.children?.length}`);
      }
    } catch (e) {
      console.log(`Error: ${e.message}`);
    }
  }
}

testUrls();
