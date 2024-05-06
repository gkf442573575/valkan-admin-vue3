/**
 * @interface TableColItem 表格列
 */
export interface TableColItem {
  type?: 'select' | 'index' // 是否选择列 或者 index
  align?: 'left' | 'center' | 'right'
  headerAlign?: 'left' | 'center' | 'right'
  slot?: string // 当slot存在时，prop失效 自定义template slot 测试
  prop?: string // 列字段名
  title?: string // 列标题
  width?: string | number // 列宽
  minWidth?: string | number // 列最小宽度
  tooltip?: boolean //是否显示tooltip
  className?: string // 自定义类名
  fixed?: 'left' | 'right' // 是否固定列
  formatter?: (row: any, column: any, cellValue: any, index: number) => any // 格式化函数
}

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
 * @interface MenuItem 菜单项
 */
export interface MenuItem {
  id: string
  path: string
  parentId: string
  title?: string
  sort?: number // 排序
  icon?: string
  keepAlive?: boolean // 是否缓存
}

/**
 * @desc 菜单项
 */
export interface AppMenuItem extends MenuItem {
  name: string
  isMain: boolean
  isSub: boolean
}

/**
 * @desc 菜单树
 */
export interface MenusTree extends AppMenuItem {
  children: AppMenuItem[]
}
