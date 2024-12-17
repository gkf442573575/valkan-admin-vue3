<template>
  <template v-for="item in menusTree" :key="item.id">
    <el-sub-menu :index="item.id" v-if="item.children && item.children.length">
      <template #title>
        <el-icon><park-icon :icon="item.icon" :size="18"></park-icon></el-icon>
        <span class="vk-menu-title">{{ $t(item.title || '') }}</span>
      </template>
      <vk-sub-menu :menus-tree="item.children"></vk-sub-menu>
    </el-sub-menu>
    <el-menu-item v-else :index="item.id">
      <el-icon><park-icon :icon="item.icon" :size="18"></park-icon></el-icon>
      <template #title>
        <span class="vk-menu-title">{{ $t(item.title || '') }}</span>
      </template>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import type { MenusTree } from '@/interfaces/index'

import { type PropType } from 'vue'

defineProps({
  menusTree: {
    type: Array as PropType<MenusTree[]>,
    default: () => []
  }
})

defineOptions({
  name: 'vk-sub-menu'
})
</script>
