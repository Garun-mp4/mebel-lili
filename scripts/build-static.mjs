import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { PAGE_HTML } from '../src/pageMarkup.js';
import { buildLegal } from './build-legal.mjs';
import { HOME, SERVICES, SITE_URL } from '../seo/site.mjs';
import { seoHead, escapeHtml } from '../seo/metadata.mjs';
import { servicePage } from '../src/servicePages.mjs';
import { minify, preprocessCSS, resolveConfig } from 'vite';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dist = path.join(root, 'dist');
if (path.resolve(dist) !== path.resolve(root, 'dist') || path.dirname(dist) !== root) throw new Error('Invalid build directory');
await fs.rm(dist, { recursive: true, force: true });
await fs.mkdir(dist, { recursive: true });
await buildLegal();
await fs.cp(path.join(root, 'public'), dist, { recursive: true });
const customStyles = await fs.readFile(path.join(root, 'src', 'fallback.css'), 'utf8');
const baseStyles = await fs.readFile(path.join(root, 'public', 'base-styles.css'), 'utf8');
const cssConfig = await resolveConfig({ configFile: false, root, css: { transformer: 'lightningcss' }, build: { cssMinify: 'lightningcss' } }, 'build');
const styles = (await preprocessCSS(`${baseStyles}\n${customStyles}`, path.join(root, 'src', 'production.css'), cssConfig)).code;
const styleName = `fallback.${createHash('sha256').update(styles).digest('hex').slice(0, 12)}.css`;
await fs.writeFile(path.join(dist, styleName), styles);

let runtime = await fs.readFile(path.join(root, 'src', 'runtime.js'), 'utf8');
runtime = runtime
  .replace(/export\s+const\s+BODY_CLASS/g, 'const BODY_CLASS')
  .replace(/export\s+function\s+bootOriginalRuntime/g, 'function bootOriginalRuntime');

// Enhance server-rendered HTML without replacing the DOM and reloading its images.
const minified = await minify('runtime.js', `${runtime}\n\nrequestAnimationFrame(() => bootOriginalRuntime());\n`);
if (minified.errors.length) throw new Error(`Runtime minification failed: ${JSON.stringify(minified.errors)}`);
const app = minified.code;
const appName = `app.${createHash('sha256').update(app).digest('hex').slice(0, 12)}.js`;
await fs.writeFile(path.join(dist, appName), app, 'utf8');

const preview = process.env.VERCEL_ENV === 'preview';
function renderDocument(page, markup) {
  return `<!doctype html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#f4f4f1" />
  ${seoHead(page, { preview })}
  <link rel="icon" href="/assets/lili-logo.png" type="image/png" />
  <link rel="preload" href="/fonts/jost-variable.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/fonts/ibm-plex-mono-regular.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="stylesheet" href="/${styleName}" />
</head>
<body>
  <div id="root">${markup}</div>
  <script defer src="/${appName}"></script>
</body>
</html>`;
}
await fs.writeFile(path.join(dist, 'index.html'), renderDocument(HOME, PAGE_HTML), 'utf8');
for (const page of SERVICES) {
  const directory = path.join(dist, page.path.slice(1));
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(path.join(directory, 'index.html'), renderDocument(page, servicePage(page)), 'utf8');
}
// Build time is not a reliable content modification date, so omit lastmod.
await fs.writeFile(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[HOME, ...SERVICES].map(page => `  <url><loc>${escapeHtml(SITE_URL + page.path)}</loc></url>`).join('\n')}\n</urlset>\n`);
await fs.writeFile(path.join(dist, 'robots.txt'), preview ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${SITE_URL}/sitemap.xml\n`);
console.log('Static production build created in dist/');
