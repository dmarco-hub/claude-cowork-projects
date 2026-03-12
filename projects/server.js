const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const API_KEY = process.env.ANTHROPIC_API_KEY;

if (!API_KEY) {
  console.error('\n  ERROR: Set your API key first:\n');
  console.error('  export ANTHROPIC_API_KEY="sk-ant-..."');
  console.error('  node server.js\n');
  process.exit(1);
}

const server = http.createServer((req, res) => {
  // Serve the dashboard
  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
    const html = fs.readFileSync(path.join(__dirname, 'seo-command-center.html'), 'utf8');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
    return;
  }

  // Proxy API calls to Anthropic
  if (req.method === 'POST' && req.url === '/api/generate') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const parsed = JSON.parse(body);
      const postData = JSON.stringify({
        model: parsed.model || 'claude-sonnet-4-20250514',
        max_tokens: parsed.max_tokens || 4096,
        messages: parsed.messages,
      });

      const options = {
        hostname: 'api.anthropic.com',
        path: '/v1/messages',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Length': Buffer.byteLength(postData),
        },
      };

      const apiReq = https.request(options, apiRes => {
        res.writeHead(apiRes.statusCode, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        });
        apiRes.pipe(res);
      });

      apiReq.on('error', err => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      });

      apiReq.write(postData);
      apiReq.end();
    });
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log('\n  ┌─────────────────────────────────────────┐');
  console.log('  │  SEO Command Center running!             │');
  console.log('  │                                         │');
  console.log(`  │  Open: http://localhost:${PORT}              │`);
  console.log('  │                                         │');
  console.log('  │  Press Ctrl+C to stop                   │');
  console.log('  └─────────────────────────────────────────┘\n');
});
