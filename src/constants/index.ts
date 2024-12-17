import type { LATYOUT_TYPE } from '@/interfaces'
/**
 * @desc 默认主题
 */
export const DEFAULT_PRIMARY = '#3229e0'

/**
 * @desc 默认颜色列表
 */
export const THEME_COLOR_LIST = [
  DEFAULT_PRIMARY,
  '#416aea',
  '#DAA96E',
  '#0C819F',
  '#27ae60',
  '#ff5c93',
  '#e74c3c',
  '#fd726d',
  '#f39c12',
  '#9b59b6'
]

/**
 * @desc 默认布局
 */
export const DEFAULT_LAYOUT: LATYOUT_TYPE = 'default'

/**
 * @desc 布局列表
 */
export const LAYOUT_LIST: {
  type: LATYOUT_TYPE,
  desc: string,
  main: string[]
}[] = [
  {
    type: 'default',
    desc: '默认布局',
    main: ['aside', 'body']
  },
  {
    type: 'subaside',
    desc: '二级菜单',
    main: ['aside', 'sub-aside', 'body']
  },
  {
    type: 'menuhead',
    desc: '菜单在头部',
    main: ['body']
  }
]

/**
 * @desc 语言列表
 */
export const LANG_LIST = [
  {
    label: '简体中文',
    value: 'zh-CN'
  },
  {
    label: 'English',
    value: 'en'
  }
]

/**
 * @desc token的超时时间
 */
export const TOKEN_EXPIRE = 0.33
