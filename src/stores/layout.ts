import { ref } from 'vue'
import { defineStore } from 'pinia'
import storage from '@/utils/storage'

export const LAYOUT_KEY = `LAYOUT_KEY_${import.meta.env.VITE_APP_CODE}`

interface LoaclLayout {
  layout: string
  visibleTabs: boolean
}

interface LayoutParams {
  layout?: string
  visibleTabs?: boolean
}

export const useLayoutStore = defineStore('vk-layout', () => {
  const layout = ref('default')
  const isExpand = ref(true)
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
  const changeExpand = (val: boolean) => {
    isExpand.value = val
  }

  // 视图变化高度
  const changeViewHeight = (val: number) => {
    viewHeight.value = val
  }

  return {
    isExpand,
    layout,
    visibleTabs,
    viewHeight,
    initLayout,
    setLayout,
    changeExpand,
    changeViewHeight
  }
})
