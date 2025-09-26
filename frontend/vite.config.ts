import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.',  // 현재 디렉토리를 root로 설정
  build: {
    outDir: 'dist',  // 빌드 결과물 경로
  },
  server: {
    port: 5173,  // 개발 서버 포트
  }
})