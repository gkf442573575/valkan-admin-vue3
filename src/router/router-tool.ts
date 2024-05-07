import type { Router } from 'vue-router'
import type { MenuItem, AppMenuItem, MenusTree, BaseMenuItem } from '@/types/index'

import { v4 as uuidv4 } from 'uuid'
import { isNotEmpty } from 'class-validator'

import Layout from '@/layout/index.vue'

/**
 * @desc 所有视图
 */
const ALL_VIEWS = import.meta.glob(['../views/**/*.vue'])

/**
 * @desc 路由转换视图按照 views下的路径
 */
const PATH_TO_VIEW: { [key: string]: string } = {
  '/home': 'home/index.vue',
  '/editor/json': 'editor/editor-json.vue',
  '/editor/sql': 'editor/editor-sql.vue',
  '/system/account': 'system/account.vue'
}

/**
 * @desc 新添加的路由 以 parentId 为key
 */
const NEW_ROUTES: { [key: string]: BaseMenuItem[] } = {
  '#': [
    {
      path: '/editor',
      title: '编辑器'
    }
  ],
  '/editor': [
    {
      path: '/editor/json',
      title: 'JSON编辑器'
    },
    {
      path: '/editor/sql',
      title: 'SQL编辑器'
    }
  ]
}

/**
 * @desc 首字母大写
 * @param str
 * @returns
 */
const firstUpStr = (str: string) => {
  return str[0].toUpperCase() + str.substring(1)
}

/**
 * @desc 路径转换成路由名称
 * @param path
 * @returns
 */
const pathToRouteName = (path: string) => {
  return path
    .split('/')
    .filter((item) => item)
    .map((item) => firstUpStr(item))
    .join('')
}

/**
 * @desc 通过路径获取组件
 * @param path
 * @returns
 */
const getComByPath = (path: string) => {
  path = `../views/${path}`
  const findView = PATH_TO_VIEW[path]
  if (!findView) {
    console.error('提示开发人员，添加路径对应路由文件')
    return null
  }
  const findCom = ALL_VIEWS[findView]
  if (!findCom) {
    console.error('提示开发人员，添加路由文件')
    return null
  }
  return findCom
}

// 合并新路由和旧路由
const mergeRoutes = (menus: MenuItem[]) => {
  // 添加的新的主路由
  const newMainPath: BaseMenuItem[] = NEW_ROUTES['#'] || []
  const mainMenus = []
  // 查找所有主路由取出主路由
  for (let i = 0; i < menus.length; i++) {
    const item = menus[i]
    const isMain = item.parentId === '#'
    let path = item.path
    if (isMain) {
      const childMenus = menus.filter((child) => child.parentId === item.id)
      // 当无子菜单，并路径还是 # 时，表示当前菜单无子菜单，且路径为根路径，此时需要添加根路径
      if (!childMenus.length && path === '#') {
        console.error('请准确添加路由树')
        continue
      }
      const mainPath = path
      path = mainPath === '#' ? childMenus[0].path : path
      path = mainPath === '#' ? `/${path.split('/')[1]}` : path
      item.path = path
      mainMenus.push({
        ...item,
        path
      })
    }
  }
  // 将新增的路由添加到路由树中
  for (let i = 0; i < newMainPath.length; i++) {
    const item = newMainPath[i]
    const path = item.path
    const findMain = mainMenus.find((item) => item.path === path)
    let parent: MenuItem = {
      ...item,
      id: uuidv4(),
      parentId: '#'
    }
    // 如果 后台传递过来的有这个路由菜单
    if (findMain) {
      parent = {
        ...findMain
      }
    }
    if (parent.path === '#') {
      console.error('在新增路由中，准确添加路由树')
      continue
    }
    const childs = NEW_ROUTES[path] || []
    // 没有子路由不执行
    if (!childs.length) {
      continue
    }
    // 如果没在主路由里
    if (!findMain) {
      menus.push(parent)
    }
    childs.forEach((child) => {
      menus.push({
        ...child,
        id: uuidv4(),
        parentId: parent.id
      })
    })
  }
  return menus
}

const isMainMenu = (item: string) => {}

/**
 * @desc 创建应用菜单
 * @param menus
 */
export const createAppMenus = (menus: MenuItem[]) => {
  const appMenus: AppMenuItem[] = []
  const allMenus = mergeRoutes(menus)
  for (let i = 0; i < allMenus.length; i++) {
    const item = allMenus[i]
    const isMain = 'isMain' in item ? !!item.isMain : item.parentId === '#'
    // 是否是二级菜单， 父表单是根表单
    const isSub =
      'isSub' in item
        ? !!item.isSub
        : allMenus.findIndex(
            (menuItem) => menuItem.id === item.parentId && menuItem.parentId === '#' && !isMain
          ) > -1

    const pushItem: AppMenuItem = {
      ...item,
      isMain,
      isSub,
      sort: item.sort || 0,
      name: item.name || pathToRouteName(item.path),
      icon: item.icon || 'application-menu',
      keepAlive: !!item.keepAlive
    }
    appMenus.push(pushItem)
  }
  console.log('appMenus >>>', appMenus)
  return appMenus
}

/**
 * @desc 创建菜单树
 * @param menus
 * @returns
 */
export const createMenusTree = (menus: AppMenuItem[]) => {
  const menusTree: MenusTree[] = []
  const mainMenus = menus
    .filter((item) => item.isMain)
    .sort((a, b) => (b.sort || 0) - (a.sort || 0))
  for (let i = 0; i < mainMenus.length; i++) {
    const item = mainMenus[i]
    const children = menus
      .filter((subItem) => subItem.parentId === item.id && subItem.isSub)
      .sort((a, b) => (b.sort || 0) - (a.sort || 0))
    menusTree.push({
      ...item,
      children: children || []
    })
  }
  return menusTree
}

/**
 * @desc 创建路由
 * @param menus
 * @param router
 */
export const createAppRoutes = (menus: AppMenuItem[], router: Router) => {
  const mainMenus = menus
    .filter((item) => item.isMain)
    .sort((a, b) => (b.sort || 0) - (a.sort || 0))

  // 先创建layout的根路由
  router.addRoute({
    path: '/',
    component: Layout,
    redirect: mainMenus[0].path,
    name: 'Layout',
    children: []
  })

  for (let i = 0; i < mainMenus.length; i++) {
    const main = mainMenus[i]
    const children = menus
      .filter((subItem) => subItem.parentId === main.id)
      .sort((a, b) => (b.sort || 0) - (a.sort || 0))
    if (children.length) {
      router.addRoute('Layout', {
        path: main.path,
        redirect: children[0].path,
        name: main.name,
        meta: {
          id: main.id,
          title: main.title,
          icon: main.icon,
          isMain: main.isMain,
          isSub: main.isSub
        }
      })
      for (let j = 0; j < children.length; j++) {
        const child = children[j]
        const routeComponent = getComByPath(child.path)
        if (!routeComponent) {
          continue
        }
        router.addRoute(main.name, {
          path: child.path,
          component: routeComponent,
          name: child.name,
          meta: {
            id: child.id,
            title: child.title,
            icon: child.icon,
            isMain: false,
            isSub: child.isSub,
            keepAlive: child.keepAlive
          }
        })
      }
    } else {
      const routeComponent = getComByPath(main.path)
      if (!routeComponent) {
        continue
      }
      router.addRoute('Layout', {
        path: main.path,
        component: routeComponent,
        name: main.name,
        meta: {
          id: main.id,
          title: main.title,
          icon: main.icon,
          isMain: main.isMain,
          isSub: false,
          keepAlive: main.keepAlive
        }
      })
    }
  }
}
