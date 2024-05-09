<template>
  <div :class="['vk-layout-menus default', isCollapse ? 'collapse' : '']">
    <div class="vk-app-menus"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useLayoutStore } from '@/stores/layout'

const layoutStore = useLayoutStore()

const isCollapse = computed({
  get() {
    return layoutStore.isCollapse
  },
  set(val) {
    layoutStore.changeCollapse(val)
  }
})

defineOptions({
  name: 'vk-layout-menus__default'
})
</script>
