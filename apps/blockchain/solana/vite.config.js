import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: '.',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'app.js')
      }
    }
  },
  server: {
    port: 5173,
    host: true
  }
}) 