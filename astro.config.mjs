// @ts-check
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
  integrations: [vue()],
  output: 'hybrid',
  site: 'https://plantasyflores.online',
  server: {
    port: 4321,
    host: true
  }
});
