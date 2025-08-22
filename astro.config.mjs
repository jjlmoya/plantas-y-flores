// @ts-check
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  integrations: [vue()],
  output: 'hybrid',
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
      }
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
