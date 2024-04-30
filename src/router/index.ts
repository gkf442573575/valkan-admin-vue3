import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import { useAuthStore } from '@/stores/auth'

import NProgress from '@/utils/nprogress'

import Layout from '@/layout/index.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    name: 'Layout',
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/index.vue'),
        name: 'Home',
        meta: {
          title: '首页',
          icon: 'home'
        }
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    name: 'Login',
    meta: {
      title: '登录'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ left: 0, top: 0 }),
  strict: true,
  routes
})

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  document.title = to.meta.title
    ? `${to.meta.title} | ${import.meta.env.VITE_APP_TITLE}`
    : import.meta.env.VITE_APP_TITLE

  const authStore = useAuthStore()
  const token = authStore.getToken()
  if (token) {
    if (to.name === 'Login') {
      next({
        path: '/',
        replace: true
      })
      return
    }
    // 获取用户信息
    await authStore.getUserInfo()
    next()
  } else {
    if (to.name === 'Login') {
      next()
    } else {
      next({
        path: '/login',
        replace: true,
        query: {
          redirect: to.path
        }
      })
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

router.onError((error) => {
  NProgress.done()
  console.error('路由错误 >>>', error.message)
})

export default router
