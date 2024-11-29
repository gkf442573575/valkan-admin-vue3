<template>
  <el-table
    ref="tableListRef"
    :data="data"
    v-bind="$attrs"
    v-loading="loading"
    @select="selectRow"
    @select-all="selectAllRows"
  >
    <template v-for="(col, index) in columns" :key="`col_${index}`">
      <!--- 选项列 -->
      <el-table-column
        v-if="col.type && col.type === 'select'"
        type="selection"
        :width="col.width || 55"
        :align="col.align || 'center'"
        :header-align="col.headerAlign || col.align || 'center'"
        :fixed="col.fixed || false"
        :class-name="`col-item col-item-select ${multiple ? '' : 'col-item-select__single'}`"
      />
      <!--- 序号列 -->
      <el-table-column
        v-else-if="col.type && col.type === 'index'"
        type="index"
        :label="col.title || '序号'"
        :width="col.width || 55"
        :align="col.align || 'center'"
        :header-align="col.headerAlign || col.align || 'center'"
        :fixed="col.fixed || false"
        class-name="col-item col-item-index"
      />
      <!--通过slot自定义列， 然后 返回 row 和 当前列index -->
      <el-table-column
        v-else-if="col.slot"
        :label="col.title || ''"
        :width="col.width || ''"
        :min-width="col.minWidth || ''"
        :align="col.align || 'center'"
        :header-align="col.headerAlign || col.align || 'center'"
        :show-overflow-tooltip="col.tooltip || false"
        :fixed="col.fixed || false"
        :class-name="`col-item col-item-${col.slot} ${col.className || ''}`"
      >
        <template #default="{ row, $index }">
          <slot :name="col.slot" :row="row" :index="$index"></slot>
        </template>
      </el-table-column>
      <!--- 普通prop 设置的列 -->
      <el-table-column
        v-else-if="col.prop"
        :prop="col.prop"
        :label="col.title"
        :width="col.width || ''"
        :min-width="col.minWidth || ''"
        :align="col.align || 'center'"
        :header-align="col.headerAlign || col.align || 'center'"
        :show-overflow-tooltip="col.tooltip || false"
        :fixed="col.fixed || false"
        :formatter="col.formatter || undefined"
        :class-name="`col-item col-item-${col.prop} ${col.className || ''}`"
      />
    </template>
  </el-table>
  <div class="flex justify-end mt-2" v-if="enablePage">
    <el-pagination
      v-model:current-page="page"
      v-model:page-size="pageSize"
      :total="total"
      background
      small
      layout="total, sizes, prev, pager, next"
    >
    </el-pagination>
  </div>
</template>

<script setup lang="ts">
import type { ElTable } from 'element-plus'
import type { TableColItem } from './index'

import { computed, nextTick, ref, watch, type PropType } from 'vue'

const props = defineProps({
  data: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  columns: {
    type: Array as PropType<TableColItem[]>,
    default: () => [],
  },
  rowKey: {
    type: String,
    default: 'id',
  },
  multiple: {
    // 是否多选
    type: Boolean,
    default: false,
  },
  loading: {
    // 是否显示加载中
    type: Boolean,
    default: false,
  },
  enablePage: {
    // 是否开启分页
    type: Boolean,
    default: false,
  },
  total: {
    type: Number,
    default: 0,
  },
})

const tableListRef = ref<InstanceType<typeof ElTable>>()
// 选中的数据
const selectedList = defineModel<any[]>('selectedList', { default: () => [] })
// 分页
const page = defineModel<number>('page', { default: 1 })
// 每页数量
const pageSize = defineModel<number>('pageSize', { default: 10 })

// 是否开启了选项列
const isSelect = computed(() => {
  return props.columns.some((col) => col.type === 'select')
})

// 选中行
const selectRow = (selection: any[], row: any) => {
  const selectIndex = selectedList.value.findIndex(
    (item) => item[props.rowKey] === row[props.rowKey],
  )
  if (selectIndex > -1) {
    selectedList.value.splice(selectIndex, 1)
    return
  }
  if (props.multiple) {
    selectedList.value.push(row)
  } else {
    tableListRef.value?.clearSelection()
    tableListRef.value?.toggleRowSelection(row, true)
    selectedList.value = [row]
  }
}

// 选中所有行
const selectAllRows = (selection: any[]) => {
  const selectAll = !!selection.length
  if (!props.multiple) {
    if (!selectAll) {
      selectedList.value = []
    }
    return
  }
  for (const row of props.data) {
    const selectIndex = selectedList.value.findIndex(
      (item) => item[props.rowKey] === row[props.rowKey],
    )
    // 选中的菜单中有当前页面数据，但是清空啦，移除掉
    if (selectIndex > -1 && !selectAll) {
      selectedList.value.splice(selectIndex, 1)
      continue
    }
    if (selectIndex <= -1 && selectAll) {
      selectedList.value.push(row)
      continue
    }
  }
}

// 设置表格选中
const setTableSelect = async () => {
  await nextTick()
  for (const row of props.data) {
    const selectIndex = selectedList.value.findIndex(
      (item) => item[props.rowKey] === row[props.rowKey],
    )
    if (selectIndex > -1 && tableListRef.value) {
      // 将当前数据更新避免里面数据不完全
      selectedList.value[selectIndex] = row
      tableListRef.value.toggleRowSelection(row, true)
    }
  }
}

watch(
  () => props.data,
  () => {
    if (isSelect.value) {
      setTableSelect()
    }
  },
  {
    immediate: true,
  },
)

defineOptions({
  name: 'TableList',
})
</script>

<style lang="scss">
.el-table__header {
  .col-item-select.col-item-select__single {
    .el-checkbox {
      display: none;
    }
  }
}
</style>
