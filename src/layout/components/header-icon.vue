<template>
  <el-tooltip v-if="useTooltip" :content="title" placement="bottom">
    <div
      class="layout-header-icon w-10 h-10 text-center rounded-full relative flex justify-center items-center mx-2 cursor-pointer hover:bg-info-light-7"
      v-bind="$attrs"
    >
      <slot></slot>
    </div>
  </el-tooltip>
  <div
    v-else
    class="layout-header-icon w-10 h-10 text-center rounded-full relative flex justify-center items-center mx-2 cursor-pointer hover:bg-info-light-7"
    v-bind="$attrs"
  >
    <slot></slot>
  </div>
</template>
<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  useTooltip: {
    type: Boolean,
    default: true
  }
})

defineOptions({
  name: 'LayoutHeaderIcon'
})
</script>

<style lang="scss">
.layout-header-icon {
  .i-icon {
    @apply text-tx-regular text-[22px];
  }
}
</style>
