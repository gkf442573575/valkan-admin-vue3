<template>
  <div class="vk-layout w_10_h_10">
    <LayoutHeader />
    <div :class="['vk-layout-main', layout]">
      <LayoutMenus v-if="layout !== 'menuhead'" :layout="layout" />
      <div
        :class="[
          'vk-layout-body',
          layout,
          isCollapse ? 'collapse' : '',
          visibleTabs ? 'visible-tabs' : ''
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
import { ref, provide } from 'vue'
import { storeToRefs } from 'pinia'

import { useLayoutStore, useKeepAliveStore } from '@/stores/layout'

import LayoutHeader from './layout-header/index.vue'
import LayoutMenus from './layout-menus/index.vue'
import LayoutTabs from './layout-tabs/index.vue'

const { layout, isCollapse, visibleTabs } = storeToRefs(useLayoutStore())
const { keepAliveName } = storeToRefs(useKeepAliveStore())

// 刷新页面
const isShowRoute = ref(true)
const refresh = (val: boolean) => (isShowRoute.value = val)
provide('refresh', refresh)

defineOptions({
  name: 'vk-layout'
})
</script>

<style lang="scss" src="./index.scss"></style>
