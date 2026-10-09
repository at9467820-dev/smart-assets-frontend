import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  publicDir: 'static',
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://smart-assets.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/static': {
        target: 'https://smart-assets.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/qrcodes': {
        target: 'https://smart-assets.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'https://smart-assets.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});


