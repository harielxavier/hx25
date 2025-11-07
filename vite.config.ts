import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: false, // Don't auto-open, let user open manually
      filename: 'dist/bundle-analysis.html',
      gzipSize: true,
      brotliSize: true,
    })
  ],
  server: {
    headers: {
      // Security and SEO headers for development
      'X-Frame-Options': 'SAMEORIGIN',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(self), microphone=(self), geolocation=(self)',
    }
  },
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
        manualChunks(id) {
          // Fixed chunking to prevent React forwardRef errors - v4
          if (id.includes('node_modules')) {
            // Keep React core separate and loaded first
            if (id.includes('react/') && !id.includes('react-')) {
              return 'vendor-react-core';
            }
            // Bundle React DOM and JSX runtime with core
            if (id.includes('react-dom') || id.includes('react/jsx-runtime')) {
              return 'vendor-react-core';
            }
            // Bundle ALL UI libraries together in extras (including lucide)
            if (id.includes('@emotion') || id.includes('@mui') ||
                id.includes('framer-motion') || id.includes('recharts') ||
                id.includes('lucide-react')) {
              return 'vendor-react-extras';
            }
            // Firebase - separate chunk
            if (id.includes('firebase')) {
              return 'vendor-firebase';
            }
            // Supabase - separate chunk
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            // All other vendor libraries
            return 'vendor';
          }
        },
        // Aggressive caching strategy - v4 to bust cache
        chunkFileNames: 'assets/js/[name]-v4-[hash].js',
        entryFileNames: 'assets/js/[name]-v4-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
        // Optimize chunk loading
        inlineDynamicImports: false,
      }
    },
    target: 'es2020', // Modern browsers only for smaller output
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2, // Multiple compression passes
      },
      mangle: {
        safari10: true, // Fix Safari 10+ issues
      },
      format: {
        comments: false, // Remove all comments
      }
    },
    chunkSizeWarningLimit: 500, // Stricter size limits
    sourcemap: false, // NEVER in production
    reportCompressedSize: false, // Faster builds
    cssCodeSplit: true, // Split CSS per route
    // Performance optimizations for Core Web Vitals
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
  },
  css: {
    devSourcemap: false,
    modules: {
      localsConvention: 'camelCase'
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      '@mui/material',
      '@emotion/react',
      '@emotion/styled',
      'recharts',
      'chart.js',
      'react-chartjs-2',
      'lucide-react'
    ],
    // Ensure React is available to all dependencies
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
  define: {
    // Ensure React is available globally for libraries that expect it
    global: 'globalThis',
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
