<template>
  <el-table
    ref="tableListRef"
    :data="data"
    :border="border"
    :height="height"
    v-bind="$attrs"
    v-loading="loading"
    @select="selectRow"
    @select-all="selectAllRows"
  >
    <template v-for="(col, index) in columns" :key="`${col[rowKey]}_${index}`">
      <!--- 选项列 -->
      <el-table-column
        v-if="col.type && col.type === 'select'"
        type="selection"
        :width="col.width || 55"
        :align="col.align || 'center'"
        :header-align="col.headerAlign || col.align || 'center'"
        :fixed="col.fixed || false"
        class-name="col-item col-item-select"
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
      <!--- 普通通过prop 设置的列 -->
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
</template>

<script setup lang="ts">
import { ref, type PropType, computed, watch, nextTick } from 'vue'
import { type ElTable } from 'element-plus'

import type { TableColItem } from '@/types/index'

interface ROWITEM {
  [key: string]: any
}

const props = defineProps({
  data: {
    type: Array as PropType<ROWITEM[]>,
    default: () => []
  },
  columns: {
    type: Array as PropType<TableColItem[]>,
    default: () => []
  },
  height: {
    type: [Number, String],
    default: 350
  },
  rowKey: {
    type: String,
    default: 'id' // 默认主键， 多选会用来判断是否选中
  },
  loading: {
    type: Boolean,
    default: false
  },
  border: {
    type: Boolean,
    default: false
  }
})

const isSelect = computed(() => {
  return props.columns.some((col) => col.type === 'select')
})

const selectedList = defineModel('selectedList', { type: Array<ROWITEM>, default: () => [] })

const tableListRef = ref<InstanceType<typeof ElTable>>()

// 选中当前
const selectRow = (selection: ROWITEM[], row: ROWITEM) => {
  const selectIndex = selectedList.value.findIndex(
    (item) => item[props.rowKey] === row[props.rowKey]
  )
  if (selectIndex > -1) {
    selectedList.value.splice(selectIndex, 1)
  } else {
    selectedList.value.push(row)
  }
}

// 全选
const selectAllRows = (selection: ROWITEM[]) => {
  const selectAll = !!selection.length
  for (const row of props.data) {
    const selectIndex = selectedList.value.findIndex(
      (item) => item[props.rowKey] === row[props.rowKey]
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
      (item) => item[props.rowKey] === row[props.rowKey]
    )
    if (selectIndex > -1) {
      if (tableListRef.value) {
        // 将当前数据更新避免里面数据不完全
        selectedList.value[selectIndex] = row
        tableListRef.value.toggleRowSelection(row, true)
      }
    }
  }
}

watch(
  () => props.data,
  (newVal, oldVal) => {
    if (isSelect.value) {
      setTableSelect()
    }
  },
  {
    immediate: true
  }
)

defineOptions({
  name: 'vk-table-list'
})
</script>
