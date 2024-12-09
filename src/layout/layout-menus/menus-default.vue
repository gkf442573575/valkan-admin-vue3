<template>
  <div :class="['vk-layout-menus default', isFold ? 'fold' : '']">
    <div class="vk-layout-menus__box w-full h-full overflow-y-hidden">
      <AppMenus class="w-full h-full overflow-y-auto" :collapse="isFold" :menus-tree="appMenusTree" />
      <el-icon
        :class="['vk-collapse-icon', isFold ? 'fold' : 'expand']"
        @click="emits('fold')"
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
  isFold: boolean
}>()

const emits = defineEmits<{
  (e: 'fold'): void
}>()

const { appMenusTree } = storeToRefs(useAuthStore())

defineOptions({
  name: 'vk-layout-menus__default'
})
</script>
