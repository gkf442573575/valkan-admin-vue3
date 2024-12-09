<template>
  <div :class="['vk-layout-menus default', isCollapse ? 'collapse' : '']">
    <div class="vk-layout-menus__box">
      <AppMenus :collapse="isCollapse" :menus-tree="appMenusTree" />
      <el-icon
        :class="['vk-collapse-icon', isCollapse ? 'collapse' : 'expand']"
        @click="emits('collapse')"
      >
        <ArrowRightBold />
      </el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowRightBold } from '@element-plus/icons-vue'

import { storeToRefs } from 'pinia'

import { useAuthStore } from '@/stores/auth'

import AppMenus from './components/app-menus.vue'

defineProps<{
  isCollapse: boolean
}>()

const emits = defineEmits<{
  (e: 'collapse'): void
}>()

const { appMenusTree } = storeToRefs(useAuthStore())

defineOptions({
  name: 'vk-layout-menus__default'
})
</script>
