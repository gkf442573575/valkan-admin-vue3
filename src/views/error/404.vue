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
import { storeToRefs } from 'pinia'

import lottie, { type AnimationItem } from 'lottie-web'
import LottiePalette from 'lottie-palette'

import { useThemeStore } from '@/stores/theme'

import animation404 from '@/assets/lotties/404.json'
const $router = useRouter()

const { primary, primaryList, primaryDark2, isDark } = storeToRefs(useThemeStore())

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
      autoplay: true,
      animationData: animation404,
      rendererSettings: {
        progressiveLoad: false
      }
    })

    lottieAni.addEventListener('DOMLoaded', () => {
      const lp = new LottiePalette(error404Ref.value)
      lp.updateColor('rgb(38,91,255)', primary.value, true)
      lp.updateColor('rgb(31,65,179)', primaryDark2.value, true)
      lp.updateColor('rgb(114,150,254)', primaryList.value[3], true)
      if (isDark.value) {
        lp.updateColor('rgb(241,244,254)', '#1d1e1f', true)
      }
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
