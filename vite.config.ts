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
        target: 'https://legally-actual-mollusk.ngrok-free.app',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
