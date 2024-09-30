<template>
  <div :class="['vk-layout-menus subaside', isCollapse ? 'collapse' : '']">
    <ul class="vk-menus-main no-scrollbar">
      <li v-for="item in mainMenus" :key="item.id" @click="mainChange(item)">
        <el-icon><park-icon :icon="item.icon" :size="18"></park-icon></el-icon>
        <div class="vk-menus-main_label">{{ item.title }}</div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import type { MenusTree } from '@/interfaces'

import { computed } from 'vue'
import { storeToRefs } from 'pinia'

import { useLayoutStore } from '@/stores/layout'
import { useAuthStore } from '@/stores/auth'

import mitt from '@/utils/mitt-bus'

import AppMenus from './components/app-menus.vue'

const layoutStore = useLayoutStore()
const { isCollapse } = storeToRefs(layoutStore)

const { appMenusTree } = storeToRefs(useAuthStore())

const mainMenus = computed(() => {
  return appMenusTree.value.filter((item) => item.isMain)
})

const mainChange = (item: MenusTree) => {
  console.log('main item >>>', item)
  mitt.emit('main-change', item?.children.length || 0)
}

defineOptions({
    name: 'vk-layout-menus__subaside'
})
</script>
