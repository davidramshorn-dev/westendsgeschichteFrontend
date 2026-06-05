import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/interactiveMap/', // <-- Wichtig, damit die Skripte im Unterordner gesucht werden
})

