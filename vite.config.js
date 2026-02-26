import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Enable source map for production debugging (optional, remove for max perf)
    sourcemap: false,
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Manual chunk splitting for optimal caching
        manualChunks: {
          // React core - changes rarely, cache for long time
          'react-vendor': ['react', 'react-dom'],
          // Router - separate chunk
          'router': ['react-router-dom'],
          // Icons - large library, cache separately
          'icons': ['react-icons'],
          // Toast notifications
          'toast': ['react-hot-toast'],
          // Helmet for SEO
          'helmet': ['react-helmet-async'],
          // Axios
          'axios': ['axios'],
          // Lottie (heavy, only used in 404 page — split to own cached chunk)
          'lottie': ['lottie-react', 'lottie-web'],
        },
      },
    },
    // CSS code splitting
    cssCodeSplit: true,
    // Minification
    minify: 'esbuild',
    // Target modern browsers for smaller output
    target: 'esnext',
  },
  // Optimize dependencies pre-bundling
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios',
      'react-hot-toast',
      'react-helmet-async',
    ],
  },
})
