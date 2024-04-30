<template>
  <div class="w_10_h_10 vk-login">
    <div class="vk-login-card postiopn_center">
      <div class="vk-login-desc flex_align_center">
        <h2 class="vk-login-desc__title">{{ appTitle }}</h2>
        <div class="vk-login-desc__content">
          <svg-icon name="login" width="100"></svg-icon>
        </div>
      </div>
      <div class="vk-login-box">
        <div class="vk-login-box__title">Login</div>
        <el-form ref="loginFormRef" class="vk-login-form" :model="loginForm" :rules="loginRules">
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名(admin)"
              size="large"
              clearable
            >
              <template #prefix>
                <el-icon class="el-input__icon"><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              placeholder="请输入用户密码(123456)"
              size="large"
              clearable
              show-password
            >
              <template #prefix>
                <el-icon class="el-input__icon"><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item class="vk-login-btn_item">
            <el-button class="vk-login-btn" size="large" round @click="login" :loading="isLoading">
              {{ isLoading ? '登录中' : '登 录' }}
            </el-button>
            <div class="vk-login-qs flex_align_center"><span>登录问题?</span></div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import type { LoginForm } from '@/types/index'

import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { MD5 } from 'crypto-js'
import { ElMessage, ElNotification } from 'element-plus'

import { User, Lock } from '@element-plus/icons-vue'

import { timeWelcom } from '@/utils/index'
import { useAuthStore } from '@/stores/auth'

const appTitle = import.meta.env.VITE_APP_TITLE

const authStore = useAuthStore()
const $router = useRouter()
const $route = useRoute()

const loginFormRef = ref<FormInstance>()
const loginForm = reactive<LoginForm>({
  username: '',
  password: ''
})
const loginRules = reactive<FormRules<LoginForm>>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})

const isLoading = ref(false)

const login = async () => {
  if (!loginFormRef.value) {
    return
  }
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      isLoading.value = true
      try {
        await authStore.login({
          username: loginForm.username,
          password: MD5(loginForm.password).toString()
        })
        isLoading.value = false
        ElNotification({
          title: timeWelcom(loginForm.username),
          message: '欢迎回来',
          type: 'success',
          duration: 2000
        })
        const redirect = $route.query.redirect?.toString() || '/'
        $router.replace({
          path: redirect
        })
      } catch (error) {
        isLoading.value = false
        ElMessage.error('登录失败')
      }
    } else {
      console.log('error login')
    }
  })
}

defineOptions({
  name: 'vk-login'
})
</script>

<style lang="less" src="./styles/index.less"></style>
