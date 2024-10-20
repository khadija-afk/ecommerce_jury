import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Port sur lequel Vite écoutera
    host: '0.0.0.0', // Permettre les connexions externes
    hmr: {
      protocol: 'ws',   // Utiliser le protocole WebSocket
      host: '0.0.0.0',
      port: 3000,       // Port WebSocket, doit correspondre à celui utilisé par ton serveur
    },
  },
  envDir: './'
})
