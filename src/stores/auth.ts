import type { LoginForm, UserInfo, AppMenuItem, MenusTree } from '@/interfaces/index'

import { defineStore } from 'pinia'
import jsCookie from 'js-cookie'

import { TOKEN_EXPIRE } from '@/constants/index'

import { createAppMenus, createMenusTree, removeMenusRoutes } from '@/router/router-tool'
import router from '@/router'

import { mockLogin, mockUserInfo, mockUserMenus } from '@/mock/user'

export interface AuthState {
  token: string
  user: UserInfo | null
  appMenus: AppMenuItem[]
  appMenusTree: MenusTree[]
  hasAddRoutes: boolean
}

// token key
export const TOKEN_KEY = 'TOKEN_KEY_' + import.meta.env.VITE_APP_CODE

export const useAuthStore = defineStore('vk-auth', {
  state: (): AuthState => ({
    token: '',
    user: null,
    appMenus: [],
    appMenusTree: [],
    hasAddRoutes: false // 是否创建路由, 登出的时候，设置为false
  }),
  actions: {
    setAddStatus(hasAdd: boolean) {
      this.hasAddRoutes = hasAdd
    },
    // 获取token
    getToken() {
      if (this.token) {
        return this.token
      } else {
        const token = jsCookie.get(TOKEN_KEY)
        if (token) {
          this.token = token
        }
        return token || ''
      }
    },
    // 设置token
    setToken(token: string) {
      this.token = token
      jsCookie.set(TOKEN_KEY, token, { expires: TOKEN_EXPIRE })
    },
    // 登录
    login(data: LoginForm) {
      return new Promise<string>(async (resolve, reject) => {
        try {
          const res = await mockLogin(data)
          if (res.data) {
            this.setToken(res.data)
            resolve('登录成功')
          } else {
            throw new Error('登录失败')
          }
        } catch (error) {
          reject(error)
        }
      })
    },
    loginOut() {
      this.setToken('')
      jsCookie.remove(TOKEN_KEY)
      removeMenusRoutes(this.appMenus, router)
      this.user = null
      this.hasAddRoutes = false
      this.appMenus = []
      this.appMenusTree = []
      // 调整到登录页
      router.push({
        path: '/login',
        replace: true
      })
    },
    // 获取用户信息
    getUserInfo() {
      return new Promise<UserInfo>(async (resolve, reject) => {
        try {
          if (!this.token) {
            this.user = null
            throw new Error('token不存在')
          }
          if (this.user) {
            return resolve(this.user)
          }
          const res = await mockUserInfo(this.token)
          if (res.data) {
            this.user = res.data
            resolve(res.data)
          } else {
            throw new Error('获取用户信息失败')
          }
        } catch (error) {
          reject(error)
        }
      })
    },
    // 获取用户菜单
    getUserMenus() {
      return new Promise<MenusTree[]>(async (resolve, reject) => {
        try {
          if (!this.token) {
            throw new Error('token不存在')
          }
          if (this.appMenusTree && this.appMenusTree.length) {
            return resolve(this.appMenusTree)
          }
          const res = await mockUserMenus(this.token)
          if (res.data) {
            this.appMenus = createAppMenus(res.data)
            this.appMenusTree = createMenusTree(this.appMenus)
            resolve(this.appMenusTree)
          } else {
            throw new Error('获取菜单失败')
          }
        } catch (error) {
          reject(error)
        }
      })
    }
  }
})
