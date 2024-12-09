<template>
  <svg :class="svgClass" v-bind="$attrs" :style="{ color: color }">
    <use :xlink:href="svgHref" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps({
  name: {
    // 自定义svg的name属性
    type: String,
    required: true,
  },
  color: {
    // 自定义svg的color属性
    type: String,
    default: '',
  },
})

const svgHref = computed(() => `#svg-icon-${props.name}`)

const svgClass = computed(() => {
  if (props.name) {
    return `svg-icon svg-icon-${props.name}`
  }
  return 'svg-icon'
})

defineOptions({
  name: 'svg-icon',
})
</script>
