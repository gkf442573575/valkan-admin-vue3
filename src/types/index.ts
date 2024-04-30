/**
 * @instance 表格列
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
 * @instance 登录表单
 */
export interface LoginForm {
  username: string
  password: string
}

/**
 * @instance 用户信息
 */
export interface UserInfo {
  id: string
  username: string
  [key: string]: string
}
