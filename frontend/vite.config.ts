import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',  // frontend 폴더 내에 dist 생성
  },
  server: {
    port: 5173,
  }
})