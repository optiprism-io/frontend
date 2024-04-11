import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'

export default defineConfig({
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
