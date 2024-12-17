<template>
  <div class="vk-layout w-full h-full overflow-hidden">
    <LayoutHeader v-model:visible-tab="visibleTab" />
    <div class="vk-layout-main relative overflow-hidden bg-page">
      <LayoutMenus
        v-if="layout !== 'menuhead'"
        :layout="layout"
        :is-fold="isFold"
        @fold="isFold = !isFold"
        @subaside-change="subasideChange"
      />
      <div
        :class="[
          'vk-layout-body w-full h-full overflow-hidden',
          layout,
          isFold ? 'fold' : '',
          hasSubAside ? '' : 'no-subaside'
        ]"
      >
        <LayoutTabs v-show="visibleTab" />
        <div class="h-10 bg-el flex items-center px-2" v-if="!visibleTab && layout === 'menuhead'">
          <BreadCrumb />
        </div>
        <div
          class="vk-layout-views overflow-hidden"
          :class="[
            visibleTab ? (layout === 'menuhead' ? 'h-full' : 'h-[calc(100%_-_41px)]') : 'h-full'
          ]"
        >
          <el-scrollbar class="p-2">
            <router-view v-slot="{ Component, route }">
              <keep-alive :include="keepAliveName">
                <component
                  v-if="isShowRoute"
                  :is="componentInstance(Component, route)"
                  :key="route.fullPath"
                />
              </keep-alive>
            </router-view>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, provide, ref, h, type VNode } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, type RouteLocationNormalizedLoadedGeneric } from 'vue-router'

import LayoutHeader from './layout-header/index.vue'
import LayoutMenus from './layout-menus/index.vue'
import LayoutTabs from './layout-tabs/index.vue'

import BreadCrumb from './components/bread-crumb.vue'

import { useThemeStore } from '@/stores/theme'
import { useKeepAliveStore } from '@/stores/keep-alive'

const themeStore = useThemeStore()
const keepAliveStore = useKeepAliveStore()

const { layout } = storeToRefs(themeStore)
const { keepAliveName } = storeToRefs(keepAliveStore)

const $route = useRoute()
// 是否 折叠菜单
const isFold = ref(false)
// 是否显示标签页
const visibleTab = ref(true)
// 是否有二级菜单
const hasSubAside = ref(false)

// 刷新页面
const isShowRoute = ref(true)
const subasideChange = (val: boolean) => {
  hasSubAside.value = val
}

// 动态组件缓存问题
const wrapperMap = new Map()
const componentInstance = (Component: VNode<any>, route: RouteLocationNormalizedLoadedGeneric) => {
  if(!Component) return
  let wrapper
  const wrapperName = route.path
  if (wrapperMap.has(wrapperName)) {
    wrapper = wrapperMap.get(wrapperName)
  } else {
    wrapper = {
      name: wrapperName,
      render() {
        return h(Component)
      }
    }
    wrapperMap.set(wrapperName, wrapper)
  }
  return wrapper
}

// 刷新页面
const refresh = () => {
  setTimeout(async () => {
    const keepAlive = !!$route.meta.keepAlive
    keepAlive && keepAliveStore.removeKeepAliveName($route.fullPath)
    isShowRoute.value = false
    await nextTick()
    keepAlive && keepAliveStore.addKeepAliveName($route.fullPath)
    isShowRoute.value = true
  }, 0)
}
provide('refresh', refresh)

defineOptions({
  name: 'vk-layout'
})
</script>

<style lang="scss" src="./index.scss"></style>
