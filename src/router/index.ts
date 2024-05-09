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
    const hasAddRoutes = authStore.hasAddRoutes
    // TODO:是否创建路由, 登出的时候，设置为false
    if (!hasAddRoutes) {
      await authStore.getUserInfo()
      const appMenusTree = await authStore.getUserMenus()
      createAppRoutes(appMenusTree, router)
      authStore.setAddStatus(true)
      // 添加404错误路由
      router.addRoute(err404Route)
      // 跳转
      next({ ...to, replace: true })
    } else {
      next()
    }
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
