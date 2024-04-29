/**
 * @description 获取当前时间对应的提示语
 * @return string
 */
export function timeWelcom(name: string) {
  const hour = new Date().getHours()
  if (hour >= 6 && hour <= 10) return `早上好，${name} ⛅`
  if (hour > 10 && hour <= 14) return `中午好，${name} 🌞`
  if (hour > 14 && hour <= 18) return `下午好，${name} 🌞`
  if (hour > 18 && hour <= 24) return `晚上好，${name} 🌛`
  return `凌晨好，${name} 🌛`
}
