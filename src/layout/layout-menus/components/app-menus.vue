<template>
  <el-menu
    class="vk-menus"
    :default-active="active"
    :mode="mode"
    :collapse="collapse"
    @select="select"
  >
    <SubMenu :menus-tree="menusTree" />
  </el-menu>
</template>

<script setup lang="ts">
import type { MenusTree } from '@/interfaces/index'
import { type PropType } from 'vue'

import { useAppMenus } from '../hooks/menu'

import SubMenu from './sub-menu.vue'

defineProps({
  mode: {
    type: String as () => 'vertical' | 'horizontal',
    default: 'vertical'
  },
  collapse: {
    type: Boolean,
    default: false
  },
  menusTree: {
    type: Array as PropType<MenusTree[]>,
    default: () => []
  }
})

const { active, select } = useAppMenus()

defineOptions({
  name: 'vk-app-menus'
})
</script>
