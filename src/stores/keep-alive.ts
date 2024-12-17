import { defineStore } from 'pinia'

export const useKeepAliveStore = defineStore('vk-keep-alive', {
  state: (): {
    keepAliveName: string[]
  } => {
    return {
      keepAliveName: []
    }
  },
  actions: {
    addKeepAliveName(name: string) {
      !this.keepAliveName.includes(name) && this.keepAliveName.push(name)
    },
    removeKeepAliveName(name: string) {
      this.keepAliveName = this.keepAliveName.filter(item => item !== name)
    },
    setKeepAliveName(nameList: string[] = []) {
      this.keepAliveName = nameList
    }
  }
})
