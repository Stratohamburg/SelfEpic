import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/SelfEpic/',  // GitHub Pages 部署路径，必须与仓库名一致
})