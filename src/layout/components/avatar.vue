<template>
  <el-popover placement="bottom" :width="200" trigger="click">
    <template #reference>
      <el-avatar>{{ userName && userName.toUpperCase() }}</el-avatar>
    </template>
    <template #default>
      <ul class="vk-avatar-action">
        <li class="vk-avatar-action_item">
          <div class="action">修改密码</div>
        </li>
        <li class="vk-avatar-action_item">
          <div class="action" @click="loginOut">退出登录</div>
        </li>
      </ul>
    </template>
  </el-popover>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const userName = computed(
  () => authStore.user && authStore.user.username && authStore.user.username[0]
)

// 退出登录
const loginOut = () => {}

defineOptions({
  name: 'vk-header-avatar'
})
</script>

<style lang="scss" scoped>
.el-avatar {
  margin-left: 8px;
  background-color: var(--el-color-primary);
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  box-shadow: 0px 0px 10px var(--el-color-primary-light-2);
}

.vk-avatar-action {
  width: 100%;
  overflow: hidden;
  .vk-avatar-action_item {
    border-bottom: 1px solid var(--el-border-color);
    padding: 5px 0;
    .action {
      height: 40px;
      text-align: center;
      line-height: 40px;
      border-radius: 4px;
      cursor: pointer;
      &:hover {
        background-color: var(--el-bg-color-page);
        color: var(--el-color-primary);
        font-weight: bold;
      }
    }

    &:last-child {
      border-bottom: none;
    }
  }
}
</style>
