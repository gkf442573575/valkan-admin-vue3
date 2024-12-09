<template>
  <div class="vk-layout w-full h-full">
    <LayoutHeader />
    <div :class="['vk-layout-main', layout]">
      <LayoutMenus v-if="layout !== 'menuhead'" :layout="layout"/>
      <div
        :class="[
          'vk-layout-body',
          layout,
          isCollapse ? 'collapse' : '',
          visibleTabs ? 'visible-tabs' : '',
        ]"
      >
        <LayoutTabs v-show="visibleTabs" />
        <div class="vk-layout-views" ref="layoutViewRef">
          <router-view v-slot="{ Component, route }">
            <transition appear name="fade-transform" mode="out-in">
              <keep-alive :include="keepAliveName">
                <component :is="Component" v-if="isShowRoute" :key="route.fullPath" />
              </keep-alive>
            </transition>
          </router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { provide, ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'

import { useLayoutStore, useKeepAliveStore } from '@/stores/layout'

import LayoutHeader from './layout-header.vue'
import LayoutMenus from './layout-menus/index.vue'
import LayoutTabs from './layout-tabs/index.vue'

const layoutStore = useLayoutStore()

const { layout, isCollapse, visibleTabs } = storeToRefs(layoutStore)
const { keepAliveName } = storeToRefs(useKeepAliveStore())

const layoutViewRef = ref<Element>()

// 刷新页面
const isShowRoute = ref(true)
const refresh = (val: boolean) => (isShowRoute.value = val)
provide('refresh', refresh)

// 监听窗口变化
const windowResize = () => {
  if (!layoutViewRef.value) {
    return
  }
  // 监听窗口变化
  const viewH = layoutViewRef.value.clientHeight - 30
  layoutStore.changeViewHeight(viewH)
}

watch(
  () => visibleTabs.value,
  async (val) => {
    await nextTick()
    windowResize()
  },
  { immediate: true }
)

onMounted(() => {
  window.addEventListener('resize', windowResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', windowResize)
})

defineOptions({
  name: 'vk-layout'
})
</script>

<style lang="scss" src="./index.scss"></style>
