<script setup lang="ts">

import {
  NLayoutHeader,
  NButton,
  NSwitch,
  NIcon,
  GlobalTheme,
  NInput,
  NText,
  NSpace,
  NAvatar,
  useLoadingBar,
  useMessage
} from 'naive-ui'
import searchView from './searchView.vue'

import { useToggleTheme } from '../../utils/toggleTheme'
import { WeatherMoon16Filled, WeatherSunny16Filled } from '@vicons/fluent'
import { reactive } from 'vue'
import { useRequest } from 'vue-request'
import { getUserStatus } from '@/requests/getUserStatus'
import { useStore } from 'vuex'

const store = useStore()

const { theme, toggleTheme, currentTheme, currentThemeBool } = useToggleTheme()
const { start, finish, error } = useLoadingBar()
const { success, info } = useMessage()

const props = defineProps<{
  show: boolean
  theme: GlobalTheme | null
}>()

const emits = defineEmits<{
  (e: 'update:theme', data: GlobalTheme | null): void
  (e: 'update:show', data: boolean): void
}>()

const onThemeToggle = () => {
  toggleTheme()
  emits('update:theme', theme.value)
}
const onLoginViewShow = () => {
  console.log(state.profile)
  if (state.profile == null) {
    emits('update:show', !props.show)
  } else {
    info('你已经登录了 请先注销')
    emits('update:show', false)
  }
}


const state = reactive<any>({
  profile: null
})



if (store.getters.userStatus?.profile == null) {
  info('您还未登录')
  const { data, run } = useRequest(getUserStatus, {
    onSuccess() {
      //@ts-ignore
      const status = data.value.data.data
      state.profile = status.profile

      if (status.profile != null) {
        store.commit('updateUserStatus', status)
        success('获取状态成功')
      }
      finish()
    },
    onError() {
      error()
    }
  })
  start()
  run()
} else {
  state.profile = store.state.userStatus.profile
}
</script>

<template>
  <n-layout-header style="z-index: 10" bordered class="header">
    <n-text>
      Logo
    </n-text>
    <searchView />

    <n-space align="center" justify="space-between">
      <n-switch v-model:value="currentThemeBool" @click="onThemeToggle" size="large">
        <template #icon>
          <n-icon v-show="currentTheme == 'light'" :component="WeatherSunny16Filled"></n-icon>
          <n-icon v-show="currentTheme == 'dark'" :component="WeatherMoon16Filled"></n-icon>
        </template>
      </n-switch>

      <n-avatar :src="state.profile?.avatarUrl || '/default.png'" @click="onLoginViewShow" size="large" circle />
    </n-space>
  </n-layout-header>
</template>

<style scoped lang="less">
@import url('@/styles/varible.less');

.n-input {
  width: 400px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: @total-padding-left;
  padding-right: @total-padding-right;
}

.n-avatar {
  display: flex;
  align-items: center;
  cursor: pointer;
}
</style>