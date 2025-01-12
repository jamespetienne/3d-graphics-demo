import { defineConfig } from 'vite';

export default defineConfig({
  root: './', // Project root
  build: {
    outDir: 'dist', // Output directory
    rollupOptions: {
      input: './index.html', // Entry point
    },
  },
  server: {
    open: true, // Auto-open browser on `npm run dev`
  },
});

