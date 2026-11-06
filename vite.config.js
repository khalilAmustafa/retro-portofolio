import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'bundle',
    sourcemap: false,
    target: 'es2020'
    ,rollupOptions: {
      input: { experience: 'index.html', previous:'previous.html', legacy: 'legacy.html', tvReview: 'tv-review.html', channel:'channel.html' },
      output: { manualChunks: { three: ['three'], motion: ['gsap'] } }
    }
  },
  test: {
    include: ['tests/**/*.test.js'],
    environment: 'node'
  }
});
