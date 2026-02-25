import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['leaflet'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://exe-1-k8ma.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
