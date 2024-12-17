<template>
  <component
    :is="menusType"
    :is-fold="isFold"
    @fold="emits('fold')"
    @subaside-change="(hasSubAside: boolean) => emits('subaside-change', hasSubAside)"
  ></component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import MenusDefault from './menus-default.vue'
import MenusSubaside from './menus-subaside.vue'

const props = defineProps({
  layout: {
    type: String,
    default: 'default'
  },
  isFold: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits<{
  (e: 'fold'): void
  (e: 'subaside-change', hasSubAside: boolean): void
}>()

const menusType = computed(() => `vk-layout-menus__${props.layout}`)

defineOptions({
  name: 'vk-layout-menus',
  components: {
    [MenusDefault.name as string]: MenusDefault,
    [MenusSubaside.name as string]: MenusSubaside
  }
})
</script>
