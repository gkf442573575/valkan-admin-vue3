import { defineStore } from 'pinia'
import { useRoute, type Router } from 'vue-router'

import { useAuthStore } from './auth'

interface TabItem {
  title: string
  path: string
  close?: boolean
  icon?: string
  keepAlive?: boolean
}

export type RemoveType = 'left' | 'right' | 'other' | 'all' | 'current'

export const useTabsStore = defineStore('vk-tabs', {
  state: (): { tabList: TabItem[]; activeTab: string } => {
    const route = useRoute()
    return {
      tabList: [],
      activeTab: route.fullPath
    }
  },
  actions: {
    addTab(tab: TabItem) {
      if (!this.tabList.length) {
        const authStore = useAuthStore()
        const firstMenu = authStore.appMenusTree[0]
        this.tabList.push({
          title: firstMenu.title || '首页',
          path: firstMenu.path,
          close: false,
          icon: firstMenu.icon || 'home'
        })

      }
      const index = this.tabList.findIndex((item) => item.path === tab.path)
      if (index >= 0) return
      this.tabList.push(tab)
    },
    removeTab(path: string, router: Router, type: RemoveType = 'current') {
      const index = this.tabList.findIndex((item) => item.path === path)
      if (index < 0) return
      if (type === 'current') {
        // 移除当前
        if(this.activeTab === path && index >= 1) {
          this.activeTab = this.tabList[index - 1].path
          router.replace(this.activeTab)
        }
        this.tabList.splice(index, 1)
      } else if (type === 'left') {
        // 左侧删除 第0项不删除
        this.tabList.splice(1, index - 1)
      } else if (type === 'right') {
        // 右侧删除
         this.tabList.splice(index + 1)
      } else if (type === 'other') {
        this.tabList = index === 0? [this.tabList[0]] : [this.tabList[0], this.tabList[index]]
      } else if (type === 'all') {
        // 清除所有
        this.tabList = [this.tabList[0]]
        this.activeTab = this.tabList[0].path
        router.replace(this.activeTab)
      }
    }
  }
})
