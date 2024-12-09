<template>
  <div class="vk-layout-header flex items-center">
    <div class="font-semibold text-xl text-primary pr-4">{{ APP_TITLE }}</div>
    <!--header-->
    <MenusHeader />
    <!-- 是否展示tab -->
    <LayoutTab />
    <!--refresh 只有tab隐藏的时候显示-->
    <LayoutHeaderIcon title="刷新页面">
      <Refresh />
    </LayoutHeaderIcon>
    <!-- 布局类型 -->
    <LayoutType />
    <el-popover placement="bottom" title="布局样式" :width="290" trigger="click">
      <template #reference>
        <LayoutHeaderIcon :use-tooltip="false">
          <LayoutFour />
        </LayoutHeaderIcon>
      </template>
      <template #default>
        <ul class="overflow-hidden">
          <li
            v-for="item in LAYOUT_LIST"
            :key="item.type"
            class="vk-layout-style w-1/2 p-[10px] float-left"
            :class="[item.type]"
          >
            <div class="vk-layout-style_item w-[100px] h-[70px]">
              <div class="head"></div>
              <div class="main">
                <div v-for="child in item.main" :key="`${item.type}_${child}`" :class="child"></div>
              </div>
            </div>
          </li>
        </ul>
      </template>
    </el-popover>
    <!-- full screen -->
    <LayoutHeaderIcon :title="isFullscreen ? '取消全屏' : '全屏'" @click="toggle">
      <OffScreen v-if="isFullscreen" />
      <FullScreen v-else />
    </LayoutHeaderIcon>
    <!-- theme -->
    <LayoutHeaderIcon class="theme" title="主题色">
      <template #default>
        <Theme />
        <el-color-picker
          popper-class="theme-picker"
          size="large"
          v-model="primary"
          :predefine="THEME_COLOR_LIST"
          @change="themeStore.changePrimary"
        />
      </template>
    </LayoutHeaderIcon>
    <!-- switch dark -->
    <el-switch
      class="mr-5"
      v-model="isDark"
      @change="(val) => themeStore.switchDark(val as boolean)"
      inline-prompt
      :active-icon="Sunny"
      :inactive-icon="Moon"
      style="--el-switch-off-color: #2c2c2c"
    />
    <!-- Avatar -->
    <Avatar />
  </div>
</template>

<script setup lang="ts">
import { useFullscreen } from '@vueuse/core'
import { storeToRefs } from 'pinia'

import { Refresh, FullScreen, OffScreen, Theme, LayoutFour } from '@icon-park/vue-next'

import { Sunny, Moon } from '@element-plus/icons-vue'

import LayoutTab from './components/layout-tab.vue'
import LayoutType from './components/layout-type.vue'
import Avatar from './components/avatar.vue'

import MenusHeader from './layout-menus/menus-header.vue'

import LayoutHeaderIcon from './components/header-icon.vue'

const APP_TITLE = import.meta.env.VITE_APP_TITLE

import { THEME_COLOR_LIST, LAYOUT_LIST } from '@/constants/index'

import { useThemeStore } from '@/stores/theme'

const { toggle, isFullscreen } = useFullscreen()
const themeStore = useThemeStore()

const { layout, isDark, primary } = storeToRefs(themeStore)

defineOptions({
  name: 'VkLayoutHeader'
})
</script>

<style lang="scss" scoped>
.vk-layout-header {
  &:deep(.layout-header-icon.theme) {
    .el-color-picker {
      @apply absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0;

      .el-color-picker__trigger {
        @apply border-none;
      }
      .el-color-picker__color {
        border-color: transparent;
      }
      .el-color-picker__empty {
        color: transparent;
      }
      .el-color-picker__color-inner {
        background-color: transparent !important;
      }
      .el-color-picker__icon {
        color: transparent;
      }
    }
  }
}
</style>
