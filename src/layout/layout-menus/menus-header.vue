<template>
  <div class="vk-layout-menus__header">
    <AppMenus :menus-tree="appMenusTree" mode="horizontal" v-if="layout === 'menuhead'" />
    <BreadCrumb v-else />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useThemeStore } from '@/stores/theme'
import { useAuthStore } from '@/stores/auth'

import AppMenus from './components/app-menus.vue'
import BreadCrumb from '../components/bread-crumb.vue'

const { appMenusTree } = storeToRefs(useAuthStore())
const { layout } = storeToRefs(useThemeStore())

defineOptions({
  name: 'vk-layout-menus__header'
})
</script>
