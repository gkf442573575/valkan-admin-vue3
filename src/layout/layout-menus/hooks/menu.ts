import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useAuthStore } from '@/stores/auth'
export const useAppMenus = () => {
  const $router = useRouter()
  const $route = useRoute()

  const { appMenus } = storeToRefs(useAuthStore())

  const active = ref<string>('')

  const select = (index: any, indexPath: any, item: any) => {
    const menuItem = appMenus.value.find((item) => item.id === index)
    if (menuItem && menuItem.path) {
      $router.push({
        path: menuItem.path
      })
    }
  }

  watch(
    () => $route.fullPath,
    () => {
      const currentId = ($route.meta.id || '') as string
      active.value = currentId
    },
    {
      immediate: true
    }
  )

  return {
    active,
    select,
  }
}
