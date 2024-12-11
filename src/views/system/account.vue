<template>
  <div>{{ msg }}</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const msg = ref('system account')
setTimeout(() => {
  msg.value = 'system account test'
}, 1000)
defineOptions({
  name: 'system-account'
})
</script>
