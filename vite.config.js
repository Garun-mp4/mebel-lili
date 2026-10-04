import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { HOME, SERVICES } from './seo/site.mjs';
import { seoHead } from './seo/metadata.mjs';

export default defineConfig({
  plugins: [react(), {
    name: 'lili-seo-development-head',
    transformIndexHtml(html, context) {
      const pathname = new URL(context.originalUrl || '/', 'http://localhost').pathname;
      const page = SERVICES.find(service => service.path === pathname) || HOME;
      return html.replace(/<title>[\s\S]*?<\/title>/, '').replace(/<meta name="description"[^>]*\/>/, '').replace('</head>', `${seoHead(page, { preview: Boolean(context.server) })}\n</head>`);
    },
  }],
  server: {
    host: '0.0.0.0',
    proxy: { '/api': 'http://127.0.0.1:4173' }
  }
});
