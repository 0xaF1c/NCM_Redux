<script setup lang="ts">
import { http } from '../../utils/request'
import { NButton, NInput, NSpace, NInputGroup, useMessage } from 'naive-ui'
import { reactive } from 'vue'
import { useRequest } from 'vue-request'

const message = useMessage()
const state = reactive({
  cellphone: '', // 手机号
  captcha: '', // 验证码
  // 手机号校验正则
  cellphoneReg: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
  sendCaptchaLoading: false, // 发送验证码按钮 加载状态
  sendButtonText: '发送', // 发送验证码按钮 文字
  sendButtonDisabled: false, // 发送验证码按钮 可点击状态
  loginLoding: false // 登录按钮 加载状态
})
/**
 * 返回 axios response
 * @api /captcha/sent
 */
const sendCaptchaFn = () => {
  return http.get('/captcha/sent', {
    params: {
      phone: state.cellphone
    }
  })
}
/**
 * 返回 axios response
 * @api /login/cellphone
 */
const loginWithPhoneFn = () => {
  return http.get('/login/cellphone', {
    params: {
      phone: state.cellphone,
      captcha: state.captcha
    }
  })
}
// 创建request
const sendCaptchaReq = useRequest(sendCaptchaFn, {
  onSuccess() {
    state.sendCaptchaLoading = false
    console.log(sendCaptchaReq.data)
    
    message.success('验证码发送成功ψ(｀∇´)ψ')
  },
  onError() {
    const { error } = sendCaptchaReq
    // @ts-ignore
    const errorMessage = error.value?.response.data.message || error.value?.name
    // @ts-ignore
    const code = error.value?.response.data.code || ''
    
    message.error(`code: ${code}, ${errorMessage}`)
    state.sendCaptchaLoading = false
  }
})
// 创建request
const loginWithPhoneReq = useRequest(loginWithPhoneFn, {
  onSuccess() {
    state.loginLoding = false

    console.log(loginWithPhoneReq.data);
    
  },
  onError() {
    const { error } = loginWithPhoneReq
    // @ts-ignore
    const errorMessage = error.value?.response.data.message || error.value?.name
    // @ts-ignore
    const code = error.value?.response.data.code || ''
    
    message.error(`code: ${code}, ${errorMessage}`)
    state.loginLoding = false
  }
})

// 绑定 @click
const sendCaptcha = () => {
  state.sendCaptchaLoading = true
  sendCaptchaReq.run()

  // 60秒后重试计时器
  state.sendButtonDisabled = true
  let count = 60
  const timer = setInterval(() => {
    state.sendButtonText = `请${count--}秒后重试`
    
    if (count <= 0) {
      state.sendButtonDisabled = false
      state.sendButtonText = `发送`
      clearInterval(timer)
    }
  }, 1000)
}
// 绑定 @click
const login = () => {
  loginWithPhoneReq.run()
  state.loginLoding = true
}



</script>

<template>
  <n-space style="padding: 5px;" vertical>
    <n-input type="text" placeholder="输入手机号" v-model:value="state.cellphone" 
        show-count
        maxlength="11" />
    <n-input-group>
      <n-input
        placeholder="输入验证码"
        v-model:value="state.captcha"
        show-count
        maxlength="4"
      />
      <n-button
        @click="sendCaptcha"
        :disabled="(state.cellphone.match(state.cellphoneReg)? false: true) || state.sendButtonDisabled"
        :loading="state.sendCaptchaLoading"
        ghost
      >{{ state.sendButtonText }}</n-button>
    </n-input-group>
    <n-button
      :disabled="state.cellphone.length <= 0 || state.captcha.length <= 0"
      :loading="state.loginLoding"
      strong
      @click="login"
      block
      type="primary"
    >登录</n-button>
  </n-space>
</template>