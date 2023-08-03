<script setup lang="ts">
import { NAvatar, NSpace, NCard, NSpin } from 'naive-ui'
import { reactive } from 'vue'
import { useRequest } from 'vue-request'
import { http } from '../../utils/request'
import { useMessage } from 'naive-ui'

const message = useMessage()

// 获取二维码授权码
const getQrCodeKey = async () => {
  return (await http.get(`/login/qr/key?timerstamp=${Date.now()}`)).data.data.unikey
}

// 获取二维码
const getQrCode = (key: string) => {
  return http.get(`/login/qr/create?key=${key}&qrimg=true&timerstamp=${Date.now()}`)
}

// 定义轮询检查
const pollingQrCheck = (unikey: string) => {
  return http.get(`/login/qr/check`, {
    params: {
      key: unikey,
      timerstamp: Date.now()
    }
  })
}
const state = reactive<any>({
  QrImg: '', // 二维码base64
  userAvatar: '', // 登录成功后显示的头像
  userNickname: '', // 登录成功后显示的用户名
  pollingQrCheckRequestMessage: '', // 轮询结果的消息
  getQrCodeLoding: true, // 申请二维码 loading状态
  loginSuccess: false, // 登录状态
})
// 用vue-request跑轮询
const pollingQrCheckRequest = useRequest(pollingQrCheck, {
  pollingInterval: 2000,
  defaultParams: [state.unikey],
  onSuccess: (res) => {
    // 待确认状态
    if (res.data.code == 802) {
      state.userAvatar = res.data.avatarUrl
      state.userNickname = res.data.nickname
      state.loginSuccess = true
    }

    // 授权成功
    if (res.data.code == 803) {
      message.success('登录成功')
      pollingQrCheckRequest.cancel()
      state.userAvatar = res.data.avatarUrl
      state.userNickname = res.data.nickname
      state.loginSuccess = true

    // 二维码失效
    } else if (res.data.code == 800) {
      message.success('二维码失效')
      pollingQrCheckRequest.cancel()
    }
    state.pollingQrCheckRequestMessage = res.data.message
  }
})
const getQrCodeRequest = useRequest(getQrCode, {
  onSuccess: () => {
    state.QrImg = getQrCodeRequest.data.value?.data.data.qrimg
  }
})

  ;; (async () => {
    const unikey = await getQrCodeKey()

    pollingQrCheckRequest.run(unikey)
    getQrCodeRequest.run(unikey)

    state.getQrCodeLoding = getQrCodeRequest.loading
  })()
</script>

<template>
  <n-space vertical>
    <div v-if="!state.loginSuccess">请使用客户端扫码</div>
    <n-spin size="large" :show="state.getQrCodeLoding" v-if="!state.loginSuccess">
      <img :src="state.QrImg">
    </n-spin>
    <n-card size="large" v-if="state.loginSuccess">
      <n-space align="center">
        <n-avatar round size="large" :src="state.userAvatar" />
        <h2>
          {{ state.userNickname }}
        </h2>
      </n-space>
    </n-card>

    <div>{{ state.pollingQrCheckRequestMessage }}</div>
  </n-space>
</template>

<style scoped lang="less">
.n-space {
  text-align: center;
  padding: 0;
}

</style>