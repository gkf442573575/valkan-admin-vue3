import type { Router } from 'vue-router'
import type { MenuItem, AppMenuItem } from '@/types/index'

import { v4 as uuidv4 } from 'uuid'

/**
 * @interface NewRouteItem 新路由
 */
interface NewRouteItem {
  path: string // 路径
  title?: string // 标题
  icon?: string // 图标
  isMain?: boolean // 是否是主菜单
  isSub?: boolean // 是否是二级菜单
  sort?: number // 排序
  keepAlive?: boolean // 是否缓存
}

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
 * @desc 新添加的路由
 */
const NEW_ROUTES: { [key: string]: NewRouteItem[] } = {
  // 可以给根目录添加 为后面的路径添加树
  '/': [
    {
      path: '/editor',
      title: '编辑器',
      isMain: true
    }
  ],
  '/editor': [
    {
      path: '/editor/sql',
      title: 'SQL编辑器',
      isSub: true
    },
    {
      path: '/editor/json',
      title: 'JSON编辑器',
      isSub: true
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

/**
 * @desc 创建应用菜单
 * @param menus
 */
export const createAppMenus = (menus: MenuItem[]) => {
  const allMenus: AppMenuItem[] = []
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
    }
    // 是否是二级菜单， 父表单是根表单
    const isSub =
      menus.findIndex(
        (menuItem) => menuItem.id === item.parentId && menuItem.parentId === '#' && !isMain
      ) > -1

    const pushItem: AppMenuItem = {
      ...item,
      path,
      isMain,
      isSub,
      sort: item.sort || 0,
      name: pathToRouteName(path),
      keepAlive: !!item.keepAlive
    }
    allMenus.push(pushItem)
  }
  // 通过路径添加
  for (const parentPath of Object.keys(NEW_ROUTES)) {
    const childs = NEW_ROUTES[parentPath]
    if (!childs.length) {
      continue
    }
    const parent = allMenus.find((item) => item.path === parentPath)
    childs.forEach((item) => {
      allMenus.push({
        id: uuidv4(),
        path: item.path,
        parentId: parentPath === '/' ? '#' : parent ? parent.id : '#', // 当无父级时，父级id为#
        isMain: !!item.isMain,
        isSub: !!item.isSub,
        title: item.title || '',
        sort: item.sort || 0,
        name: pathToRouteName(item.path),
        keepAlive: !!item.keepAlive
      })
    })
  }
  console.log('allMenus >>>', allMenus)
  return allMenus
}
