<template>
  <div class="w_10_h_10 vk-login">
    <div class="vk-login-card postiopn_center">
      <div class="vk-login-card__desc flex_align_center">
        <h2 class="app-title">{{ appTitle }}</h2>
      </div>
      <div class="vk-login-card__form"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const appTitle = computed(() => import.meta.env.VITE_APP_TITLE)

defineOptions({
  name: 'vk-login'
})
</script>

<style lang="less" src="./styles/index.less"></style>
