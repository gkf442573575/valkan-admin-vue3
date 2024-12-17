const storage = {
  /**
   * @desc 设置localStorage
   * @param key 存储key
   * @param value 存储值
   */
  set(key: string, value: any) {
    if (typeof value !== 'string') {
      value = JSON.stringify(value)
    }
    localStorage.setItem(key, value)
  },
  /**
   * @desc 获取localStorage的值
   * @param key 存储key
   * @returns 
   */
  get(key: string): any {
    return localStorage.getItem(key)
  },
  /**
   * @desc 删除localStorage的值
   * @param key 
   */
  remove(key: string) {
    localStorage.removeItem(key)
  },
  /**
   * @desc 清除localStorage
   */
  clear() {
    localStorage.clear()
  }
}

export default storage
