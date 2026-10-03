import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/__gertix': {
        target: 'https://gertix.studio',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/__gertix/, '')
      }
    }
  }
});
