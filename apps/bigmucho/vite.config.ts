import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: './dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
    dedupe: ['react', 'react-dom', '@react-three/fiber'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'three-vendor': ['three'],
          'r3f-vendor': ['@react-three/fiber', '@react-three/drei'],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
