<template>
  <component :is="iconName" v-bind="$attrs" class="park-icon"></component>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import * as ParkIcons from '@icon-park/vue-next'

const props = defineProps({
  icon: {
    type: String,
    default: 'application-menu'
  }
})

const firstUpStr = (str: string) => {
  return str[0].toUpperCase() + str.substring(1)
}

const iconNameList = computed(() => Object.keys(ParkIcons))

const iconName = computed(() => {
  let name = props.icon
  name = name
    .split('-')
    .map((item) => firstUpStr(item))
    .join('')

  return iconNameList.value.includes(name) ? name : 'ApplicationMenu'
})

defineOptions({
  name: 'park-icon',
  components: {
    ...ParkIcons
  }
})
</script>
