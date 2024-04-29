<template>
  <div class="vk-layout">
    <LayoutHeader />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import LayoutHeader from './layout-header/index.vue'

defineOptions({
  name: 'vk-layout'
})
</script>
