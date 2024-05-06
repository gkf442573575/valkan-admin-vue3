<template>
  <div
    class="w_10_h_10 flex_align_center flex_justify_center"
    style="overflow: hidden; flex-direction: column"
  >
    <div id="error-404" ref="error404Ref" class="lottie-error"></div>
    <el-button type="primary" round @click="backHome">返回首页</el-button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import lottie, { type AnimationItem } from 'lottie-web'

import animation404 from '@/assets/lotties/404.json'
const $router = useRouter()

const error404Ref = ref<HTMLDivElement>()

let lottieAni: AnimationItem | null = null

const backHome = () => {
  $router.push({
    path: '/',
    replace: true
  })
}

onMounted(() => {
  if (error404Ref.value) {
    lottieAni = lottie.loadAnimation({
      container: error404Ref.value,
      renderer: 'svg',
      loop: true,
      autoplay: false,
      animationData: animation404
    })
  }
})

// 清除掉动画
onBeforeUnmount(() => {
  if (lottieAni) {
    lottieAni.destroy()
  }
})

defineOptions({
  name: 'error-404'
})
</script>

<style lang="scss" scoped>
.lottie-error {
  width: 600px;
  margin-bottom: 40px;
}
</style>
