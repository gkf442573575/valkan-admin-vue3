<template>
  <el-menu
    v-if="layout === 'menuhead'"
    class="flex-1 px-4 overflow-hidden h-10 app-menus-menuhead"
    mode="horizontal"
    :default-active="active"
    @select="select"
    style="border-bottom: none"
  >
    <template v-for="item in appMenusTree" :key="item.id">
      <el-sub-menu :index="item.id" :key="item.id" v-if="item.children && item.children.length">
        <template #title>
          <el-icon><park-icon :icon="item.icon" :size="18"></park-icon></el-icon>
          <span class="vk-menu-title">{{ $t(item.title || '')}}</span>
        </template>
        <SubMenu :menus-tree="item.children" />
      </el-sub-menu>
      <el-menu-item v-else :index="item.id">
        <el-icon><park-icon :icon="item.icon" :size="18"></park-icon></el-icon>
        <template #title>
          <span class="vk-menu-title">{{ $t(item.title || '') }}</span>
        </template>
      </el-menu-item>
    </template>
  </el-menu>
  <BreadCrumb class="flex-1 px-4" v-else />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useThemeStore } from '@/stores/theme'
import { useAuthStore } from '@/stores/auth'

import { useAppMenus } from './hooks/menu'

import SubMenu from './components/sub-menu.vue'
import BreadCrumb from '../components/bread-crumb.vue'

const { appMenusTree } = storeToRefs(useAuthStore())
const { layout } = storeToRefs(useThemeStore())

const { active, select } = useAppMenus()

defineOptions({
  name: 'vk-layout-menus__header'
})
</script>

<style lang="scss">
.el-menu.app-menus-menuhead.el-menu--horizontal {
  & > .el-menu-item,
  & > .el-sub-menu {
    &.is-active {
      border-bottom: none;
      background: var(--el-color-primary-light-9);
      .el-sub-menu__title {
        border-bottom: none;
      }
      &:hover {
        background: var(--el-color-primary-light-9);
      }
    }
    &:hover {
      background-color: transparent;
    }

    .vk-menu-title {
      margin-top: 1px;
    }
  }
}
</style>
