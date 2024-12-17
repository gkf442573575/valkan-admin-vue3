import { defineStore } from 'pinia'
import { useNavigatorLanguage } from '@vueuse/core'

import storage from '@/utils/storage'

export const LANG_STORE_KEY = `VK_LANG_${import.meta.env.VITE_APP_CODE}`

export const useAppStore = defineStore('vk-app', () => {
  const { language } = useNavigatorLanguage()
  // 先只支持中文/ 英文
  const setLanguage = (lang: string) => {
    if (lang.indexOf('zh') > -1) {
      lang = 'zh-CN'
    } else {
      lang = 'en'
    }
    language.value = lang
    storage.set(LANG_STORE_KEY, lang)
  }

  // 初始化语言
  const initLanguage = () => {
    const store_lang = storage.get(LANG_STORE_KEY)
    const lang = store_lang || navigator.language || language.value || 'zh-CN'
    setLanguage(lang)
  }
  return {
    language,
    initLanguage,
    setLanguage
  }
})
