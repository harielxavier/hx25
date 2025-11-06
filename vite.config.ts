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
          // Aggressive chunking for maximum performance
          if (id.includes('node_modules')) {
            // All React packages together to ensure proper loading order
            // CRITICAL: Include charting libraries with React to ensure React.forwardRef is available
            if (id.includes('react/') || id.includes('react-dom/') || id.includes('scheduler') ||
                id.includes('react-router') || id.includes('react-hot-toast') ||
                id.includes('react-hook-form') || id.includes('react-helmet') ||
                id.includes('react-chartjs-2') || id.includes('recharts') || id.includes('chart.js')) {
              return 'vendor-react';
            }
            // UI Heavy - separate chunk
            if (id.includes('@mui') || id.includes('@emotion') || id.includes('framer-motion')) {
              return 'vendor-ui';
            }
            // Icons - separate chunk
            if (id.includes('react-icons') || id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            // Firebase - separate chunk
            if (id.includes('firebase')) {
              return 'vendor-firebase';
            }
            // Supabase - separate chunk
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            // Editor - only for admin
            if (id.includes('react-quill') || id.includes('quill')) {
              return 'vendor-editor';
            }
            // Payment - only for booking
            if (id.includes('@stripe')) {
              return 'vendor-stripe';
            }
            // Gallery - only for gallery pages
            if (id.includes('photoswipe') || id.includes('react-photoswipe')) {
              return 'vendor-gallery';
            }
            // 3D - only for specific pages
            if (id.includes('three') || id.includes('@react-three')) {
              return 'vendor-3d';
            }
            // DND - only for admin
            if (id.includes('@dnd-kit') || id.includes('react-dnd')) {
              return 'vendor-dnd';
            }
            // Calendar - only for booking
            if (id.includes('fullcalendar') || id.includes('react-calendar')) {
              return 'vendor-calendar';
            }
            // Heavy individual libraries - separate chunks
            if (id.includes('swiper')) {
              return 'vendor-swiper';
            }
            if (id.includes('sharp') || id.includes('canvas') || id.includes('jspdf')) {
              return 'vendor-image-processing';
            }
            if (id.includes('react-photoswipe') || id.includes('photoswipe')) {
              return 'vendor-gallery';
            }
            if (id.includes('react-share') || id.includes('react-ga4')) {
              return 'vendor-social';
            }
            if (id.includes('react-use') || id.includes('react-intersection-observer') ||
                id.includes('react-lazy-load') || id.includes('react-loading-skeleton')) {
              return 'vendor-react-extras';
            }
            if (id.includes('emailjs') || id.includes('qrcode')) {
              return 'vendor-communication';
            }
            // Utils and small libs
            if (id.includes('date-fns') || id.includes('axios') || id.includes('clsx') ||
                id.includes('zod') || id.includes('mime-types') || id.includes('tailwind-merge')) {
              return 'vendor-utils';
            }
            // All other vendor libraries - should be much smaller now
            return 'vendor-misc';
          }
        },
        // Aggressive caching strategy
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
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
      'react-chartjs-2'
    ],
    exclude: ['lucide-react'],
    // Ensure React is available to all dependencies
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
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
