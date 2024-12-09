import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import { createMenusTree, createAppRoutes } from './router-tool'

import NProgress from '@/utils/nprogress'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    name: 'Login',
    meta: {
      title: '登录'
    }
  },
  {
    path: '/404',
    component: () => import('@/views/error/404.vue'),
    name: 'Error404',
    meta: {
      title: '404'
    }
  }
]

const err404Route: RouteRecordRaw = {
  path: '/:pcatchAll(.*)*',
  redirect: '/404',
  meta: { hidden: true }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ left: 0, top: 0 }),
  strict: true,
  routes
})

// 是否已经创建
let hasCreated = false

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  document.title = to.meta.title
    ? `${to.meta.title} | ${import.meta.env.VITE_APP_TITLE}`
    : import.meta.env.VITE_APP_TITLE

  const authStore = useAuthStore()
  const token = authStore.getToken()

  if (token) {
    await authStore.getUserInfo()
    if (to.name === 'Login') {
      next({
        path: '/',
        replace: true
      })
      return
    }
    // TODO:是否创建路由, 登出的时候，设置为false
    if (hasCreated) {
      next()
    } else {
      const appMenusTree = await authStore.getUserMenus()
      console.log('appMenusTree >>>', appMenusTree)
      createAppRoutes(appMenusTree, router)
      // 添加404错误路由
      router.addRoute(err404Route)
      hasCreated = true
      // 跳转
      next({ ...to, replace: true })
    }
  } else {
    if (to.name === 'Login') {
      next()
    } else {
      // 清空路由
      hasCreated = false
      const dynamicRoutes = router.getRoutes().filter((item) => item.meta && item.meta.dynamic)
      dynamicRoutes.forEach((item) => router.removeRoute(item.name as string))
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
