import { defineStore } from 'pinia'

import { useAuthStore } from './auth'

interface TabItem {
  title: string
  path: string
  close?: boolean
  icon?: string
  keepAlive?: boolean
}

export const useTabsStore = defineStore('vk-tabs', {
  state: (): { tabList: TabItem[] } => ({
    tabList: []
  }),
  actions: {
    addTab(tab: TabItem) {
      if (!this.tabList.length) {
        const authStore = useAuthStore()
        const firstMenu = authStore.appMenusTree[0]
        console.log('firstMenu >>>', firstMenu)
        this.tabList.push({
          title: firstMenu.title || '首页',
          path: firstMenu.path,
          close: false,
          icon: firstMenu.icon || 'home'
        })
        for (let i = 0; i < 20; i++) {
          // const element = array[i];
          this.tabList.push({
            title: '菜单' + i,
            path: '/system/account?id=' + i,
            close: true,
            icon: 'application-menu'
          })
        }
      }
      const index = this.tabList.findIndex((item) => item.path === tab.path)
      if (index >= 0) return
      this.tabList.push(tab)
    },
    removeTab(path: string) {
      const index = this.tabList.findIndex((item) => item.path === path)
      if (index < 0) return
      this.tabList.splice(index, 1)
    }
  }
})
