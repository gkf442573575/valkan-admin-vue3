import { ref } from 'vue'
import { defineStore } from 'pinia'

import router from '@/router'

import storage from '@/utils/storage'

import { useAuthStore } from './auth'

export const LAYOUT_KEY = `LAYOUT_KEY_${import.meta.env.VITE_APP_CODE}`

interface LoaclLayout {
  layout: 'default' | 'subaside' | 'menuhead'
  visibleTabs: boolean
}

interface LayoutParams {
  layout?: string
  visibleTabs?: boolean
}

interface TabItem {
  title: string
  name: string
  path: string
  close?: boolean
  icon?: string
  keepAlive?: boolean
}

/**
 * @desc 布局的store
 */
export const useLayoutStore = defineStore('vk-layout', () => {
  const layout = ref('default')
  // 是否折叠
  const isCollapse = ref(false)
  // 中间区域视图高度
  const viewHeight = ref(0)
  // tabs是否可见
  const visibleTabs = ref(true)

  // 初始化布局
  const initLayout = () => {
    const storeLayout = storage.get(LAYOUT_KEY)
    const localLayout: LoaclLayout = (storeLayout && JSON.parse(storeLayout)) || {
      layout: 'default',
      visibleTabs: true
    }
    layout.value = localLayout.layout
    visibleTabs.value = localLayout.visibleTabs
  }

  // 设置布局
  const setLayout = (obj: LayoutParams) => {
    layout.value = 'layout' in obj && obj.layout !== undefined ? obj.layout : layout.value
    visibleTabs.value =
      'visibleTabs' in obj && obj.visibleTabs !== undefined ? obj.visibleTabs : visibleTabs.value
    storage.set(
      LAYOUT_KEY,
      JSON.stringify({ layout: layout.value, visibleTabs: visibleTabs.value })
    )
  }

  // 是否折叠侧边栏
  const changeCollapse = (val: boolean) => {
    isCollapse.value = val
  }

  // 视图变化高度
  const changeViewHeight = (val: number) => {
    viewHeight.value = val
  }

  return {
    isCollapse,
    layout,
    visibleTabs,
    viewHeight,
    initLayout,
    setLayout,
    changeCollapse,
    changeViewHeight
  }
})

/**
 * @desc tabs的store
 */
export const useTabsStroe = defineStore('vk-tabs', () => {
  const tabList = ref<TabItem[]>([])
  const activeKey = ref('')

  const addTabs = (tabItem: TabItem) => {
    // tablist 默认有首页
    if (!tabList.value.length) {
      const authStore = useAuthStore()
      const firstMenu = authStore.appMenusTree[0]
      tabList.value.push({
        title: firstMenu.title || 'Home',
        name: firstMenu.name,
        path: firstMenu.path,
        close: false,
        icon: firstMenu.icon || 'home',
        keepAlive: firstMenu.keepAlive
      })
    }
    // 其他路径
    if (tabList.value.every((item) => item.path !== tabItem.path)) {
      tabList.value.push(tabItem)
    }
  }

  /**
   * @desc 移除路径
   * @param tabPath
   * @param isCurrent 是否是当前路径
   */
  const removeTabs = (tabPath: string, isCurrent: boolean) => {
    // 是否是当前路由
    if (isCurrent) {
      const index = tabList.value.findIndex((item) => item.path === tabPath)
      const nextRoute = tabList.value[index + 1] || tabList.value[index - 1]
      let nextPath = ''
      if (!nextRoute) {
        const authStore = useAuthStore()
        const firstMenu = authStore.appMenusTree[0]
        nextPath = firstMenu.path
      }
      // 下一级路由
      nextPath = nextRoute ? nextRoute.path : nextPath
      if (nextPath !== tabPath) {
        router.push({
          path: nextPath,
          replace: true
        })
      }
    }
    // 如果长度小于1时不进行删除
    if (tabList.value.length > 1) {
      tabList.value = tabList.value.filter((item) => item.path !== tabPath)
    }
  }

  /**
   * @desc 移除掉某个tab
   * @param index
   * @param type
   */
  const removeTabsByIndex = (index: number, type: 'left' | 'right' | 'other') => {
    if (type === 'left') {
      // 左侧删除
      tabList.value.splice(1, index - 1)
    } else if (type === 'right') {
      tabList.value.splice(index + 1)
    } else if (type === 'other') {
      if (index === 0) {
        tabList.value = [tabList.value[0]]
      } else {
        tabList.value = [tabList.value[0], tabList.value[index]]
      }
    }
  }

  /**
   * @desc 移除tabs
   */
  const closeAllTabs = () => {
    const authStore = useAuthStore()
    const firstMenu = authStore.appMenusTree[0]
    tabList.value = [
      {
        title: firstMenu.title || 'Home',
        name: firstMenu.name,
        path: firstMenu.path,
        close: false,
        icon: firstMenu.icon || 'home',
        keepAlive: firstMenu.keepAlive
      }
    ]
    router.push({
      path: firstMenu.path,
      replace: true
    })
  }

  return {
    tabList,
    activeKey,
    addTabs,
    removeTabs,
    removeTabsByIndex,
    closeAllTabs
  }
})

/**
 * @desc keyAlive的store
 */
export const useKeepAliveStore = defineStore('vk-keep-alive', () => {
  const keepAliveName = ref<string[]>([])

  return {
    keepAliveName
  }
})
