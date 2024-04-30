import type { LoginForm, UserInfo } from '@/types/index'

import { defineStore } from 'pinia'
import jsCookie from 'js-cookie'

import { TOKEN_EXPIRE } from '@/config/index'

import { mockLogin, mockUserInfo } from '@/mock/user'

export interface AuthState {
  token: string
  user: UserInfo | null
}

// token key
export const TOKEN_KEY = 'TOKEN_KEY_' + import.meta.env.VITE_APP_CODE

export const useAuthStore = defineStore('vk-auth', {
  state: (): AuthState => ({
    token: '',
    user: null
  }),
  actions: {
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
            reject(new Error('登录失败'))
          }
        } catch (error) {
          reject(error)
        }
      })
    },
    // 获取用户信息
    getUserInfo() {
      return new Promise<UserInfo>(async (resolve, reject) => {
        try {
          if (!this.token) {
            throw new Error('token不存在')
          }
          const res = await mockUserInfo(this.token)
          if (res.data) {
            this.user = res.data
            resolve(res.data)
          } else {
            new Error('获取用户信息失败')
          }
        } catch (error) {
          reject(error)
        }
      })
    }
  }
})
