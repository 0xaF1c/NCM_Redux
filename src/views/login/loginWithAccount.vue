<script setup lang="ts">
import { http } from '@/utils/request';
import { AxiosResponse } from 'axios';
import { NButton, NInput, NSpace, useMessage } from 'naive-ui'
import { reactive, ref } from 'vue'
import { useRequest } from 'vue-request';

const state = reactive({
  account: '',
  password: '',
  loading: false
})

const message = useMessage()

/**
 * 检查账号是email还是cellphone
 * @param account
 */
function checkAccountFormat(account: string) {
  return account.match(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/) ? 'email' : 'phone'
}
/**
 * 定义登录请求函数类型
 */
type LoginRequest = (account: string, password: string) => Promise<AxiosResponse>
/**
 * 使用手机号密码登录
 * @param account 手机号
 * @param password 密码
 */
const loginWithPhone: LoginRequest = (account: string, password: string) => {
  return http.get('/login/cellphone?', {
    params: {
      phone: account,
      password
    }
  })

}
/**
 * 使用邮箱密码登录
 * @param account 邮箱
 * @param password 密码
 */
const loginWithEmail: LoginRequest = (account: string, password: string) => {
  return http.get('/login', {
    params: {
      email: account,
      password
    }
  })
}

/**
 * 使用vue-request处理传入的 axios 请求函数
 * @param request loginWithPhone or loginWithEmail
 */
const requestHandler = (request: LoginRequest) => {
  const {run, loading, data, error} = useRequest(request, {
    defaultParams: [
      state.account,
      state.password
    ],
    onSuccess() {
      const res : any = data.value?.data
      if (res.code == 502) {
        message.error(res.msg)
      } else {
        console.log(res)
        message.success('登录成功')
      }
      state.loading = false
    },
    onError() {
      // @ts-ignore 这个好怪
      const errorMessage = error.value?.response.data.message || error.value?.name
      // @ts-ignore
      const code = error.value?.response.data.code || ''
      
      message.error(`code: ${code}, ${errorMessage}`)
      state.loading = false
    }
  })
  state.loading = true

  run(state.account, state.password)
}
// 绑定登录按钮
const login = () => {
  const accountType: 'phone' | 'email' = checkAccountFormat(state.account)
  if (accountType === 'email') {
    requestHandler(loginWithEmail)
  } 
  else if (accountType === 'phone') {
    requestHandler(loginWithPhone)
  }
}

</script>


<template>
  <n-space style="padding: 5px;" vertical>
    <n-input type="text" v-model:value="state.account" placeholder="输入邮箱or手机号" />
    <n-input type="password" show-password-on="click" v-model:value="state.password" placeholder="输入密码" />
    <n-button
      strong
      block
      type="primary"
      :loading="state.loading"
      @click="login"
      :disabled="state.account.length <= 0 || state.password.length <= 0"
      >登录</n-button>
  </n-space>
</template>