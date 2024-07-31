import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Component from 'unplugin-vue-components/vite'
import { PrimeVueResolver } from '@primevue/auto-import-resolver'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Component({
      resolvers: [PrimeVueResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': __dirname + '/src',
    },
    extensions: ['.js', '.json', '.ts', '.tsx'],
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/assets/styles/common.scss";`,
      },
    },
  },
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    host: '0.0.0.0',
    strictPort: true,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ['**/src-tauri/**'],
    },
  },
})
