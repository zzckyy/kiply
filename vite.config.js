import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import bulma from'bulma'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), bulma()]
})
