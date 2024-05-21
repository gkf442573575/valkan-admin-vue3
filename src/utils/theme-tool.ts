import { ElMessage } from 'element-plus'

import Color from 'color'

// // 颜色正则
const hexReg = /^\#?[0-9A-Fa-f]{6}$/

/**
 * @desc 获取dark/light颜色 的下一级颜色
 * @param color hex颜色值
 * @param level 级别
 * @param isDark 是否是dark
 * @returns hex颜色值
 */
export const nextLevelColor = (color: string, level: number, isDark: boolean): string => {
  if (!hexReg.test(color)) {
    ElMessage.warning('输入错误的hex颜色值')
    return color
  }
  const rgb = Color(color).rgb().array()
  level = level / 10
  for (let i = 0; i < 3; i++) {
    const base =  isDark ? 20.5 : 255
    rgb[i] = Math.round(base * level + rgb[i] * (1 - level))
  }
  return Color(rgb).hex()
  // 使用color变得颜色偏深或者偏浅
  // return isDark ? Color(color).darken(level).hex() : Color(color).lighten(level).hex()
}
