<template>
  <div class="vk-layout-tabs w-full overflow-hidden bg-el border-b border-el">
    <el-tabs v-model="tabsMenuValue" type="card" @tab-change="tabChange" @tab-remove="tabRemove">
      <el-tab-pane
        v-for="(item, index) in tabList"
        :key="item.path"
        :name="item.path"
        :closable="item.close"
      >
        <template #label>
          <!-- tabpane label -->
          <el-dropdown trigger="contextmenu" v-if="tabsMenuValue === item.path">
            <span class="vk-layout-tab__label">
              <park-icon class="vk-layout-tab__icon" :icon="item.icon" size="16"></park-icon>
              <span>{{ item.title }}</span>
            </span>
            <!-- 右键菜单 -->
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :icon="Refresh" @click="refresh">刷新</el-dropdown-item>
                <el-dropdown-item :icon="CircleClose" divided @click="tabRemove(item.path)">
                  关闭当前
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="index !== 0"
                  :icon="DArrowLeft"
                  @click="tabStore.removeTabsByIndex(index, 'left')"
                >
                  关闭左侧
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="index !== tabList.length - 1"
                  :icon="DArrowRight"
                  @click="tabStore.removeTabsByIndex(index, 'right')"
                >
                  关闭右侧
                </el-dropdown-item>
                <el-dropdown-item
                  :icon="Remove"
                  divided
                  @click="tabStore.removeTabsByIndex(index, 'other')"
                >
                  关闭其他
                </el-dropdown-item>
                <el-dropdown-item @click="tabStore.closeAllTabs">
                  <span>
                    <park-icon icon="clear"></park-icon>
                    关闭所有
                  </span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <span v-else class="layout-tab-label">
            <park-icon class="tabs-icon" :icon="item.icon" size="16"></park-icon>
            <span>{{ item.title }}</span>
          </span>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import type { TabPaneName } from 'element-plus'

import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { Refresh, CircleClose, DArrowLeft, DArrowRight, Remove } from '@element-plus/icons-vue'

import { useTabsStroe } from '@/stores/layout'

const route = useRoute()
const router = useRouter()

const tabStore = useTabsStroe()

const tabsMenuValue = ref(route.fullPath)

const tabList = computed(() => tabStore.tabList)

// TODO:刷新
const refresh = () => {}

const tabChange = (name: TabPaneName) => {
  // 路径变化
  router.push({
    path: String(name),
    replace: true
  })
}

// 移除tab
const tabRemove = (name: TabPaneName) => {
  name = String(name)
  tabStore.removeTabs(name, tabsMenuValue.value === name)
}

// 观察路径变化
watch(
  () => route.fullPath,
  (newVal, oldVal) => {
    tabStore.addTabs({
      title: String(route.meta.title || '未命名'),
      name: String(route.name),
      path: route.fullPath,
      icon: String(route.meta.icon || 'application-menu'),
      close: !!(route.meta.close || true),
      keepAlive: !!route.meta.keepAlive
    })
    tabsMenuValue.value = newVal
  },
  {
    immediate: true
  }
)

defineOptions({
  name: 'LayoutTabs'
})
</script>
