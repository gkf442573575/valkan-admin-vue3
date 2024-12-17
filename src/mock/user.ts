import type { LoginForm, UserInfo, MenuItem } from '@/interfaces/index'
import type { MockResData } from './index'

import { MD5, enc, AES } from 'crypto-js'
import { v4 as uuidV4 } from 'uuid'

import { successRes, failRes } from './index'

interface menuData {
  [key: string]: MenuItem[]
}

const mockUsers = ['admin', 'user']

// 默认菜单
const normalMenus: MenuItem[] = [
  {
    id: '1',
    path: '/home',
    title: 'home.title',
    parentId: '#',
    sort: 0,
    icon: 'home' // iconpark icon
  },
]

// 用户菜单
const userMenus: menuData = {
  admin: [
    ...normalMenus,
    {
      id: '3',
      path: '#',
      title: 'system.title',
      parentId: '#',
      sort: 0
    },
    {
      id: '3-1',
      path: '/system/account',
      title: 'system.account.title',
      parentId: '3',
      sort: 0,
      keepAlive: true
    },
  ],
  user: [...normalMenus]
}

export const AES_KEY = enc.Utf8.parse('xhd6l6pgczo3r4i6').toString(enc.Hex)

export const AES_TOKEN_KEY = enc.Utf8.parse('5qhuewmujqebkwi1').toString(enc.Hex)

const VERIFY_PWD = MD5('123456').toString()

// 生成一个token
const loginToken = (user: LoginForm) => {
  if (!mockUsers.includes(user.username) && user.password !== VERIFY_PWD) {
    return ''
  }
  const token = AES.encrypt(JSON.stringify(user), AES_TOKEN_KEY).toString()
  return token
}

// 通过token获取用户信息
const getUserByToken = (token: string): LoginForm | null => {
  try {
    const userStr = AES.decrypt(token, AES_TOKEN_KEY).toString(enc.Utf8)
    const user: LoginForm = JSON.parse(userStr)
    if (!mockUsers.includes(user.username) && user.password !== VERIFY_PWD) {
      return null
    }
    return user
  } catch (error) {
    return null
  }
}

/**
 * @desc mock login api
 * @param user
 * @returns
 */
export const mockLogin = (user: LoginForm): Promise<MockResData<string>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const token = loginToken(user)
      if (token) {
        resolve(successRes(token))
      } else {
        reject(failRes())
      }
    }, 300)
  })
}

/**
 * @desc 获取用户信息通过token
 * @param token
 */
export const mockUserInfo = (token: string): Promise<MockResData<UserInfo>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = getUserByToken(token)
      if (user) {
        const info: UserInfo = {
          username: user.username,
          id: uuidV4()
        }
        resolve(successRes(info))
      } else {
        reject(failRes())
      }
    }, 300)
  })
}

/**
 * @desc 获取用户的菜单
 * @param token
 * @returns
 */
export const mockUserMenus = (token: string): Promise<MockResData<MenuItem[]>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = getUserByToken(token)
      if (user) {
        resolve(successRes(userMenus[user.username]))
      } else {
        reject(failRes())
      }
    }, 300)
  })
}
