import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// GitHub Pages serves the project under /CallForPapersWatch/
export default defineConfig({
  base: '/CallForPapersWatch/',
  plugins: [vue()],
})
