import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  publicDir: 'public',
  build: {
    // Monaco Editor 정적 파일 복사를 위한 설정
    copyPublicDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          theme: ['@mui/material', '@mui/icons-material'],
          pluginKatex: ['rehype-katex'],
          pluginRehype: ['rehype-highlight', 'rehype-raw'],
          pluginRemark: ['remark-gfm', 'remark-math'],
        },
      },
    },
  },
  define: {
    // Monaco Editor 워커 경로 설정
    'process.env.MONACO_BASE_URL': JSON.stringify('/monaco/'),
  },
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
