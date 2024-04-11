import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'

export default defineConfig({
  build: {
    /* https://rollupjs.org/configuration-options/#output-manualchunks */
    rollupOptions: {
      output: {
        manualChunks: {
          lodash: ['lodash-es'],
          '@antv/g2': ['@antv/g2'],
          '@antv/g2plot': ['@antv/g2plot'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [vue({}), vueJsx({})],
  test: {
    include: ['test/unit/**/*.{test,spec}.ts', 'test/contract/**/*.{test,spec}.ts'],
  },
})
