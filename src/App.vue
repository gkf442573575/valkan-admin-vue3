<template>
  <RouterView />
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'

// 初始化主题
const themeStore = useThemeStore()
themeStore.initTheme()

defineOptions({
  name: 'vk-admin'
})
</script>
