import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-utils': ['lucide-react', 'zustand', 'zod', '@tanstack/react-query'],
          // Note: @google/genai is now handled server-side in Netlify functions, 
          // removing it from the client bundle entirely for maximum performance.
        },
      },
    },
  }
});