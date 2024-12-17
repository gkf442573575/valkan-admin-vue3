<template>
  <div class="vk-layout-header__icons" :title="isFullscreen ? '取消全屏' : '全屏'" @click="toggle">
    <OffScreen v-if="isFullscreen" />
    <FullScreen v-else />
  </div>
</template>

<script setup lang="ts">
import { useFullscreen } from '@vueuse/core'

import { FullScreen, OffScreen } from '@icon-park/vue-next'

const { toggle, isFullscreen } = useFullscreen()
</script>
