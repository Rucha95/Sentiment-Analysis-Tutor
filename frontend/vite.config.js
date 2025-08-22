import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist'
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'production' 
          ? 'https://your-app.vercel.app' 
          : 'http://localhost:8000',
        changeOrigin: true,
        rewrite: process.env.NODE_ENV === 'development' 
          ? (path) => path.replace(/^\/api/, '') 
          : undefined
      }
    }
  }
})