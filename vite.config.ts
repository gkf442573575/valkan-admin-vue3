import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// import VueDevTools from 'vite-plugin-vue-devtools'

import { envParse } from 'vite-plugin-env-parse'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    base: env.VITE_APP_BASE_PATH,
    plugins: [
      vue(),
      vueJsx(),
      // VueDevTools(),
      envParse(),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [resolve(process.cwd(), 'src/assets/svgs')],
        // 指定symbolId格式
        symbolId: 'svg-icon-[name]'
      })
    ],
    build: {
      assetsDir: 'static',
      chunkSizeWarningLimit: 3072,
      rollupOptions: {
        output: {
          manualChunks: {
            vueVendor: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
            iconPark: ['@icon-park/vue-next'],
            elementPlus: ['element-plus', '@element-plus/icons-vue'],
            vendor: ['qs', 'dayjs', 'lodash', 'class-validator', 'crypto-js', 'js-cookie', 'color'],
            lottieVendor: ['lottie-web', 'lottie-palette']
          }
        }
      }
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})
