<template>
  <div class="vk-toggle-tab" @click="toggleClick">
    <span :class="['toggle', layoutStore.visibleTabs ? 'open' : '']"></span>
  </div>
</template>

<script lang="ts" setup>
import { useLayoutStore } from '@/stores/layout'

const layoutStore = useLayoutStore()

const toggleClick = () => {
  layoutStore.setLayout({ visibleTabs: !layoutStore.visibleTabs })
}

defineOptions({
  name: 'vk-toggle-tab'
})
</script>

<style lang="scss" scoped>
.vk-toggle-tab {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 5px;
  .toggle {
    position: relative;
    display: inline-block;
    width: 26px;
    height: 26px;
    background-color: var(--el-color-error);
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 10px 0 var(--el-color-error-light-5);
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
