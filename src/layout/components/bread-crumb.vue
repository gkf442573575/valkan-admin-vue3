<template>
  <el-breadcrumb class="layout-bread-crumb flex-1 pr-4" :separator-icon="ArrowRight">
    <el-breadcrumb-item v-for="item in breadList" :key="item.name" :to="{ path: item.path }">
      <park-icon :icon="item.icon" style="margin-right: 4px"></park-icon>
      {{ $t(item.title || '') }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang="ts" setup>
import type { RouteLocationMatched } from 'vue-router'

import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { ArrowRight } from '@element-plus/icons-vue'

interface BreadItem {
  title: string
  name: string
  path: string
  icon?: string
}

const $route = useRoute()

const breadList = ref<BreadItem[]>([])

// 创建面包屑列表
const createBreadList = (matchArr: RouteLocationMatched[]) => {
  let matchList: RouteLocationMatched[] = []
  matchList = matchList.concat(matchArr)
  matchList.splice(0, 1)
  const newBreadList = []
  for (let i = 0; i < matchList.length; i++) {
    const { name, meta, path } = matchList[i]
    const len: number = newBreadList.length
    const breadItem = {
      title: meta && meta.title ? String(meta.title) : '',
      icon: meta && meta.icon ? String(meta.icon) : '',
      name: name?.toString() || '',
      path,
    }
    if (!len) {
      newBreadList.push(breadItem)
    } else {
      if (newBreadList[len - 1].title === meta.title) {
        // 说明父级路由和子路由一致
        newBreadList[len - 1] = breadItem
      } else {
        newBreadList.push(breadItem)
      }
    }
  }
  breadList.value = newBreadList
}

// 监听当前路由得变化
watch(
  () => $route.matched,
  (newVal, oldVal) => {
    createBreadList(newVal)
  },
  {
    deep: true,
    immediate: true,
  },
)

defineOptions({
  name: 'BreadCrumb',
})
</script>

<style lang="scss" scoped>
.layout-bread-crumb {
  &:deep(.el-breadcrumb__item) {
    .el-breadcrumb__inner {
      cursor: pointer;
    }
    &:first-child {
      .el-breadcrumb__inner {
        font-weight: bold;
        color: var(--el-text-color-primary);
      }
    }
  }
}
</style>
