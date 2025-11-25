import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: "http://81.68.241.10/api",
        changeOrigin: true,
        rewrite: (path) => {
          console.log(path);
          return path.replace(/^\/api/, '')
        }
      },
      // 静态资源 
      '/static': {
        target: "http://81.68.241.10",
        changeOrigin: true
      },
      // socket
      '/socket': {
        target: "http://81.68.241.10:3001",
        changeOrigin: true
      },
      // ai
      '/ai': {
        target: "http://81.68.241.10:3000",
        changeOrigin: true,
        rewrite: (path) => {
          return path.replace(/^\/ai/, '')
        }
      }
    }
  }
})
