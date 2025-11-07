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
        // Aggressive caching strategy - v5 to bust cache
        chunkFileNames: 'assets/js/[name]-v5-[hash].js',
        entryFileNames: 'assets/js/[name]-v5-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
        // Optimize chunk loading
        inlineDynamicImports: false,
        // Manual chunking for better performance
        manualChunks: (id) => {
          // Node modules chunking
          if (id.includes('node_modules')) {
            // Core React libraries
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }

            // Router libraries
            if (id.includes('react-router') || id.includes('react-helmet-async')) {
              return 'router-vendor';
            }

            // MUI and emotion (large UI framework)
            if (id.includes('@mui') || id.includes('@emotion')) {
              return 'mui-vendor';
            }

            // Chart libraries (large)
            if (id.includes('chart.js') || id.includes('recharts') || id.includes('react-chartjs-2')) {
              return 'chart-vendor';
            }

            // Database
            if (id.includes('@supabase')) {
              return 'supabase-vendor';
            }

            // Rich text editor
            if (id.includes('react-quill') || id.includes('quill')) {
              return 'editor-vendor';
            }

            // Media libraries
            if (id.includes('photoswipe') || id.includes('react-intersection-observer')) {
              return 'media-vendor';
            }

            // Form libraries
            if (id.includes('react-hook-form') || id.includes('zod')) {
              return 'form-vendor';
            }

            // Utility libraries
            if (id.includes('date-fns') || id.includes('lucide-react') ||
                id.includes('react-hot-toast') || id.includes('react-use')) {
              return 'util-vendor';
            }

            // Firebase (separate from main bundle)
            if (id.includes('firebase')) {
              return 'firebase-vendor';
            }

            // All other node_modules go to vendor chunk
            return 'vendor';
          }

          // Admin pages in separate chunk (they're heavy)
          if (id.includes('src/pages/admin/') || id.includes('src/components/admin/')) {
            return 'admin';
          }

          // Gallery pages in separate chunk
          if (id.includes('Gallery') && id.includes('src/pages/')) {
            return 'gallery-pages';
          }
        }
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
    chunkSizeWarningLimit: 800, // Reasonable limit for modern web apps
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
