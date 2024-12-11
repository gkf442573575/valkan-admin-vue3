<template>
  <div class="vk-layout-tabs w-full overflow-hidden bg-el border-b border-el px-4">
    <el-tabs class="" v-model="activeTab" @tab-change="tabChange" @tab-remove="tabRemove">
      <el-tab-pane
        v-for="(item, index) in tabList"
        :key="item.path"
        :name="item.path"
        :closable="item.close"
      >
        <template #label>
          <!-- tabpane label -->
          <el-dropdown class="h-full" trigger="contextmenu" v-if="activeTab === item.path">
            <div class="vk-layout-tab__label h-full flex items-center">
              <park-icon class="mr-1" :icon="item.icon" size="16"></park-icon>
              <span class="pt-[2px]">{{ item.title }}</span>
            </div>
            <!-- 右键菜单 -->
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :icon="Refresh" @click="refresh">刷新</el-dropdown-item>
                <el-dropdown-item divided v-if="index !== 0" :icon="DArrowLeft">
                  关闭左侧
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="index !== tabList.length - 1"
                  :divided="index === 0"
                  :icon="DArrowRight"
                >
                  关闭右侧
                </el-dropdown-item>
                <el-dropdown-item :icon="CircleClose" divided @click="tabRemove(item.path)">
                  关闭当前
                </el-dropdown-item>
                <el-dropdown-item :icon="Remove">关闭其他</el-dropdown-item>
                <el-dropdown-item>
                  <span>
                    <park-icon icon="clear"></park-icon>
                    关闭所有
                  </span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <div v-else class="vk-layout-tab__label flex items-center h-full">
            <park-icon class="mr-1" :icon="item.icon" size="16"></park-icon>
            <span class="pt-[1px]">{{ item.title }}</span>
          </div>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import type { TabPaneName } from 'element-plus'

import { computed, nextTick, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

import { Refresh, CircleClose, DArrowLeft, DArrowRight, Remove } from '@element-plus/icons-vue'

import { useTabsStore } from '@/stores/tabs'

const route = useRoute()
const router = useRouter()

const tabsStore = useTabsStore()

const activeTab = ref(route.fullPath)

const { tabList } = storeToRefs(tabsStore)
// TODO:刷新
const refresh = () => {}

const tabChange = (name: TabPaneName) => {
  router.push({
    path: String(name),
    replace: true
  })
}

// 移除tab
const tabRemove = (name: TabPaneName) => {
  const path = String(name)
  console.log('remove tab >>>', path)
  tabsStore.removeTab(path)
  if (activeTab.value === path) {
    const index = tabList.value.findIndex((item) => item.path === path)
    activeTab.value = tabList.value[index - 1].path
  }
}

// 观察路径变化
watch(
  () => route.fullPath,
  async (newVal, oldVal) => {
    console.log('full path >>>', newVal)
    tabsStore.addTab({
      title: String(route.meta.title || '未命名'),
      path: newVal,
      icon: String(route.meta.icon || 'application-menu'),
      close: true,
      keepAlive: !!route.meta.keepAlive
    })
    await nextTick()
    activeTab.value = newVal
  },
  {
    immediate: true
  }
)

defineOptions({
  name: 'LayoutTabs'
})
</script>
