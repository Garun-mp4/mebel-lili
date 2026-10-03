import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { PAGE_HTML } from '../src/pageMarkup.js';
import { buildLegal } from './build-legal.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dist = path.join(root, 'dist');
if (path.resolve(dist) !== path.resolve(root, 'dist') || path.dirname(dist) !== root) throw new Error('Invalid build directory');
await fs.rm(dist, { recursive: true, force: true });
await fs.mkdir(dist, { recursive: true });
await buildLegal();
await fs.cp(path.join(root, 'public'), dist, { recursive: true });
const customStyles = await fs.readFile(path.join(root, 'src', 'fallback.css'), 'utf8');
const styleName = `fallback.${createHash('sha256').update(customStyles).digest('hex').slice(0, 12)}.css`;
await fs.writeFile(path.join(dist, styleName), customStyles);

let runtime = await fs.readFile(path.join(root, 'src', 'runtime.js'), 'utf8');
runtime = runtime
  .replace(/export\s+const\s+BODY_CLASS/g, 'const BODY_CLASS')
  .replace(/export\s+function\s+bootOriginalRuntime/g, 'function bootOriginalRuntime');

const app = `${runtime}\n\ndocument.getElementById('root').innerHTML = ${JSON.stringify(PAGE_HTML)};\nrequestAnimationFrame(() => bootOriginalRuntime());\n`;
const appName = `app.${createHash('sha256').update(app).digest('hex').slice(0, 12)}.js`;
await fs.writeFile(path.join(dist, appName), app, 'utf8');

const index = `<!doctype html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#f4f4f1" />
  <meta name="description" content="Mebel Lili — кухни, шкафы, корпусная и другая мебель на заказ в Самаре. Обсудите проект и подберите решение под ваше пространство." />
  <title>Mebel Lili — мебель на заказ в Самаре</title>
  <link rel="icon" href="/assets/lili-logo.png" type="image/png" />
  <link rel="preload" href="/fonts/jost-variable.ttf" as="font" type="font/ttf" crossorigin />
  <link rel="preload" href="/fonts/ibm-plex-mono-regular.ttf" as="font" type="font/ttf" crossorigin />
  <link rel="stylesheet" href="/base-styles.css" />
  <link rel="stylesheet" href="/${styleName}" />
</head>
<body>
  <div id="root">${PAGE_HTML}</div>
  <script defer src="/${appName}"></script>
</body>
</html>`;
await fs.writeFile(path.join(dist, 'index.html'), index, 'utf8');
console.log('Static production build created in dist/');
