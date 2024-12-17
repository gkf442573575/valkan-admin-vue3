<template>
  <div
    class="vk-login-container w-full h-full overflow-hidden relative bg-primary-light-5 bg-no-repeat"
  >
    <div
      class="w-[960px] h-[600px] rounded-[8px_40px_8px_40px] shadow-el absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <div
        class="float-left w-1/2 h-full p-5 bg-page rounded-[8px_0_0_40px] flex flex-col items-center"
      >
        <div class="w-full leading-[50px] text-primary font-semibold text-2xl">{{ APP_TITLE }}</div>
        <div class="w-full h-[400px] mt-10">
          <svg-icon name="login" width="100" class="w-full h-full"></svg-icon>
        </div>
      </div>
      <div class="float-left w-1/2 h-full p-5 bg-primary rounded-[0_40px_8px_0]">
        <div
          class="w-full leading-[60px] text-white text-2xl mt-5 mb-10 text-center"
          style="letter-spacing: 2px"
        >
          {{ $t('login.title') }}
        </div>
        <el-form class="login-form" ref="loginFormRef" :model="loginForm" :rules="loginRules">
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              :placeholder="$t('login.userplaceholder')"
              size="large"
              clearable
              @keyup.enter="login"
            >
              <template #prefix>
                <el-icon class="el-input__icon"><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              :placeholder="$t('login.passplaceholder')"
              size="large"
              clearable
              show-password
              @keyup.enter="login"
            >
              <template #prefix>
                <el-icon class="el-input__icon"><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item class="flex items-center">
            <el-button
              class="flex-1 bg-primary-light-3 border-primary-light-2 text-white font-semibold hover:shadow-el"
              size="large"
              round
              @click="login"
              :loading="isLoading"
            >
              {{ isLoading ? $t('login.loading_btn') : $t('login.btn') }}
            </el-button>
            <div class="vk-login-question ml-14 text-white cursor-pointer h-6 leading-6">
              {{$t('login.question')}}?
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LoginForm } from '@/interfaces'

import { ElNotification, ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { MD5 } from 'crypto-js'
import { useI18n } from 'vue-i18n'

import { User, Lock } from '@element-plus/icons-vue'

import { timeWelcom } from '@/utils/index'
import { useAuthStore } from '@/stores/auth'

const APP_TITLE = import.meta.env.VITE_APP_TITLE

const $router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n({useScope: 'global'})

const loginFormRef = ref<FormInstance>()
const loginForm = reactive<LoginForm>({
  username: '',
  password: ''
})

const loginRules = reactive<FormRules<LoginForm>>({
  username: [{ required: true, message: t('login.userplaceholder'), trigger: 'blur' }],
  password: [{ required: true, message: t('login.passplaceholder'), trigger: 'blur' }]
})

const isLoading = ref(false)

const login = () => {
  if (!loginFormRef.value) {
    return
  }
  loginFormRef.value.validate(async (valid) => {
    if (!valid) return
    isLoading.value = true
    try {
      await authStore.login({
        username: loginForm.username,
        password: MD5(loginForm.password).toString()
      })
      isLoading.value = false
      // 登录成功
      ElNotification({
        title: timeWelcom(loginForm.username),
        message: t('login.comback'),
        type: 'success',
        duration: 2000
      })
      $router.replace({
        path: '/',
        replace: true
      })
    } catch (error) {
      console.log(error)
      isLoading.value = false
      ElMessage.error(t('login.fail'))
    }
  })
}

defineOptions({ name: 'VkLogin' })
</script>

<style lang="scss" scoped>
.vk-login-container {
  background-image: radial-gradient(closest-side, rgb(255, 255, 255), rgba(235, 105, 78, 0)),
    radial-gradient(closest-side, rgb(233, 186, 227), rgba(243, 11, 164, 0)),
    radial-gradient(closest-side, rgb(194, 204, 172), rgba(254, 234, 131, 0)),
    radial-gradient(closest-side, rgb(197, 248, 241), rgba(170, 142, 245, 0)),
    radial-gradient(closest-side, rgb(147, 136, 221), rgba(224, 195, 171, 0));
  background-size:
    130vmax 130vmax,
    80vmax 80vmax,
    90vmax 90vmax,
    110vmax 110vmax,
    90vmax 90vmax;
  background-position:
    -80vmax -80vmax,
    60vmax -30vmax,
    10vmax 10vmax,
    -30vmax -10vmax,
    50vmax 50vmax;
  animation: 6s loginbg_move linear infinite;
}

.vk-login-container {
  &:deep(.login-form.el-form) {
    .el-form-item {
      @apply mb-14;
    }
    .el-input__wrapper {
      @apply rounded-3xl shadow-[0_0_10px_2px_transparent];
      &.is-focus {
        @apply shadow-[0_0_10px_2px_var(--el-color-primary-light-4)];
      }
    }
    .el-input__inner {
      @apply outline-0 border-0 rounded-3xl;
    }
    .el-form-item__error {
      @apply mt-1 pl-4;
    }
  }
}

.vk-login-question {
  background: linear-gradient(
      to right,
      var(--el-color-primary-light-1),
      var(--el-color-primary-light-9)
    )
    no-repeat right bottom;
  background-size: 0 2px;
  transition: background-size 0.3s;
  &:hover {
    background-position: left bottom;
    background-size: 100% 2px;
  }
}

@keyframes loginbg_move {
  0%,
  100% {
    background-size:
      130vmax 130vmax,
      80vmax 80vmax,
      90vmax 90vmax,
      110vmax 110vmax,
      90vmax 90vmax;
    background-position:
      -80vmax -80vmax,
      60vmax -30vmax,
      10vmax 10vmax,
      -30vmax -10vmax,
      50vmax 50vmax;
  }
  25% {
    background-size:
      100vmax 100vmax,
      90vmax 90vmax,
      100vmax 100vmax,
      90vmax 90vmax,
      60vmax 60vmax;
    background-position:
      -60vmax -90vmax,
      50vmax -40vmax,
      0vmax -20vmax,
      -40vmax -20vmax,
      40vmax 60vmax;
  }
  50% {
    background-size:
      80vmax 80vmax,
      110vmax 110vmax,
      80vmax 80vmax,
      60vmax 60vmax,
      80vmax 80vmax;
    background-position:
      -50vmax -70vmax,
      40vmax -30vmax,
      10vmax 0vmax,
      20vmax 10vmax,
      30vmax 70vmax;
  }
  75% {
    background-size:
      90vmax 90vmax,
      90vmax 90vmax,
      100vmax 100vmax,
      90vmax 90vmax,
      70vmax 70vmax;
    background-position:
      -50vmax -40vmax,
      50vmax -30vmax,
      20vmax 0vmax,
      -10vmax 10vmax,
      40vmax 60vmax;
  }
}
</style>
