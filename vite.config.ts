import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// import VueDevTools from 'vite-plugin-vue-devtools'

import { envParse } from 'vite-plugin-env-parse'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { viteStaticCopy } from 'vite-plugin-static-copy'

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
      }),
      viteStaticCopy({
        // 从node_modules里面copy出去 优化掉css，css 体量减小
        targets: [
          {
            src: [
              'node_modules/element-plus/dist/index.css',
              'node_modules/element-plus/theme-chalk/dark/css-vars.css'
            ],
            dest: 'libs/element-plus'
          }
        ]
      })
    ],
    build: {
      assetsDir: 'sources',
      chunkSizeWarningLimit: 3072,
      rollupOptions: {
        output: {
          manualChunks: {
            vueVendor: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
            iconPark: ['@icon-park/vue-next'],
            elementPlus: ['element-plus'],
            elementIcon: ['@element-plus/icons-vue'],
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
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler' // modern
        }
      }
    },
  }
})
