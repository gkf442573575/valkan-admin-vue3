import type { Router } from 'vue-router'
import type { MenuItem, AppMenuItem, MenusTree, BaseMenuItem } from '@/interfaces/index'

import { v4 as uuidv4 } from 'uuid'
import { isNotEmpty } from 'class-validator'
import { cloneDeep } from 'lodash'

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

interface NewMenuItem extends BaseMenuItem {
  children?: NewMenuItem[]
}

/**
 * @desc 新添加的菜单项
 */
const NEW_MENUS: NewMenuItem[] = [
  {
    path: '/editor',
    parentId: '#',
    title: 'editor.title',
    children: [
      { path: '/editor/json', title: 'editor.json.title' },
      { path: '/editor/sql', title: 'editor.sql.title' }
    ]
  }
]

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
  const findView = PATH_TO_VIEW[path]
  if (!findView) {
    console.error('提示开发人员，添加路径对应路由文件')
    return null
  }
  const findCom = ALL_VIEWS[`../views/${findView}`]
  if (!findCom) {
    return null
  }
  return findCom
}

// 修改主路由
const changeMainPath = (item: BaseMenuItem, childs: BaseMenuItem[]) => {
  let path = item.path
  if (!childs.length && path === '#') {
    throw new Error('请准确添加路由树')
  }
  const mainPath = path
  path = mainPath === '#' ? childs[0].path : path
  path = mainPath === '#' ? `/${path.split('/')[1]}` : path
  return path
}

/**
 * @desc 合并路由
 * @param menus 后台返回的路由树
 * @returns
 */
const mergeRoutes = (menus: MenuItem[]) => {
  for (let i = 0; i < menus.length; i++) {
    const item = menus[i]
    const isMain = item.parentId === '#'
    if (isMain) {
      const childMenus = menus.filter((child) => child.parentId === item.id)
      item.path = changeMainPath(item, childMenus)
      item.isMain = true
    }
  }
  // 递归获取新增路由
  const dts = (list: NewMenuItem[], parentId: string) => {
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      let path = item.path
      if (item.parentId && item.parentId === '#') {
        path = changeMainPath(item, item.children || [])
      }
      // 现是否存在相同的path
      const menuItem = menus.find((c) => c.path === path)
      let nextId = ''
      if (menuItem) {
        nextId = menuItem.id
      } else {
        const current = cloneDeep(item)
        delete current.children
        nextId = uuidv4()
        const curentParentId = item.parentId || parentId
        const isMain = isNotEmpty(current.isMain) ? !!current.isMain : curentParentId === '#'
        menus.push({
          ...current,
          id: nextId,
          parentId: curentParentId,
          isMain
        })
      }
      // 下一级
      if (item.children && item.children.length) {
        dts(item.children, nextId)
      }
    }
  }
  dts(NEW_MENUS, '#')
  return menus
}

/**
 * @desc 创建应用菜单
 * @param menus
 */
export const createAppMenus = (menus: MenuItem[]) => {
  const appMenus: AppMenuItem[] = []
  const allMenus = mergeRoutes(menus)
  for (let i = 0; i < allMenus.length; i++) {
    const item = allMenus[i]
    const isMain = !!item.isMain
    // 不是主菜单并且上一级是主菜单的才算到二级菜单中
    const subIndex = allMenus.findIndex((c) => c.id === item.parentId && c.isMain && !isMain)
    const isSub = isNotEmpty(item.isSub) ? !!item.isSub : subIndex > -1
    const pushItem: AppMenuItem = {
      ...item,
      isMain, // true 位于主菜单
      isSub, // true 位于 二级菜单
      sort: item.sort || 0,
      name: item.name || pathToRouteName(item.path),
      icon: item.icon || 'application-menu',
      keepAlive: !!item.keepAlive
    }
    appMenus.push(pushItem)
  }
  return appMenus
}

/**
 * @desc 创建菜单树
 * @param menus
 * @returns
 */
export const createMenusTree = (menus: AppMenuItem[], parentId: string = '#') => {
  const menusTree: MenusTree[] = []
  for (let i = 0; i < menus.length; i++) {
    const item = menus[i]
    if (item.parentId === parentId) {
      const children = createMenusTree(menus, item.id)
      menusTree.push({
        ...item,
        children: children || []
      })
    }
  }
  menusTree.sort((a, b) => (b.sort || 0) - (a.sort || 0))
  return menusTree
}

/**
 * @desc 创建路由
 * @param menus
 * @param router
 */
export const createAppRoutes = (menusTree: MenusTree[], router: Router) => {
  // 先创建layout的根路由
  router.addRoute({
    path: '/',
    component: Layout,
    redirect: menusTree[0].path,
    name: 'VKLayout',
    children: [],
    meta: {
      keepAlive: true
    }
  })
  const dts = (list: MenusTree[], parentName: string = 'VKLayout', parentId: string = '#') => {
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      const children = item.children || []
      const childKeepAlive = children.some((c) => !!c.keepAlive)
      const meta = {
        id: item.id,
        parentId,
        title: item.title,
        icon: item.icon,
        isMain: item.isMain,
        isSub: item.isSub,
        dynamic: true,
        keepAlive: childKeepAlive || !!item.keepAlive
      }
      if (children.length) {
        router.addRoute(parentName, {
          path: item.path,
          name: item.name,
          redirect: children[0].path,
          meta
        })
        // 递归，创建子路由
        dts(children, item.name, item.id)
      } else {
        const currentComponent = getComByPath(item.path)
        if (!currentComponent) {
          continue
        }
        router.addRoute(parentName, {
          path: item.path,
          name: item.name,
          component: currentComponent,
          meta
        })
      }
    }
  }
  dts(menusTree)
}
