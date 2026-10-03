import http from 'node:http';
import https from 'node:https';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { Readable } from 'node:stream';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, 'dist');
const publicDir = path.join(__dirname, 'public');
const cacheDir = path.join(__dirname, '.asset-cache');
const port = Number(process.env.PORT || 4173);

const mime = {
  '.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml',
  '.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.gif':'image/gif',
  '.mp4':'video/mp4','.webm':'video/webm','.woff':'font/woff','.woff2':'font/woff2','.ttf':'font/ttf','.otf':'font/otf',
  '.ico':'image/x-icon'
};

function safeHeaders(headers) {
  const blocked = new Set(['content-encoding','transfer-encoding','connection','keep-alive','set-cookie','content-security-policy','x-frame-options']);
  const out = {};
  headers.forEach((v,k)=>{ if(!blocked.has(k.toLowerCase())) out[k]=v; });
  out['access-control-allow-origin'] = '*';
  return out;
}

function cacheKey(url) { return crypto.createHash('sha256').update(url).digest('hex'); }

async function proxyGertix(req,res,urlObj) {
  const upstreamPath = urlObj.pathname.replace(/^\/__gertix/, '') + urlObj.search;
  const upstream = 'https://gertix.studio' + upstreamPath;
  const key = cacheKey(upstream);
  const ext = path.extname(new URL(upstream).pathname) || '.bin';
  const bodyFile = path.join(cacheDir, key + ext);
  const metaFile = path.join(cacheDir, key + '.json');
  const range = req.headers.range;
  await fsp.mkdir(cacheDir,{recursive:true});

  if (!range && fs.existsSync(bodyFile) && fs.existsSync(metaFile)) {
    const meta = JSON.parse(await fsp.readFile(metaFile,'utf8'));
    res.writeHead(200, {...meta.headers, 'x-clone-cache':'HIT'});
    fs.createReadStream(bodyFile).pipe(res);
    return;
  }

  try {
    const headers = {'user-agent':'Mozilla/5.0 GertiX-React-Clone/1.0','accept':req.headers.accept || '*/*'};
    if (range) headers.range = range;
    const response = await fetch(upstream,{headers,redirect:'follow',signal:AbortSignal.timeout(15000)});
    const h = safeHeaders(response.headers);
    h['x-clone-cache'] = 'MISS';
    res.writeHead(response.status,h);
    if (!response.body) return res.end();

    if (!range && response.ok) {
      const chunks=[];
      for await (const chunk of Readable.fromWeb(response.body)) chunks.push(chunk);
      const buf=Buffer.concat(chunks);
      await fsp.writeFile(bodyFile,buf);
      await fsp.writeFile(metaFile,JSON.stringify({headers:h,upstream},null,2));
      res.end(buf);
    } else {
      Readable.fromWeb(response.body).pipe(res);
    }
  } catch (err) {
    res.writeHead(502,{'content-type':'text/plain; charset=utf-8'});
    res.end('Upstream asset unavailable: '+err.message);
  }
}

async function serveStatic(req,res,urlObj) {
  let pathname = decodeURIComponent(urlObj.pathname);
  if (pathname === '/') pathname='/index.html';
  const roots = fs.existsSync(path.join(dist,'index.html')) ? [dist, publicDir] : [publicDir];
  for (const root of roots) {
    const target = path.normalize(path.join(root, pathname));
    if (!target.startsWith(root)) continue;
    try {
      const st = await fsp.stat(target);
      if (!st.isFile()) continue;
      res.writeHead(200,{'content-type':mime[path.extname(target).toLowerCase()]||'application/octet-stream','cache-control':'public, max-age=3600'});
      fs.createReadStream(target).pipe(res); return;
    } catch {}
  }
  const fallback = fs.existsSync(path.join(dist,'index.html')) ? path.join(dist,'index.html') : path.join(__dirname,'index.html');
  res.writeHead(200,{'content-type':'text/html; charset=utf-8'});
  fs.createReadStream(fallback).pipe(res);
}

http.createServer(async (req,res)=>{
  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (urlObj.pathname.startsWith('/__gertix/')) return proxyGertix(req,res,urlObj);
  return serveStatic(req,res,urlObj);
}).listen(port,'0.0.0.0',()=>console.log(`GertiX clone: http://localhost:${port}`));
