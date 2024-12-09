<template>
  <el-popover placement="bottom" :width="200" trigger="click">
    <template #reference>
      <el-avatar
        class="bg-primary text-white text-base cursor-pointer shadow-[0_0_10px_var(--el-color-primary-light-2)]"
      >
        {{ firstName.toUpperCase() }}
      </el-avatar>
    </template>
    <template #default>
      <ul class="w-full overflow-hidden">
        <li
          class="p-1 border-b border-el last:border-b-0 cursor-pointer"
          v-for="item in actions"
          :key="item.name"
          @click="item.action()"
        >
          <div
            class="h-10 leading-10 text-center rounded hover:bg-el-page hover:text-primary hover:font-semibold"
          >
            {{ item.title }}
          </div>
        </li>
      </ul>
    </template>
  </el-popover>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const firstName = computed(
  () => (authStore.user && authStore.user.username && authStore.user.username[0]) || '',
)

const actions = [
  {
    name: 'User',
    title: '个人中心',
    action: () => {
      console.log('user')
    },
  },
  {
    name: 'ChangePwd',
    title: '修改密码',
    action: () => {
      console.log('change pwd')
    },
  },
  {
    name: 'Logout',
    title: '退出登录',
    action: () => {
      authStore.loginOut()
    },
  },
]

defineOptions({ name: 'Avatar' })
</script>
