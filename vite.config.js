import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'bundle',
    sourcemap: false,
    target: 'es2020'
  },
  test: {
    include: ['tests/**/*.test.js'],
    environment: 'node'
  }
});
