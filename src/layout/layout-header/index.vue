<template>
  <div class="vk-layout-header flex_align_center">
    <h2 class="vk-app-title">{{ appTitle }}</h2>
    <div class="vk-layout-menus"></div>
    <!-- 是否展示tab -->
    <LayoutTab />
    <!-- 是否布局类型 -->
    <LayoutType />
    <!--主题-->
    <Theme />
    <!-- 是否头像 -->
    <Avatar />
  </div>
</template>

<script setup lang="ts">
import LayoutTab from '../components/layout-tab.vue'
import LayoutType from '../components/layout-type.vue'
import Avatar from '../components/avatar.vue'
import Theme from '../components/theme.vue'

const appTitle = import.meta.env.VITE_APP_TITLE

defineOptions({
  name: 'vk-layout-header'
})
</script>
