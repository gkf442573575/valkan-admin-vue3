/**
 * @desc 布局类型
 */
export type LATYOUT_TYPE = 'default' | 'subaside' | 'menuhead'

/**
 * @interface LoginForm 登录表单
 */
export interface LoginForm {
  username: string
  password: string
}

/**
 * @interface UserInfo 用户信息
 */
export interface UserInfo {
  id: string
  username: string
  [key: string]: string
}

/**
 * @interface BaseMenuItem 默认菜单项
 */
export interface BaseMenuItem {
  id?: string
  path: string
  parentId?: string
  name?: string
  title?: string
  sort?: number // 排序
  icon?: string // 图标
  isMain?: boolean // 是否显示到主菜单
  isSub?: boolean // 是否是二级
  keepAlive?: boolean // 是否缓存
}

/**
 * @interface MenuItem 菜单项
 */
export interface MenuItem extends BaseMenuItem {
  id: string
  parentId: string
}

/**
 * @desc 菜单项
 */
export interface AppMenuItem extends MenuItem {
  name: string
  isMain: boolean
  isSub: boolean
  keepAlive: boolean
}

/**
 * @desc 菜单树
 */
export interface MenusTree extends AppMenuItem {
  children: MenusTree[]
}
