import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          fase1: path.resolve(__dirname, 'fase-1.html'),
          fase2: path.resolve(__dirname, 'fase-2.html'),
          fase3: path.resolve(__dirname, 'fase-3.html'),
          fase4: path.resolve(__dirname, 'fase-4.html'),
          fase5: path.resolve(__dirname, 'fase-5.html'),
          fase6: path.resolve(__dirname, 'fase-6.html'),
        },
      },
    },
  };
});
