import { nextTick, onMounted, ref, type Ref } from 'vue'
import { get } from 'lodash-es'

import { withInstall } from '@/utils/install'

import Table from './index.vue'

/**
 * @desc 表格列
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

export type TableListInstance = InstanceType<typeof Table>

export const TableList = withInstall(Table)

export default TableList

interface TableDataOptions {
  /**
   * @desc 数据key
   * @default 'data' 通过 get(response, options.data, [])获取数据， response 为后端响应数据
   */
  data?: string
  /**
   * @desc 数据key
   * @default 'total' 通过 get(response, options.total, [])获取数据， response 为后端响应数据
   */
  total?: string
  /**
   * @desc 分页key
   * @default 'page' 在参数中page中的key
   */
  page?: string
  /**
   * @desc 分页key
   * @default 'size' 在参数中size中的key
   */
  size?: string
  /**
   * @desc 是否开启分页
   */
  enablePage?: boolean
  /**
   * @desc 是否onMounted初始化加载
   */
  initLoad?: boolean
}

/**
 * @desc 封装表格数据获取
 * @param getData 请求数据接口
 * @param params 请求参数
 * @param options 配置
 * @returns
 */
export const useTableData = (
  getData: (params: Record<string, any>) => Promise<any>,
  params: Record<string, any>,
  options?: TableDataOptions,
) => {
  const loading = ref(false)
  // 数据
  const tableData = ref<any[]>([])

  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(10)

  const getTableData = async (reset = true) => {
    loading.value = true
    try {
      const query: Record<string, any> = {
        ...params.value,
      }
      if (reset) {
        page.value = 1
      }
      // 是否开启分页
      let enablePage = true
      if (options && options.enablePage !== undefined && options.enablePage !== null) {
        enablePage = options.enablePage
      }
      if (enablePage) {
        query[(options && options.page) || 'page'] = page.value
        query[(options && options.size) || 'size'] = pageSize.value
      }
      const res = await getData(query)
      tableData.value = get(res, (options && options.data) || 'data', [])
      total.value = get(res, (options && options.total) || 'total', 0)
      loading.value = false
    } catch (error) {
      loading.value = false
      tableData.value = []
      total.value = 0
      page.value = 1
      pageSize.value = 10
    }
  }

  onMounted(async () => {
    let initLoad = true
    if (options && options.initLoad !== undefined && options.initLoad !== null) {
      initLoad = options.initLoad
    }
    if (!initLoad) {
      return
    }
    // 获取初始数据
    await nextTick()
    getTableData()
  })

  return {
    loading,
    tableData,
    total,
    page,
    pageSize,
    getTableData,
  }
}
