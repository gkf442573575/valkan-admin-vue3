<template>
  <component :is="menusType"></component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import MenusDefault from './menus-default.vue'

const props = defineProps({
  layout: {
    type: String,
    default: 'default'
  }
})

const menusType = computed(() => `vk-layout-menus__${props.layout}`)

defineOptions({
  name: 'vk-layout-menus',
  components: {
    [MenusDefault.name as string]: MenusDefault
  }
})
</script>
