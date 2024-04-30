import { ElMessage } from 'element-plus'

// 颜色正则
const hexReg = /^\#?[0-9A-Fa-f]{6}$/

/**
 * hex颜色转rgb颜色
 * @param str hex颜色值字符串
 * @returns 返回处理后的颜色值
 */
export function hexToRgb(str: string): number[] {
  if (!hexReg.test(str)) {
    ElMessage.warning('输入错误的hex')
    return []
  }
  str = str.replace('#', '')
  const hexs = str.match(/../g)
  if (!hexs) {
    return []
  }
  const hexArr: number[] = []
  for (let i = 0; i < 3; i++) {
    hexArr.push(parseInt(hexs[i], 16))
  }
  return hexArr
}

/**
 * rgb颜色转Hex颜色
 * @param r 代表红色
 * @param g 代表绿色
 * @param b 代表蓝色
 * @returns 返回处理后的颜色值
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const reg = /^\d{1,3}$/
  if (!reg.test(r.toString()) || !reg.test(g.toString()) || !reg.test(b.toString())) {
    ElMessage.warning('输入错误的rgb颜色值')
    return ''
  }
  const hexs = [r.toString(16), g.toString(16), b.toString(16)]
  for (let i = 0; i < 3; i++) if (hexs[i].length === 1) hexs[i] = `0${hexs[i]}`
  return `#${hexs.join('')}`
}

/**
 * 加深颜色值
 * @param color hex颜色值字符串
 * @param level 加深的程度，限0-1之间
 * @returns 返回处理后的颜色值
 */
export function getDarkColor(color: string, level: number): string {
  if (!hexReg.test(color)) {
    ElMessage.warning('输入错误的hex颜色值')
    return color
  }
  const rgb = hexToRgb(color)
  if (!rgb.length) {
    return color
  }
  for (let i = 0; i < 3; i++) {
    rgb[i] = Math.round(20.5 * level + rgb[i] * (1 - level))
  }
  return rgbToHex(rgb[0], rgb[1], rgb[2])
}

/**
 * 变浅颜色值
 * @param color hex颜色值字符串
 * @param level 加深的程度，限0-1之间
 * @returns 返回处理后的颜色值
 */
export function getLightColor(color: string, level: number): string {
  if (!hexReg.test(color)) {
    ElMessage.warning('输入错误的hex颜色值')
    return color
  }
  const rgb = hexToRgb(color)
  if (!rgb.length) {
    return color
  }
  for (let i = 0; i < 3; i++) {
    rgb[i] = Math.round(255 * level + rgb[i] * (1 - level))
  }
  return rgbToHex(rgb[0], rgb[1], rgb[2])
}
