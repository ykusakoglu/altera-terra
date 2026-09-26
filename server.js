import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const port = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
  const requestPath = (req.url || '/').split('?')[0] === '/' ? '/preview-final.html' : (req.url || '/').split('?')[0];
  const assetPath = requestPath.startsWith('/assets/') ? `/public${requestPath}` : requestPath;
  const filePath = path.join(root, assetPath);
  if (!filePath.startsWith(root)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.readFile(filePath, (error, data) => {
    if (error) { res.writeHead(404); return res.end('Not found'); }
    const type = filePath.endsWith('.html') ? 'text/html; charset=utf-8' : filePath.endsWith('.webmanifest') ? 'application/manifest+json' : filePath.endsWith('.png') ? 'image/png' : filePath.endsWith('.jpg') || filePath.endsWith('.jpeg') ? 'image/jpeg' : filePath.endsWith('.svg') ? 'image/svg+xml' : filePath.endsWith('.ico') ? 'image/x-icon' : 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'public, max-age=3600' });
    res.end(data);
  });
});
server.listen(port, () => console.log(`Altera Terra listening on ${port}`));
