import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  const rootDir = import.meta.dirname;
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'copy-unbundled-src-assets',
        apply: 'build' as const,
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(rootDir, 'dist');
          const srcAssets = path.resolve(rootDir, 'src/assets');
          const distAssets = path.resolve(distDir, 'src/assets');
          if (fs.existsSync(distDir) && fs.existsSync(srcAssets)) {
            fs.cpSync(srcAssets, distAssets, {recursive: true, force: true});
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(rootDir, '.'),
        '@shared': path.resolve(rootDir, 'src/shared'),
      },
    },
    build: {
      rolldownOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes('node_modules/motion') || id.includes('node_modules/framer-motion')) {
              return 'vendor-motion';
            }
            if (
              id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/react-router') ||
              id.includes('node_modules/@tanstack/')
            ) {
              return 'vendor-react';
            }
          },
        },
      },
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@tanstack/react-query',
        'motion/react',
        'lucide-react',
        'lottie-react',
      ],
    },
    preview: {
      proxy: {'/v1': {target: process.env.SABZINE_API_TARGET || 'http://127.0.0.1:8000', changeOrigin: true}},
    },
    server: {
      proxy: {'/v1': {target: process.env.SABZINE_API_TARGET || 'http://127.0.0.1:8000', changeOrigin: true}},
      hmr: false as const,
      ws: false as const,
      watch: null,
    },
  };
});
