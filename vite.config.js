import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'local-api-proxy-plugin',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url.startsWith('/api/proxy')) {
            const urlObj = new URL(req.url, 'http://localhost');
            const targetUrl = urlObj.searchParams.get('url');
            if (!targetUrl) {
              res.statusCode = 400;
              res.end('Missing url parameter');
              return;
            }

            try {
              console.log(`[Proxy] Fetching target URL: ${targetUrl}`);
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
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html; charset=utf-8');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.end(text);
              } else {
                res.statusCode = response.status;
                res.end(`Target returned status ${response.status}`);
              }
            } catch (e) {
              res.statusCode = 500;
              res.end(`Proxy error: ${e.message}`);
            }
            return;
          }
          next();
        });
      }
    }
  ],
})
