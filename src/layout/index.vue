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
          ref="layoutViewRef"
          :class="[
            visibleTab ? (layout === 'menuhead' ? 'h-full' : 'h-[calc(100%_-_41px)]') : 'h-full'
          ]"
        >
          <el-scrollbar class="p-2">
            <router-view v-slot="{ Component, route }">
              <transition appear name="fade-transform" mode="out-in">
                <keep-alive :include="keepAliveName">
                  <component :is="Component" v-if="isShowRoute" :key="route.fullPath" />
                </keep-alive>
              </transition>
            </router-view>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { provide, ref } from 'vue'
import { storeToRefs } from 'pinia'

import LayoutHeader from './layout-header/index.vue'
import LayoutMenus from './layout-menus/index.vue'
import LayoutTabs from './layout-tabs/index.vue'

import BreadCrumb from './components/bread-crumb.vue'

import { useThemeStore } from '@/stores/theme'

const layoutViewRef = ref<Element>()
const themeStore = useThemeStore()

const { layout } = storeToRefs(themeStore)

// 是否 折叠菜单
const isFold = ref(false)
// 是否显示标签页
const visibleTab = ref(true)
const hasSubAside = ref(false)

// 刷新页面
const isShowRoute = ref(true)

const keepAliveName = ref([])

const subasideChange = (val: boolean) => {
  hasSubAside.value = val
}
const refresh = (val: boolean) => (isShowRoute.value = val)
provide('refresh', refresh)

defineOptions({
  name: 'vk-layout'
})
</script>

<style lang="scss" src="./index.scss"></style>
