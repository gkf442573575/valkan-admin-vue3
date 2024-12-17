<template>
  <el-input v-model="msg"></el-input>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

const msg = ref('system account')

onMounted(() => {
  console.log('mounted')
})

defineOptions({
  name: 'SystemAccount'
})
</script>
