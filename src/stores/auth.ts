import type { LoginForm, UserInfo } from '@/types/index'

import { defineStore } from 'pinia'

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
  getters: {
    isLogin: (state) => state.user && state.user.id
  },
  actions: {
    login(data: LoginForm) {
      return new Promise<string>(async (resolve, reject) => {
        try {
          const res = await mockLogin(data)
          if (res.data) {
            //
          } else {
            //
          }
        } catch (error) {
          reject(error)
        }
      })
    }
  }
})
