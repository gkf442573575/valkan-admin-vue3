import { createI18n } from "vue-i18n";

import { LANG_STORE_KEY } from '@/stores/app'
import storage from "@/utils/storage";

import zhCN from './locales/zh-CN.json'
import en from './locales/en.json'

const localLanguage = () => {
  const store_lang = storage.get(LANG_STORE_KEY)
  let lang = store_lang || navigator.language || 'zh-CN'
  lang = lang.toLowerCase()
  if(lang.indexOf('zh') > -1) {
    lang = 'zh-CN'
  } else {
    lang = 'en'
  }
  return lang
}

const i18n = createI18n({
  legacy: false,
  globalInjection: true, // 全局注册$t方法
  locale: localLanguage() || 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'en': en
  }
})

export default i18n

// js内使用
export const globalT = i18n.global.t
