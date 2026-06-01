import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react({ fastRefresh: true })],
  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: { drop_console: true },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          gsap: ['gsap'],
          framer: ['framer-motion'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['gsap', 'framer-motion', 'react', 'react-dom'],
  },
});
