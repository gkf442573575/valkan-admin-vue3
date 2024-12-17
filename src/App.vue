<template>
  <el-config-provider
    :locale="appStore.language ? (appStore.language.indexOf('zh') > -1 ? zhCn : en) : zhCn"
  >
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup lang="ts">
import { watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'

import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'

import { useThemeStore } from '@/stores/theme'
import { useAppStore } from '@/stores/app'

// 初始化主题
const themeStore = useThemeStore()
const appStore = useAppStore()
const i18n = useI18n({useScope: 'global'})

themeStore.initTheme()
appStore.initLanguage()

const language = computed(() => appStore.language || 'zh-CN')

watch(
  () => language.value,
  (val) => {
    i18n.locale.value = val || 'zh-CN'
  },
  {
    immediate: true
  }
)

defineOptions({
  name: 'vk-admin'
})
</script>
