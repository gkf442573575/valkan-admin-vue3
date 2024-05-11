<template>
  <div :class="['vk-layout-menus default', isCollapse ? 'collapse' : '']">
    <div class="vk-layout-menus__box">
      <AppMenus :collapse="isCollapse" :menus-tree="appMenusTree" />
      <el-icon
        :class="['vk-collapse-icon', isCollapse ? 'collapse' : 'expand']"
        @click="layoutStore.changeCollapse(!isCollapse)"
      >
        <ArrowRightBold />
      </el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowRightBold } from '@element-plus/icons-vue'

import { storeToRefs } from 'pinia'

import { useLayoutStore } from '@/stores/layout'
import { useAuthStore } from '@/stores/auth'

import AppMenus from './components/app-menus.vue'

const layoutStore = useLayoutStore()
const { isCollapse } = storeToRefs(layoutStore)

const { appMenusTree } = storeToRefs(useAuthStore())

defineOptions({
  name: 'vk-layout-menus__default'
})
</script>
