# GertiX React clone

React reproduction of the supplied `gertix.studio` homepage source. The original DOM, inline block styles, text, image/video references and interaction scripts are preserved as closely as possible.

## Quick start (no install)

```bash
node server.mjs
```
Open `http://localhost:4173`. The pre-generated `dist/` uses React 18 UMD from unpkg.

## Development

```bash
npm install
npm run dev
```

## Production build

```bash
npm install
npm run build
npm start
```

The production server exposes a restricted `/__gertix/*` reverse proxy. CSS, fonts, images, videos, JavaScript and Lottie files from the original WordPress host are cached into `.asset-cache/` after first use, which avoids cross-origin font issues and keeps repeat loads local. Video range requests are proxied without unsafe partial-file caching.

## Notes

- Scope: the supplied source is the homepage. Internal links to deeper GertiX pages intentionally keep their original destinations rather than inventing pages that were not present in the supplied source.
- Tracking/push scripts and Google reCAPTCHA were intentionally not copied. Visual/front-end interaction scripts are retained.
- Newsletter/contact submissions are replaced by local success feedback because the original forms depend on the original WordPress/Brevo backend and anti-spam tokens.
- Content, logos, imagery, video and trademarks remain property of their respective owners. Use/deploy only when you have the necessary rights.
