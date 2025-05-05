import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory
  const env = loadEnv(mode, process.cwd())
  
  return {
    server: {
      proxy: {
        '/api': {
          target: env.VITE_REACT_APP_BACKEND_URL,
          changeOrigin: true,
          secure: false,
          ws: true,
        }
      },
    },
    plugins: [react()],
  }
})