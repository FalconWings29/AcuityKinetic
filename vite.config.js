import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// The dev server doubles as a thin proxy to the Anthropic API. The browser
// posts to /api/anthropic/v1/messages with no credentials; this proxy injects
// the API key + version headers server-side, so the key never ships to the
// client bundle. This is the "API key handled via the proxy" the README refers to.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey = env.ANTHROPIC_API_KEY || '';

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/anthropic': {
          target: 'https://api.anthropic.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/anthropic/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (apiKey) proxyReq.setHeader('x-api-key', apiKey);
              proxyReq.setHeader('anthropic-version', '2023-06-01');
            });
            proxy.on('error', (err) => {
              console.error('[anthropic proxy] error:', err.message);
            });
          },
        },
      },
    },
  };
});
