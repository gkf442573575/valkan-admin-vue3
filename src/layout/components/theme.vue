<template>
  <div class="vk-layout-header__icons" title="主题">
    <Theme />
    <el-color-picker
      title="修改主题"
      popper-class="theme-picker"
      size="large"
      v-model="themeStore.primary"
      :predefine="colorList"
      @change="themeStore.changePrimary"
    />
  </div>
  <el-switch
    class="dark-switch"
    v-model="themeStore.isDark"
    @change="themeStore.switchDark"
    inline-prompt
    :active-icon="Sunny"
    :inactive-icon="Moon"
    style="--el-switch-off-color: #2c2c2c"
  />
</template>

<script setup lang="ts">
import { Sunny, Moon } from '@element-plus/icons-vue'
import { Theme } from '@icon-park/vue-next'

import { DEFAULT_PRIMARY } from '@/config/index'
import { useThemeStore } from '@/stores/theme'
// 预定义主题颜色
const colorList = [
  DEFAULT_PRIMARY,
  '#416aea',
  '#DAA96E',
  '#0C819F',
  '#27ae60',
  '#ff5c93',
  '#e74c3c',
  '#fd726d',
  '#f39c12',
  '#9b59b6'
]

const themeStore = useThemeStore()

defineOptions({
  name: 'Theme'
})
</script>

<style lang="less" scoped>
.vk-layout-header__icons {
  position: relative;
  .i-icon-theme {
    font-size: 22px;
  }
  &:deep(.el-color-picker) {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
    .el-color-picker__trigger {
      border: none;
      border-color: transparent;
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
.dark-switch {
  padding: 0 10px;
}
</style>
