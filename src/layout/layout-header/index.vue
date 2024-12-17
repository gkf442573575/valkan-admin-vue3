<template>
  <div class="vk-layout-header flex items-center bg-el border-el border-b px-4">
    <div class="font-semibold text-xl text-primary pr-4">{{ APP_TITLE }}</div>
    <!--header-->
    <MenusHeader />
    <!-- 是否展示tab -->
    <el-tooltip :content="`${visibleTab ? $t('hide'): $t('show')}Tabs`" placement="bottom">
      <div
        class="vk-toggle-tab w-10 h-10 mx-2 flex items-center justify-center"
        @click="visibleTab = !visibleTab"
      >
        <span
          class="relative inline-block w-[26px] h-[26px] cursor-pointer rounded-full bg-error shadow-[0_0_10px_0_var(--el-color-error-light-5)]"
          :class="[
            visibleTab ? 'open bg-success shadow-[0_0_10px_0_var(--el-color-success-light-5)]' : ''
          ]"
        ></span>
      </div>
    </el-tooltip>
    <!--refresh 只有tab隐藏的时候显示-->
    <LayoutHeaderIcon :title="$t('layout.header.refresh')" v-if="!visibleTab" @click="refresh">
      <Refresh />
    </LayoutHeaderIcon>
    <!-- 布局类型 -->
    <el-popover placement="bottom" :width="290" trigger="hover">
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
    <LayoutHeaderIcon
      :title="isFullscreen ? $t('layout.header.cancle_full') : $t('layout.header.full')"
      @click="toggle"
    >
      <OffScreen v-if="isFullscreen" />
      <FullScreen v-else />
    </LayoutHeaderIcon>
    <!-- theme -->
    <LayoutHeaderIcon class="theme" :title="$t('layout.header.theme')">
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
    <div class="vk-layout-header__divider"></div>
    <!-- 切换语言-->
    <el-popover placement="bottom" trigger="hover" :width="180">
      <template #reference>
        <LayoutHeaderIcon :use-tooltip="false">
          <Translate />
        </LayoutHeaderIcon>
      </template>
      <template #default>
        <ul class="px-2">
          <li
            v-for="item in LANG_LIST"
            :key="item.value"
            class="py-2 border-b border-el last:border-b-0"
            @click="appStore.setLanguage(item.value)"
          >
            <div
              class="cursor-pointer text-center h-7 leading-7 rounded hover:text-primary"
              :class="[appStore.language === item.value ? 'bg-primary-light-9 text-primary' : '']"
            >
              {{ item.label }}
            </div>
          </li>
        </ul>
      </template>
    </el-popover>
    <div class="vk-layout-header__divider"></div>
    <!-- switch dark -->
    <el-switch
      class="ml-3 mr-6"
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
import { inject } from 'vue'
import { useFullscreen } from '@vueuse/core'
import { storeToRefs } from 'pinia'

import { Refresh, FullScreen, OffScreen, Theme, LayoutFour, Translate } from '@icon-park/vue-next'

import { Sunny, Moon, CircleCheckFilled } from '@element-plus/icons-vue'

// import LayoutTab from '../components/layout-tab.vue'
import Avatar from '../components/avatar.vue'
import MenusHeader from '../layout-menus/menus-header.vue'
import LayoutHeaderIcon from '../components/header-icon.vue'

import { THEME_COLOR_LIST, LAYOUT_LIST, LANG_LIST } from '@/constants/index'

import { useThemeStore } from '@/stores/theme'
import { useAppStore } from '@/stores/app'

const APP_TITLE = import.meta.env.VITE_APP_TITLE
const visibleTab = defineModel<boolean>('visibleTab', { default: false })

const { toggle, isFullscreen } = useFullscreen()
const themeStore = useThemeStore()
const appStore = useAppStore()

const { layout, isDark, primary } = storeToRefs(themeStore)

const refresh = inject('refresh') as () => void

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
      @apply w-4 h-1 rounded absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white;
      content: '';
      transition: all 0.2s cubic-bezier(0, -1.85, 0.27, 1.75);
    }
    &.open {
      &::before {
        @apply h-4 rounded-full bg-success;
        box-shadow: inset 0 0 0 2px #fff;
      }
    }
  }
}
.vk-layout-header__divider {
  @apply w-[2px] h-6 bg-br rounded;
}
</style>
