import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Readable } from 'node:stream';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream/promises';
import { handleLeadRequest, collectionReady } from './server/leads.mjs';
import { purgeExpired } from './server/lead-store.mjs';
import { operator, operatorReady } from './legal/operator.mjs';
import { SERVICES } from './seo/site.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');
const publicDir = path.join(__dirname, 'public');
const port = Number(process.env.PORT || 4173);

if (collectionReady()) {
  const purge = () => purgeExpired(process.env).catch(() => console.error('Expired lead cleanup failed; check private storage permissions.'));
  await purge();
  setInterval(purge, 60 * 60 * 1000).unref();
}

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.ttf': 'font/ttf',
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

async function sendFile(req, res, filePath) {
  const stat = await fsp.stat(filePath);
  if (!stat.isFile()) return false;
  const acceptsGzip = (req.headers['accept-encoding'] || '').split(',').some(value => {
    const [encoding, ...parameters] = value.trim().split(';');
    return encoding === 'gzip' && !parameters.some(parameter => /^\s*q\s*=\s*0(?:\.0*)?\s*$/.test(parameter));
  });
  const compress = acceptsGzip && /\.(html|css|js|mjs|json|xml|txt|svg)$/.test(filePath);
  const immutable = /\.(?:[a-f0-9]{12})\.(?:css|js)$/.test(filePath);
  res.writeHead(200, {
    'content-type': mime[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
    'cache-control': filePath.endsWith('.html') ? 'no-cache' : immutable ? 'public, max-age=31536000, immutable' : 'public, max-age=3600',
    'vary': 'Accept-Encoding',
    ...(compress ? { 'content-encoding': 'gzip' } : {})
  });
  if (req.method === 'HEAD') { res.end(); return true; }
  if (compress) await pipeline(fs.createReadStream(filePath), createGzip(), res);
  else await pipeline(fs.createReadStream(filePath), res);
  return true;
}

async function serve(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (url.pathname === '/api/leads') {
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) if (value) headers.set(key, Array.isArray(value) ? value.join(', ') : value);
    // TRUST_PROXY is safe only behind a firewall and a proxy that replaces this header.
    const client = process.env.TRUST_PROXY === 'true' ? req.headers['x-forwarded-for']?.split(',')[0].trim() : undefined;
    headers.set('x-forwarded-for', client || req.socket.remoteAddress || 'local');
    const apiUrl = operatorReady() ? new URL(url.pathname, operator.site) : url;
    const request = new Request(apiUrl, {
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

  const canonicalPath = pathname === '/index.html' ? '/' : SERVICES.find(page => pathname === page.path.slice(0, -1) || pathname === `${page.path}index.html`)?.path;
  if (canonicalPath) {
    res.writeHead(308, { location: canonicalPath + url.search });
    res.end();
    return;
  }
  if (pathname === '/' || SERVICES.some(page => pathname === page.path)) pathname += 'index.html';
  const hasDist = fs.existsSync(path.join(distDir, 'index.html'));
  const roots = hasDist ? [distDir, publicDir] : [publicDir];

  for (const root of roots) {
    const target = path.resolve(root, `.${pathname}`);
    if (!isInside(root, target)) continue;
    try {
      if (await sendFile(req, res, target)) return;
    } catch {}
  }

  res.writeHead(404, {'content-type': 'text/plain; charset=utf-8'});
  res.end('Not found');
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
