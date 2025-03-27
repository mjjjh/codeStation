import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    proxy: {
      '/api': {
        target: "http://localhost:7001",
        changeOrigin: true,
        rewrite: (path) => {
          console.log(path);
          return path.replace(/^\/api/,'')
        }
      },
      // 静态资源
      '/static': {
        target: "http://localhost:7001",
        changeOrigin: true
      }
    }
  }
})
