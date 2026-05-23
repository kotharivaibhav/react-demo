import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('socket.io')) return 'vendor-socket';
          if (id.includes('@tanstack/react-virtual')) return 'vendor-virtual';
          if (id.includes('react-hook-form') || id.includes('zod') || id.includes('@hookform'))
            return 'vendor-forms';
          if (id.includes('@reduxjs') || id.includes('react-redux')) return 'vendor-redux';
          if (id.includes('react-router')) return 'vendor-router';
          if (id.includes('react')) return 'vendor-react';
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
