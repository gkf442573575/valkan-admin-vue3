import { defineStore } from 'pinia'

import storage from '@/utils/storage'
import { getLightColor, getDarkColor } from '@/utils/theme-tool'
import { DEFAULT_PRIMARY } from '@/config/index'

const THEME_KEY = `THEME_CONFIG_${import.meta.env.VITE_APP_CODE}`

export interface LocalTheme {
  primary: string // 主题颜色
  isDark: boolean // 是否暗黑主题
}

export const useThemeStore = defineStore('vk-theme', {
  state: (): LocalTheme => {
    return {
      isDark: false,
      primary: DEFAULT_PRIMARY
    }
  },
  actions: {
    // 切换dark/light模式
    switchDark(isDark: boolean) {
      this.isDark = isDark
      const html = document.documentElement
      if (this.isDark) {
        html.setAttribute('class', 'dark')
      } else {
        html.setAttribute('class', '')
      }
      this.changePrimary(this.primary)
    },
    // 修改主题
    changePrimary(val: string | null) {
      if (!val) {
        val = DEFAULT_PRIMARY
      }
      // 为了兼容暗黑模式下主题颜色也正常，以下方法计算主题颜色 由深到浅 的具体颜色
      document.documentElement.style.setProperty('--el-color-primary', val)
      document.documentElement.style.setProperty(
        '--el-color-primary-dark-2',
        this.isDark ? `${getLightColor(val, 0.2)}` : `${getDarkColor(val, 0.3)}`
      )
      // 颜色加深或变浅
      for (let i = 1; i <= 9; i++) {
        document.documentElement.style.setProperty(
          `--el-color-primary-light-${i}`,
          this.isDark ? `${getDarkColor(val, i / 10)}` : `${getLightColor(val, i / 10)}`
        )
      }
      // 设置参数
      this.primary = val
      storage.set(THEME_KEY, {
        primary: val,
        isDark: this.isDark
      })
    },
    // 初始化主题
    initTheme() {
      const storeTheme = storage.get(THEME_KEY)
      const localTheme: LocalTheme = (storeTheme && JSON.parse(storeTheme)) || {
        primary: DEFAULT_PRIMARY,
        isDark: false
      }
      this.primary = localTheme.primary
      this.isDark = localTheme.isDark
      this.switchDark(this.isDark)
    }
  }
})
