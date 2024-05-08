import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    proxy: {
      '/backend.convex.cloud': {
        target: 'ws://0.0.0.0:3210',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/backend\.convex\.cloud/, '/'),
      },
    },
  },
});
