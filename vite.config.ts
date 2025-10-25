import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rollupOptions: {
      external: [
        'events',
        'dns',
        'child_process',
        'nodemailer',
      ],
      output: {
        manualChunks: (id) => {
          // Vendor splitting for better caching
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            if (id.includes('firebase')) {
              return 'firebase-vendor';
            }
            if (id.includes('supabase')) {
              return 'supabase-vendor';
            }
            if (id.includes('lucide-react') || id.includes('framer-motion')) {
              return 'ui-vendor';
            }
          }
          // Admin pages chunking
          if (id.includes('src/pages/admin')) {
            return 'admin';
          }
        }
      }
    },
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
        drop_debugger: true,
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false, // Disable sourcemaps for smaller build
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: {
    alias: {
      // Shadcn/ui path alias
      "@": resolve(__dirname, "./src"),
      // Provide empty modules for Node.js built-ins
      fs: resolve(__dirname, './src/mocks/empty-module.js'),
      path: resolve(__dirname, './src/mocks/empty-module.js'),
      os: resolve(__dirname, './src/mocks/empty-module.js'),
      crypto: resolve(__dirname, './src/mocks/empty-module.js'),
      stream: resolve(__dirname, './src/mocks/empty-module.js'),
      http: resolve(__dirname, './src/mocks/empty-module.js'),
      https: resolve(__dirname, './src/mocks/empty-module.js'),
      zlib: resolve(__dirname, './src/mocks/empty-module.js'),
      util: resolve(__dirname, './src/mocks/empty-module.js'),
      url: resolve(__dirname, './src/mocks/empty-module.js'),
      net: resolve(__dirname, './src/mocks/empty-module.js'),
      tls: resolve(__dirname, './src/mocks/empty-module.js'),
      assert: resolve(__dirname, './src/mocks/empty-module.js'),
      process: resolve(__dirname, './src/mocks/process-mock.js'),
    }
  }
});
