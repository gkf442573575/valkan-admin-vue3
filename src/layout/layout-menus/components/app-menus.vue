<template>
  <div class="vk-app-menus no-scrollbar">
    <el-menu
      class="vk-menus"
      popper-class="vk-menus-popper"
      :default-active="active"
      :mode="mode"
      :collapse="collapse"
      @select="select"
    >
      <SubMenu :menus-tree="menusTree" />
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import type { MenusTree } from '@/types/index'
import { ref, watch, type PropType } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useAuthStore } from '@/stores/auth'

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

const $router = useRouter()
const $route = useRoute()

const { appMenus } = storeToRefs(useAuthStore())

const active = ref<string>('')

const select = (index: any, indexPath: any, item: any) => {
  const menuItem = appMenus.value.find((item) => item.id === index)
  if (menuItem && menuItem.path) {
    $router.push({
      path: menuItem.path
    })
  }
}

watch(
  () => $route.fullPath,
  () => {
    const currentId = ($route.meta.id || '') as string
    active.value = currentId
  },
  {
    immediate: true
  }
)

defineOptions({
  name: 'vk-app-menus'
})
</script>
