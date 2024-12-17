<template>
  <div
    :class="[
      'vk-layout-menus subaside h-full',
      isFold ? 'fold' : '',
      subMenus.length ? '' : 'no-subaside'
    ]"
  >
    <ul
      class="vk-menus-main no-scrollbar h-full overflow-x-hidden overflow-y-auto float-left p-[10px] border-r border-r-el"
    >
      <li
        class="w-full h-[60px] rounded mb-2 py-[5px] cursor-pointer flex flex-col items-center text-xl hover:text-primary"
        v-for="item in mainMenus"
        :key="item.id"
        @click="mainChange(item)"
        :class="[item.id === activeMain ? 'bg-primary-light-9 text-primary' : '']"
      >
        <el-icon class="h-[30px]"><park-icon :icon="item.icon" :size="24"></park-icon></el-icon>
        <div class="vk-menus-main_label h-[20px] leadeing-[20px] text-sm">{{ $t(item.title || '') }}</div>
      </li>
    </ul>
    <div class="vk-menus-subaside h-full float-left">
      <el-scrollbar>
        <AppMenus :collapse="isFold" :menus-tree="subMenus" />
      </el-scrollbar>
      <el-icon :class="['vk-collapse-icon', isFold ? 'fold' : 'expand']" @click="emits('fold')">
        <ArrowRightBold />
      </el-icon>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { MenusTree } from '@/interfaces'

import { computed, watch, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

import { ArrowRightBold } from '@element-plus/icons-vue'

import { useAuthStore } from '@/stores/auth'

import AppMenus from './components/app-menus.vue'

defineProps<{
  isFold: boolean
}>()

const emits = defineEmits<{
  (e: 'fold'): void
  (e: 'subaside-change', hasSubAside: boolean): void
}>()

const route = useRoute()
const router = useRouter()

const { appMenusTree } = storeToRefs(useAuthStore())

const activeMain = ref('')
const subMenus = ref<MenusTree[]>([])

const mainMenus = computed(() => {
  return appMenusTree.value.filter((item) => item.isMain)
})

const mainChange = (item: MenusTree) => {
  router.push({
    path: item.path
  })
}

watch(
  () => route.fullPath,
  (val) => {
    const meta = route.meta
    if (meta.id) {
      activeMain.value = (meta.parentId === '#' ? meta.id : meta.parentId) as string
    }
    if (meta.parentId) {
      const find = appMenusTree.value.find((item) => item.id === meta.parentId)
      subMenus.value = (find && find.children) || []
    } else {
      subMenus.value = []
    }
  },
  {
    immediate: true
  }
)

watch(
  () => subMenus.value.length,
  (val) => {
    emits('subaside-change', val ? true : false)
  },
  {
    immediate: true
  }
)

defineOptions({
  name: 'vk-layout-menus__subaside'
})
</script>
