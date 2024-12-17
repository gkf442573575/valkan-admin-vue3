import { globalT} from '@/i18n'

import { ElMessage } from 'element-plus'

import Color from 'color'

/**
 * @description 获取当前时间对应的提示语
 * @return string
 */
export function timeWelcom(name: string) {
  const hour = new Date().getHours()
  if (hour >= 6 && hour <= 10) return globalT('login.welcom.1', [name])
  if (hour > 10 && hour <= 14) return globalT('login.welcom.2', [name])
  if (hour > 14 && hour <= 18) return globalT('login.welcom.3', [name])
  if (hour > 18 && hour <= 24) return globalT('login.welcom.4', [name])
  return globalT('login.welcom.5', [name])
}

/**
 * @desc 获取dark/light颜色 的下一级颜色
 * @param color hex颜色值
 * @param level 级别
 * @param isDark 是否是dark
 * @returns hex颜色值
 */
export const nextLevelColor = (color: string, level: number, isDark: boolean): string => {
  const hexReg = /^\#?[0-9A-Fa-f]{6}$/
  if (!hexReg.test(color)) {
    ElMessage.warning('输入错误的hex颜色值')
    return color
  }
  const rgb = Color(color).rgb().array()
  level = level / 10
  for (let i = 0; i < 3; i++) {
    const base = isDark ? 20.5 : 255
    rgb[i] = Math.round(base * level + rgb[i] * (1 - level))
  }
  return Color(rgb).hex()
}
