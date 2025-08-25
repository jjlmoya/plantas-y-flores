// @ts-check
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import vercel from '@astrojs/vercel';
import { generateAllCards } from './scripts/generate-plant-cards.js';

// https://astro.build/config
export default defineConfig({
  integrations: [
    vue(),
    {
      name: 'plant-cards-generator',
      hooks: {
        'astro:build:start': async () => {
          console.log('🌱 Generando tarjetas de plantas...')
          try {
            await generateAllCards()
            console.log('✅ Tarjetas de plantas generadas exitosamente')
          } catch (error) {
            console.error('❌ Error generando tarjetas de plantas:', error)
            // No fallar el build, solo avisar
          }
        }
      }
    }
  ],
  output: 'static',
  adapter: vercel(),
  site: 'https://plantasyflores.online',
  build: {
    assets: 'assets'
  },
  server: {
    port: 4321,
    host: true,
    watch: {
      usePolling: true,
      interval: 100
    },
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  },
  vite: {
    server: {
      hmr: {
        overlay: true
      },
      watch: {
        usePolling: true,
        interval: 100
      },
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    },
    css: {
      devSourcemap: true
    },
    build: {
      sourcemap: true,
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'search-chunk': ['./src/components/SearchBox.vue']
          },
          // Force cache busting with hash in filenames
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash].[ext]'
        }
      }
    }
  }
});
