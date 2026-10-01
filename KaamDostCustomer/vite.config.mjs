import { defineConfig, transformWithOxc } from 'vite';
import react from '@vitejs/plugin-react';

const transformJsxInJs = () => ({
  name: 'transform-jsx-in-js',
  enforce: 'pre',
  async transform(code, id) {
    if (id.includes('node_modules') || !id.endsWith('.js')) {
      return null;
    }
    return await transformWithOxc(code, id, {
      lang: 'jsx',
    });
  },
});

export default defineConfig({
  plugins: [
    transformJsxInJs(),
    react(),
  ],
  optimizeDeps: {
    entries: ['index.html'],
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
    extensions: ['.web.js', '.js', '.jsx', '.json']
  },
  server: {
    port: 3000,
    open: false,
    host: true
  },
  preview: {
    port: 3000,
    open: false,
    host: true
  }
});
