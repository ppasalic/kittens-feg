import { resolve } from 'path';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@assets': resolve(__dirname, './public/assets'),
      '@components': resolve(__dirname, './src/components')
    }
  },
  build: {
    commonjsOptions: { transformMixedEsModules: true }
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@assets/scss/global.scss";`
      }
    }
  }
});
