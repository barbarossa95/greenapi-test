import {reactRouter} from '@react-router/dev/vite';
import https from 'https';
import {defineConfig, loadEnv} from 'vite';
import {analyzer} from 'vite-bundle-analyzer';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    resolve: {tsconfigPaths: true},
    server: {
      host: '0.0.0.0',
      proxy: {
        '/api': {
          // Разрешить проксирование на HTTPS с самоподписанными сертификатами
          secure: false,
          agent: new https.Agent({
            family: 4, // force use  IPv4，disable IPv6
            keepAlive: true,
          }),
          target: env.VITE_API_URL ?? 'http://localhost:8080',
          changeOrigin: true,
          // SSE long-lived; без этого proxy может буферизовать поток.
          configure: (proxy) => {
            proxy.on('proxyRes', (proxyRes) => {
              if (
                proxyRes.headers['content-type']?.includes('text/event-stream')
              ) {
                proxyRes.headers['cache-control'] = 'no-cache';
                proxyRes.headers['connection'] = 'keep-alive';
              }
            });
          },
        },
      },
    },
    plugins: [
      reactRouter(),
      svgr({
        include: '**/*.svg',
        svgrOptions: {icon: true, exportType: 'default'},
      }),
      mode === 'development' && analyzer(),
    ],
    build: {
      sourcemap: false,
      commonjsOptions: {
        // Transform mixed modules to CJS
        transformMixedEsModules: true,
        // Include specific packages
        include: [/node_modules/],
        // Alternatively, exclude problematic ones
        // exclude: ['some-package']
      },
    },
  };
});
