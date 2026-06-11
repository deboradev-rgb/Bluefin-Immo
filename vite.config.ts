import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
 server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'https://api.bluefin-immo.com',
      changeOrigin: true,
      // Correction : ne pas réécrire si l'URL contient déjà /api/v1
      rewrite: (path) => {
        // Si le chemin commence par /api/v1, on le garde tel quel
        if (path.startsWith('/api/v1')) {
          return path;
        }
        // Sinon, on transforme /api/xxx → /api/v1/xxx
        return path.replace(/^\/api/, '/api/v1');
      },
    },
  },

  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
