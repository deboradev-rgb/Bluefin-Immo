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
        rewrite: (path) => {
          // ⚠️ Conserver le chemin exact sans modification
          // /api/properties → /api/v1/properties
          // /api/auth/me → /api/v1/auth/me
          // /api/traveler/favorites → /api/v1/traveler/favorites
          const newPath = path.replace(/^\/api/, '/api/v1');
          console.log('🔄 PROXY:', path, '→', newPath);
          return newPath;
        },
      },
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
})