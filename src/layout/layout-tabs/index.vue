<template>
  <div class="vk-layout-tabs w-full overflow-hidden bg-el border-b border-el px-4">
    <el-tabs
      v-model="activeTab"
      @tab-change="(name) => router.push(String(name))"
      @tab-remove="(name) => tabsStore.removeTab(String(name), router)"
    >
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
              <span class="pt-[2px]">{{ $t(item.title || '') }}</span>
            </div>
            <!-- 右键菜单 -->
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :icon="Refresh" @click="refresh">刷新</el-dropdown-item>
                <el-dropdown-item
                  divided
                  v-if="index !== 0"
                  :icon="DArrowLeft"
                  @click="tabsStore.removeTab(item.path, router, 'left')"
                >
                  关闭左侧
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="index !== tabList.length - 1"
                  :divided="index === 0"
                  :icon="DArrowRight"
                  @click="tabsStore.removeTab(item.path, router, 'right')"
                >
                  关闭右侧
                </el-dropdown-item>
                <el-dropdown-item
                  :icon="CircleClose"
                  divided
                  @click="tabsStore.removeTab(item.path, router)"
                  v-if="item.close"
                >
                  关闭当前
                </el-dropdown-item>
                <el-dropdown-item
                  :icon="Remove"
                  :divided="!item.close"
                  @click="tabsStore.removeTab(item.path, router, 'other')"
                >
                  关闭其他
                </el-dropdown-item>
                <el-dropdown-item
                  :icon="Clear"
                  @click="tabsStore.removeTab(item.path, router, 'all')"
                >
                  关闭所有
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <div v-else class="vk-layout-tab__label flex items-center h-full">
            <park-icon class="mr-1" :icon="item.icon" size="16"></park-icon>
            <span class="pt-[1px]">{{ $t(item.title || '') }}</span>
          </div>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, inject, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

import { Refresh, CircleClose, DArrowLeft, DArrowRight, Remove } from '@element-plus/icons-vue'
import { Clear } from '@icon-park/vue-next'

import { useTabsStore } from '@/stores/tabs'
const route = useRoute()
const router = useRouter()

const tabsStore = useTabsStore()

const { tabList, activeTab } = storeToRefs(tabsStore)

const refresh = inject('refresh') as () => void

// 观察路径变化
watch(
  () => route.fullPath,
  async (newVal, oldVal) => {
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
