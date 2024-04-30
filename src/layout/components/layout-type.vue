<template>
  <el-popover placement="bottom" title="布局样式" :width="290" trigger="click">
    <template #reference>
      <div class="vk-layout-header_icons" title="布局样式">
        <LayoutFour />
      </div>
    </template>
    <template #default>
      <ul class="vk-layout-styles">
        <!--- 默认菜单 -->
        <li :class="[layoutStore.layout === 'default' ? 'active' : '']">
          <div class="vk-layout-style vk-layout-style__default" @click="setLayout('default')">
            <div class="head"></div>
            <div class="main">
              <div class="aside"></div>
              <div class="body"></div>
            </div>
          </div>
          <el-icon class="vk-layout-style__checked"><CircleCheckFilled /></el-icon>
        </li>
        <!--- 二级菜单 -->
        <li :class="[layoutStore.layout === 'subaside' ? 'active' : '']">
          <div class="vk-layout-style vk-layout-style__subaside" @click="setLayout('subaside')">
            <div class="head"></div>
            <div class="main">
              <div class="aside"></div>
              <div class="sub-aside"></div>
              <div class="body"></div>
            </div>
          </div>
          <el-icon class="vk-layout-style__checked"><CircleCheckFilled /></el-icon>
        </li>
        <!-- 菜单在头部 -->
        <li :class="[layoutStore.layout === 'menuhead' ? 'active' : '']">
          <div class="vk-layout-style vk-layout-style__menuhead" @click="setLayout('menuhead')">
            <div class="head"></div>
            <div class="main">
              <div class="body"></div>
            </div>
          </div>
          <el-icon class="vk-layout-style__checked"><CircleCheckFilled /></el-icon>
        </li>
      </ul>
    </template>
  </el-popover>
</template>

<script setup lang="ts">
import { CircleCheckFilled } from '@element-plus/icons-vue'
import { LayoutFour } from '@icon-park/vue-next'

import { useLayoutStore } from '@/stores/layout'

const layoutStore = useLayoutStore()

const setLayout = (layout: string) => {
  layoutStore.setLayout({ layout })
}

defineOptions({
  name: 'vk-layout-type'
})
</script>

<style lang="scss" scoped>
.layout-head-icons .icon {
  font-size: 22px;
}

.vk-layout-styles {
  overflow: hidden;
  li {
    width: 50%;
    height: 90px;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    float: left;
    position: relative;
    &.active {
      .vk-layout-style {
        border-color: var(--el-color-primary);
      }
      .vk-layout-style__checked {
        display: block;
        color: var(--el-color-primary);
      }
    }
    .vk-layout-style__checked {
      font-size: 16px;
      position: absolute;
      right: 20px;
      bottom: 15px;
      display: none;
    }
    .vk-layout-style {
      width: 100px;
      height: 100%;
      padding: 8px;
      border: 2px solid transparent;
      border-radius: 5px;
      box-shadow: 0 0 10px var(--el-color-primary-light-7);
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      &:hover {
        box-shadow: 0 0 10px var(--el-color-primary-light-5);
      }
      > div {
        border-radius: 4px;
      }
      .head {
        width: 100%;
        height: 15px;
        margin-bottom: 5px;
        background-color: var(--el-color-primary-light-3);
      }
      &.vk-layout-style__default {
        .main {
          .aside {
            width: 22px;
          }
        }
      }
      &.vk-layout-style__menuhead {
        .head {
          background-color: var(--el-color-primary);
        }
      }
      .main {
        width: 100%;
        flex: 1;
        display: flex;
        flex-direction: row;
        > div {
          border-radius: 4px;
        }
        .aside,
        .sub-aside {
          width: 15px;
          height: 100%;
          margin-right: 5px;
          background-color: var(--el-color-primary);
        }
        .sub-aside {
          background-color: var(--el-color-primary-light-3);
        }
        .body {
          flex: 1;
          background-color: var(--el-color-primary-light-7);
          border: 1px dashed var(--el-color-primary-light-3);
        }
      }
    }
  }
}
</style>
