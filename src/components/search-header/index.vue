<template>
  <div class="search-header flex py-2">
    <div class="flex-1 min-h-11 pr-3">
      <el-form :model="searchForm" ref="searchFormRef" label-position="left">
        <el-row :gutter="20">
          <el-col v-for="item in normalCols" :key="item.key" :span="6">
            <search-item :search-item="item" :label-width="labelWidth" :search-form="searchForm">
              <template #default="{ searchItem, value, setValue }">
                <slot
                  :name="searchItem.key"
                  :search-item="searchItem"
                  :value="value"
                  :set-value="setValue"
                ></slot>
              </template>
            </search-item>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" :icon="Search" @click="search">搜索</el-button>
            <el-button type="primary" plain :icon="Refresh" @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 搜索 右侧的按钮-->
    <div class="search-header-btns">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SearchColItem } from './index'
import type { FormInstance } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'

import { Search, Refresh } from '@element-plus/icons-vue'

import SearchItem from './search-item.vue'

const searchCols = ref<SearchColItem[]>([
  {
    label: '姓名',
    key: 'keyword',
    type: 'input',
    placeholder: '按用户姓名搜索',
  },
  {
    label: '区划',
    key: 'regionName',
    type: 'input',
    placeholder: '请输入区划名称',
  },
  {
    label: '部门',
    key: 'deptName',
    type: 'dateTime',
    placeholder: '请输入部门名称',
  },
  {
    label: '部门',
    key: 'deptName1',
    type: 'input',
    placeholder: '请输入部门名称',
  },
  {
    label: '部门',
    key: 'deptName3',
    type: 'date',
    placeholder: '请输入部门名称',
  },
  {
    label: '部门',
    key: 'deptName2',
    type: 'slot',
    placeholder: '请输入部门名称',
  },
])
const labelWidth = 80

const searchForm = reactive<Record<string, any>>({})
const searchFormRef = ref<FormInstance>()

const normalCols = searchCols.value.filter((item) => !item.senior)

// 搜索
const search = () => {
  console.log('search form', searchForm)
}
// 重置
const reset = () => {
  createSearchForm()
  searchFormRef.value?.resetFields()
}
/**
 * 搜索
 */
const createSearchForm = () => {
  searchCols.value.forEach((item) => {
    searchForm[item.key] = ''
  })
}

onMounted(() => {
  createSearchForm()
})

defineOptions({
  name: 'SearchHeader',
})
</script>
