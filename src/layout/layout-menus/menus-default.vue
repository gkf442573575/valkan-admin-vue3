<template>
  <div :class="['vk-layout-menus default', isCollapse ? 'collapse' : '']">
    <AppMenus :collapse="isCollapse" :menus-tree="appMenusTree" />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useLayoutStore } from '@/stores/layout'
import { useAuthStore } from '@/stores/auth'

import AppMenus from './components/app-menus.vue'

const { isCollapse } = storeToRefs(useLayoutStore())

const { appMenusTree } = storeToRefs(useAuthStore())

defineOptions({
  name: 'vk-layout-menus__default'
})
</script>
