import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
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
          // React 19 requires all React-dependent libraries in same bundle
          // to avoid "Cannot access before initialization" errors
          if (id.includes('node_modules')) {
            // Group React ecosystem + all React-dependent UI libraries together
            if (
              id.includes('react') ||
              id.includes('react-dom') ||
              id.includes('react-router') ||
              id.includes('scheduler') ||
              id.includes('recharts') ||
              id.includes('@mui') ||
              id.includes('@emotion') ||
              id.includes('lucide-react') ||
              id.includes('framer-motion') ||
              id.includes('@radix-ui')
            ) {
              return 'react-vendor';
            }
            // Keep Supabase and its dependencies together
            if (id.includes('supabase') || id.includes('@supabase') || id.includes('postgrest-js') || id.includes('gotrue-js')) {
              return 'supabase-vendor';
            }
            // Other large vendors
            if (id.includes('firebase')) {
              return 'firebase-vendor';
            }
            if (id.includes('chart.js')) {
              return 'charts-vendor';
            }
          }
          // Let Vite handle the rest automatically
          return undefined;
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
    include: [
      '@mui/material',
      '@emotion/react',
      '@emotion/styled',
      'recharts',
      'chart.js'
    ],
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
