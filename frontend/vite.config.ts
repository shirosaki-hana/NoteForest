import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

// pnpm(.pnpm) 구조까지 고려해 node_modules 경로에서 패키지를 매칭하는 정규식 헬퍼
// 예: node_modules/.pnpm/@mui+material@9.1.1/node_modules/@mui/material/index.js
const pkg = (names: string) => new RegExp(`node_modules[\\\\/](?:\\.pnpm[\\\\/].*[\\\\/]node_modules[\\\\/])?(?:${names})[\\\\/]`);

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // debug 모드: 소스맵 포함, 난독화 제거 (프로덕션 버그 추적용)
  // 사용법: pnpm build:debug 또는 vite build --mode debug
  const isDebug = mode === 'debug';

  return {
    plugins: [
      react(),
      visualizer({
        filename: 'dist/stats.html',
        open: false,
        gzipSize: true,
        brotliSize: true,
      }),
    ],
    build: {
      target: 'es2023',
      chunkSizeWarningLimit: 700,
      sourcemap: isDebug,
      minify: !isDebug,
      // Rolldown 네이티브 코드 스플리팅 (rollupOptions.manualChunks 호환 경로 대체)
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              // React 코어 + React 컨텍스트를 많이 쓰는 라이브러리(MUI/Emotion/Router/i18n 바인딩) 통합
              {
                name: 'vendor-react',
                test: pkg('react|react-dom|scheduler|react-router|react-router-dom|react-i18next|use-sync-external-store|@mui|@emotion'),
                priority: 20,
              },
              // CodeMirror 에디터 계열 (에디터 진입 시에만 필요하므로 별도 청크로 분리)
              {
                name: 'vendor-editor',
                test: pkg('@codemirror|@uiw|@lezer|@marijn|codemirror|style-mod|w3c-keyname|crelt'),
                priority: 16,
              },
              // 마크다운 렌더링 계열 (react-markdown + remark/rehype + highlight.js + katex 등)
              {
                name: 'vendor-markdown',
                test: pkg(
                  'react-markdown|remark-|rehype-|highlight\\.js|katex|unified|unist-util-|hast-|mdast-|micromark|vfile|devlop|bail|trough|property-information|space-separated-tokens|comma-separated-tokens|lowlight|fault'
                ),
                priority: 15,
              },
              {
                name: 'vendor-http',
                test: pkg('axios'),
                priority: 10,
              },
              // i18n 코어 (react-i18next 제외 - vendor-react 청크에 포함)
              {
                name: 'vendor-i18n',
                test: pkg('i18next'),
                priority: 10,
              },
              {
                name: 'vendor-state',
                test: pkg('zustand'),
                priority: 10,
              },
            ],
          },
        },
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:4001',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
