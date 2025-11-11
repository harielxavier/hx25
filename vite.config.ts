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
      treeshake: {
        preset: 'recommended',
        moduleSideEffects: true
      },
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
        // Strategic manual chunking for optimal performance
        manualChunks: (id) => {
          // Node modules chunking
          if (id.includes('node_modules')) {
            // Core React ecosystem - MUST BE FIRST
            if (id.includes('react/') || id.includes('react-dom/') ||
                id.includes('/react/') || id.includes('/react-dom/') ||
                id.includes('scheduler') || id.includes('react-is')) {
              return 'react-vendor';
            }

            // Router and navigation - depends on React
            if (id.includes('react-router') || id.includes('react-helmet')) {
              return 'router-vendor';
            }

            // MUI and styling (large UI framework) - depends on React
            if (id.includes('@mui') || id.includes('@emotion')) {
              return 'mui-vendor';
            }

            // Heavy graphics and 3D libraries - depends on React, so keep separate
            if (id.includes('three') || id.includes('@react-three')) {
              return 'graphics-vendor';
            }

            // Motion/animation libraries - these use React context, keep in separate chunk
            if (id.includes('framer-motion') || id.includes('motion/') || id.includes('/motion')) {
              return 'animation-vendor';
            }

            // Data visualization
            if (id.includes('chart.js') || id.includes('recharts') ||
                id.includes('react-chartjs-2')) {
              return 'chart-vendor';
            }

            // Payment and business
            if (id.includes('@stripe') || id.includes('@fullcalendar')) {
              return 'business-vendor';
            }

            // Media and file processing
            if (id.includes('photoswipe') || id.includes('html2canvas') ||
                id.includes('jspdf') || id.includes('jszip') ||
                id.includes('swiper') || id.includes('react-image')) {
              return 'media-vendor';
            }

            // Database and APIs - SPLIT INTO SEPARATE CHUNKS
            if (id.includes('@supabase')) {
              return 'supabase-vendor';
            }

            if (id.includes('firebase')) {
              return 'firebase-vendor';
            }

            if (id.includes('axios')) {
              return 'api-vendor';
            }

            // Form and validation
            if (id.includes('react-hook-form') || id.includes('zod') ||
                id.includes('@hookform') || id.includes('react-quill') ||
                id.includes('quill')) {
              return 'form-vendor';
            }

            // Icons and UI components
            if (id.includes('lucide-react') || id.includes('react-icons') ||
                id.includes('@radix-ui') || id.includes('@dnd-kit') ||
                id.includes('react-dnd')) {
              return 'ui-vendor';
            }

            // Utilities and small libraries
            if (id.includes('date-fns') || id.includes('react-hot-toast') ||
                id.includes('react-use') || id.includes('clsx') ||
                id.includes('@emailjs') || id.includes('bcryptjs')) {
              return 'utils-vendor';
            }

            // Security and monitoring (can be heavy)
            if (id.includes('@sentry') || id.includes('analytics') ||
                id.includes('react-ga4')) {
              return 'monitoring-vendor';
            }

            // PDF and document processing (heavy)
            if (id.includes('jspdf') || id.includes('html2canvas') ||
                id.includes('canvas') || id.includes('sharp')) {
              return 'document-vendor';
            }

            // react-confetti for animation-vendor (already defined above)
            if (id.includes('react-confetti')) {
              return 'animation-vendor';
            }

            // Skip dev-vendor chunk - causes initialization issues
            // These packages should be tree-shaken out in production anyway

            // All other node_modules
            return 'vendor';
          }

          // Application code chunking - split admin by functionality
          if (id.includes('src/pages/admin/') || id.includes('src/components/admin/')) {
            // Analytics and dashboard admin pages
            if (id.includes('Analytics') || id.includes('Dashboard') ||
                id.includes('Traffic') || id.includes('Lead') ||
                id.includes('MissionControl')) {
              return 'admin-analytics';
            }

            // Content management admin pages
            if (id.includes('Blog') || id.includes('Page') ||
                id.includes('Image') || id.includes('Gallery') ||
                id.includes('Universal')) {
              return 'admin-content';
            }

            // Business admin pages
            if (id.includes('Client') || id.includes('Job') ||
                id.includes('Booking') || id.includes('Payment') ||
                id.includes('Invoice') || id.includes('Contract')) {
              return 'admin-business';
            }

            // Settings and configuration
            if (id.includes('Settings') || id.includes('Branding') ||
                id.includes('Integration') || id.includes('SEO')) {
              return 'admin-settings';
            }

            // Default admin chunk
            return 'admin';
          }

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
        drop_console: false, // Keep console for analytics debugging
        drop_debugger: true,
        passes: 2, // Multiple compression passes
      },
      mangle: {
        safari10: true, // Fix Safari 10+ issues
        keep_fnames: false,
      },
      format: {
        comments: false, // Remove all comments
      }
    },
    chunkSizeWarningLimit: 600, // Professional standard for optimal performance
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
