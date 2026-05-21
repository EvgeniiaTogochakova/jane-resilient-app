import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// https://vite.dev/config
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@api': resolve(__dirname, './src/api'),
      '@app': resolve(__dirname, './src/app'),
      '@parts': resolve(__dirname, './src/parts'),
      '@assets': resolve(__dirname, './src/assets'),
      '@components': resolve(__dirname, './src/components'),
    },
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          minSize: 10000,
          groups: [
            {
              name: 'mui-vendor',
              test: /node_modules[\\/](@mui|@emotion)/,
              priority: 30,
            },
            {
              name: 'data-vendor',
              test: /node_modules[\\/](@tanstack|axios|react-router|react-router-dom|react-hook-form|zod)/,
              priority: 20,
            },
            {
              name: 'core-vendor',
              test: /node_modules/,
              priority: 10,
            },
          ],
        },
      },
    },
  },
});
