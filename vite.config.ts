import {reactRouter} from '@react-router/dev/vite';
import {defineConfig} from 'vite';
import {analyzer} from 'vite-bundle-analyzer';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig(({mode}) => ({
  resolve: {tsconfigPaths: true},
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
}));
