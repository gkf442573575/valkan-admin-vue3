<template>
  <div class="vk-layout-header flex items-center">
    <div class="font-semibold text-xl text-primary pr-4">{{ APP_TITLE }}</div>
    <!--header-->
    <MenusHeader />
    <!-- 是否展示tab -->
    <div class="vk-toggle-tab w-10 h-10 mr-3 flex items-center justify-center" @click="visibleTab = !visibleTab">
      <span
        class="relative inline-block w-[26px] h-[26px] cursor-pointer rounded-full bg-error shadow-[0_0_10px_0_var(--el-color-error-light-5)]"
        :class="[visibleTab ? 'open' : '']"
      ></span>
    </div>
    <!--refresh 只有tab隐藏的时候显示-->
    <LayoutHeaderIcon title="刷新页面">
      <Refresh />
    </LayoutHeaderIcon>
    <!-- 布局类型 -->
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
            class="w-1/2 h-[90px] p-[10px] float-left relative"
            :class="[item.type]"
            @click="() => themeStore.switchLayout(item.type)"
          >
            <div
              class="w-[100px] h-full cursor-pointer mx-auto p-2 rounded-[6px] border-2 shadow-[0_0_10px_var(--el-color-primary-light-7)] hover:shadow-[0_0_10px_var(--el-color-primary-light-5)]"
              :class="[layout === item.type ? 'border-primary' : 'border-transparent']"
            >
              <div
                class="head w-full h-[15px] mb-[5px] rounded"
                :class="[item.type === 'menuhead' ? 'bg-primary' : 'bg-primary-light-2']"
              ></div>
              <div class="main h-[30px] flex">
                <div
                  v-for="child in item.main"
                  :key="`${item.type}_${child}`"
                  class="rounded h-full w-[15px] mr-[5px]"
                  :class="[
                    child,
                    child === 'body'
                      ? 'flex-1 bg-primary-light-7 border border-dashed border-primary-light-3 mr-0'
                      : child === 'aside'
                        ? 'bg-primary'
                        : 'bg-primary-light-3'
                  ]"
                ></div>
              </div>
            </div>
            <el-icon
              class="absolute bottom-[12px] right-[18px]"
              :class="[layout === item.type ? 'block' : 'hidden']"
              color="var(--el-color-primary)"
              size="20"
              ><CircleCheckFilled
            /></el-icon>
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

import { Sunny, Moon, CircleCheckFilled } from '@element-plus/icons-vue'

// import LayoutTab from '../components/layout-tab.vue'
import Avatar from '../components/avatar.vue'
import MenusHeader from '../layout-menus/menus-header.vue'
import LayoutHeaderIcon from '../components/header-icon.vue'

import { THEME_COLOR_LIST, LAYOUT_LIST } from '@/constants/index'

import { useThemeStore } from '@/stores/theme'

const APP_TITLE = import.meta.env.VITE_APP_TITLE
const visibleTab = defineModel<boolean>('visibleTab', { default: false })

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
.vk-toggle-tab {
  span {
    &:before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      transition: all 0.2s cubic-bezier(0, -1.85, 0.27, 1.75);
      width: 16px;
      height: 4px;
      border-radius: 4px;
      background-color: #fff;
    }
    &.open {
      background-color: var(--el-color-success);
      box-shadow: 0 0 10px 0 var(--el-color-success-light-5);
      &::before {
        height: 16px;
        border-radius: 50%;
        background-color: var(--el-color-success);
        box-shadow: inset 0 0 0 2px #fff;
      }
    }
  }
}
</style>
