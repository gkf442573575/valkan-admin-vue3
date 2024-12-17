import type { LATYOUT_TYPE } from '@/interfaces'

import { defineStore } from 'pinia'

import storage from '@/utils/storage'
import { nextLevelColor } from '@/utils'
import { DEFAULT_PRIMARY } from '@/constants/index'

const THEME_KEY = `VK_THEME_${import.meta.env.VITE_APP_CODE}`

export interface LocalTheme {
  primary: string // 主题颜色
  isDark: boolean // 是否暗黑主题
  primaryList: string[] // 主题颜色列表
  primaryDark2: string // 主题颜色的dark2
  layout: LATYOUT_TYPE
}

export const useThemeStore = defineStore('vk-theme', {
  state: (): LocalTheme => {
    return {
      isDark: false,
      primary: DEFAULT_PRIMARY,
      primaryList: [],
      primaryDark2: '',
      layout: 'default'
    }
  },
  actions: {
    storeTheme() {
      storage.set(THEME_KEY, {
        primary: this.primary,
        isDark: this.isDark,
        layout: this.layout
      })
    },
    // 切换布局
    switchLayout(layout: LATYOUT_TYPE) {
      this.layout = layout
      this.storeTheme()
    },
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
      // 暗黑模式下主题颜色
      this.primaryDark2 = nextLevelColor(val, this.isDark ? 2 : 3, this.isDark)
      document.documentElement.style.setProperty('--el-color-primary-dark-2', this.primaryDark2)
      // 颜色加深或变浅
      for (let i = 1; i <= 9; i++) {
        const color = nextLevelColor(val, i, this.isDark)
        document.documentElement.style.setProperty(`--el-color-primary-light-${i}`, color)
        this.primaryList.push(color)
      }
      // 设置参数
      this.primary = val
      this.storeTheme()
    },
    // 初始化主题
    initTheme() {
      const storeTheme = storage.get(THEME_KEY)
      const localTheme: LocalTheme = storeTheme ? JSON.parse(storeTheme) : {
        primary: DEFAULT_PRIMARY,
        isDark: false,
        layout: 'default',
      }

      this.primary = localTheme.primary || DEFAULT_PRIMARY
      this.isDark = localTheme.isDark || false
      this.layout = localTheme.layout || 'default'
      this.switchDark(this.isDark)
    }
  }
})
