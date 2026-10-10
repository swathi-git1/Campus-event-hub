import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(async ({ command }) => {
  const plugins = [react()]
  if (command === 'serve') {
    const { campusApiPlugin } = await import('./server/vitePlugin.js')
    plugins.push(campusApiPlugin())
  }

  return {
    plugins,
    server: {
      host: true,
      allowedHosts: true,
    },
    preview: {
      host: true,
      allowedHosts: true,
    },
    resolve: {
      // Keep React and React DOM on a single module instance. This prevents
      // invalid-hook-call failures when dependencies are optimized separately.
      dedupe: ['react', 'react-dom'],
    },
  }
})
