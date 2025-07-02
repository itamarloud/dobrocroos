import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Porta para o servidor de desenvolvimento do frontend
    proxy: {
      // Proxy para as requisições à API do backend
      '/api': {
        target: 'http://localhost:3001', // Endereço do seu servidor backend
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '') // Se necessário remover /api do path
      }
    }
  }
})
