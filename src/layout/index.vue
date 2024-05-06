<template>
  <div class="vk-layout w_10_h_10">
    <LayoutHeader />
    <div class="vk-layout-main">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import LayoutHeader from './layout-header/index.vue'

defineOptions({
  name: 'vk-layout'
})
</script>

<style lang="scss" src="./index.scss"></style>
