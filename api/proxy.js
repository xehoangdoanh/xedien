export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle URL parsing from query parameters
  let targetUrl = req.query.url;
  
  if (!targetUrl && req.url) {
    try {
      const parsedUrl = new URL(req.url, 'http://localhost');
      targetUrl = parsedUrl.searchParams.get('url');
    } catch (e) {
      // ignore
    }
  }

  if (!targetUrl) {
    return res.status(400).send('Missing url parameter');
  }

  try {
    console.log(`[Vercel Proxy] Fetching target URL: ${targetUrl}`);
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'vi,en-US;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    if (response.ok) {
      const text = await response.text();
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(text);
    } else {
      return res.status(response.status).send(`Target returned status ${response.status}`);
    }
  } catch (error) {
    return res.status(500).send(`Proxy error: ${error.message}`);
  }
}
