import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Readable } from 'node:stream';
import { handleLeadRequest } from './server/leads.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');
const publicDir = path.join(__dirname, 'public');
const port = Number(process.env.PORT || 4173);

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon'
};

function isInside(root, target) {
  const relative = path.relative(root, target);
  return relative && !relative.startsWith('..') && !path.isAbsolute(relative) || relative === '';
}

async function sendFile(res, filePath) {
  const stat = await fsp.stat(filePath);
  if (!stat.isFile()) return false;
  res.writeHead(200, {
    'content-type': mime[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
    'cache-control': filePath.endsWith('.html') ? 'no-cache' : 'public, max-age=3600'
  });
  fs.createReadStream(filePath).pipe(res);
  return true;
}

async function serve(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (url.pathname === '/api/leads') {
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) if (value) headers.set(key, Array.isArray(value) ? value.join(', ') : value);
    headers.set('x-forwarded-for', req.socket.remoteAddress || 'local');
    const request = new Request(url, {
      method: req.method, headers,
      ...(!['GET', 'HEAD'].includes(req.method) ? { body: Readable.toWeb(req), duplex: 'half' } : {})
    });
    const response = await handleLeadRequest(request);
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(Buffer.from(await response.arrayBuffer()));
    return;
  }
  if (url.pathname.startsWith('/api/')) {
    res.writeHead(404, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ ok: false, message: 'Not found' }));
    return;
  }
  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    res.writeHead(400, {'content-type': 'text/plain; charset=utf-8'});
    res.end('Bad request');
    return;
  }

  if (pathname === '/') pathname = '/index.html';
  const hasDist = fs.existsSync(path.join(distDir, 'index.html'));
  const roots = hasDist ? [distDir, publicDir] : [publicDir];

  for (const root of roots) {
    const target = path.resolve(root, `.${pathname}`);
    if (!isInside(root, target)) continue;
    try {
      if (await sendFile(res, target)) return;
    } catch {}
  }

  const fallback = hasDist ? path.join(distDir, 'index.html') : path.join(__dirname, 'index.html');
  try {
    await sendFile(res, fallback);
  } catch {
    res.writeHead(404, {'content-type': 'text/plain; charset=utf-8'});
    res.end('Not found');
  }
}

http.createServer((req, res) => {
  serve(req, res).catch((error) => {
    console.error(error);
    if (!res.headersSent) res.writeHead(500, {'content-type': 'text/plain; charset=utf-8'});
    res.end('Server error');
  });
}).listen(port, '0.0.0.0', () => {
  console.log(`Mebel Lili site: http://localhost:${port}`);
});
