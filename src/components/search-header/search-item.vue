<template>
  <el-form-item
    :label-width="searchItem.label ? searchItem.labelWidth || labelWidth || 0 : 0"
    :label="searchItem.label"
  >
    <el-input
      v-if="searchItem.type === 'input'"
      v-model.trim="value"
      :placeholder="searchItem.placeholder || `请输入${searchItem.label}`"
      :clearable="true"
      style="width: 100%"
    />
    <!-- select 使用 options 作为数据源 -->
    <el-select
      v-else-if="searchItem.type === 'select'"
      v-model="value"
      clearable
      style="width: 100%"
      :placeholder="searchItem.placeholder || `请选择${searchItem.label}`"
    >
      <el-option
        v-for="(opt, idx) of searchItem.options"
        :key="`${searchItem.key}_${idx}`"
        :value="opt.value"
        :label="opt.label"
      ></el-option>
    </el-select>
    <el-date-picker
      v-else-if="searchItem.type === 'date'"
      v-model="value"
      type="date"
      style="width: 100%"
      :placeholder="searchItem.placeholder || `请选择${searchItem.label}`"
      :clearable="true"
      :format="(searchItem.options && searchItem.options.format) || 'YYYY-MM-DD'"
      :value-format="(searchItem.options && searchItem.options.format) || 'YYYY-MM-DD'"
    ></el-date-picker>
    <el-date-picker
      v-else-if="searchItem.type === 'dateTime'"
      v-model="value"
      type="datetime"
      style="width: 100%"
      :placeholder="searchItem.placeholder || `请选择${searchItem.label}`"
      :clearable="true"
      :format="(searchItem.options && searchItem.options.format) || 'YYYY-MM-DD HH:mm:ss'"
      :value-format="(searchItem.options && searchItem.options.format) || 'YYYY-MM-DD HH:mm:ss'"
    />
    <slot v-else :search-item="searchItem" :value="value" :set-value="setValue"></slot>
  </el-form-item>
</template>

<script setup lang="ts">
import type { SearchColItem } from './index'

import { computed } from 'vue'
import { get, set } from 'lodash-es'

const props = defineProps<{
  searchForm: Record<string, any>
  searchItem: SearchColItem
  labelWidth?: string | number
}>()

const value = computed({
  get() {
    return get(props.searchForm, props.searchItem.key, '')
  },
  set(val) {
    set(props.searchForm, props.searchItem.key, val)
  },
})

const setValue = (val: any) => {
  value.value = val
  set(props.searchForm, props.searchItem.key, val)
}

defineOptions({
  name: 'SearchHeaderItem',
})
</script>
