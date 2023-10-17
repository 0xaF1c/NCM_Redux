<script lang="ts">

import { defineComponent, ref, reactive, watch } from 'vue'
import { NModal, NCard, NSpace, NButton, NAvatar } from 'naive-ui'
import { http } from '../../utils/request'
import { useRequest } from 'vue-request'
import { login } from '../../utils/auth'

// 获取二维码授权码
const getQrCodeKey = async () => {
  return (await http.get(`/login/qr/key?timerstamp=${Date.now()}`)).data.data.unikey
}

// 获取二维码
const getQrCode = async (key: string) => {
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
export default defineComponent({
  emits: [
    'update:text',
    'loginSuccess'
  ],
  props: {
    polling: {
      type: Boolean
    }
  },
  components: {
    NModal,
    NCard,
    NSpace,
    NButton,
    NAvatar
  },
  mounted() {
    this.updateQrCode()
    .then(_ => {
      this.pollingQrCheckRequest.run(this.qrCodeUniKey)
    })
    this.$emit('update:text', '打开网易云音乐APP扫码登录')
  },
  setup(props, context) {
    const qrCode = ref()
    const qrCodeUniKey = ref()
    const qrCodeInfo = ref('请使用网易云APP扫码登录')
    const userShow = ref(false)
    const userinfo = reactive({
      nickname: '',
      avatar: ''
    })

    async function updateQrCode() {
      const key = await getQrCodeKey()
      qrCodeUniKey.value = key
      qrCode.value = await getQrCode(key)
    }

    const pollingQrCheckRequest = useRequest(pollingQrCheck, {
      pollingInterval: 2000,
      onSuccess: (res) => {
        const result = res.data

        if (result.code === 800) {
          updateQrCode()
          qrCodeInfo.value = '二维码已失效，请重新扫码'
          userShow.value = false

        } else if (result.code === 802) {
          userinfo.nickname = result.nickname
          userinfo.avatar = result.avatarUrl
          userShow.value = true

          qrCodeInfo.value = '扫描成功，请在手机上确认登录'
        } else if (result.code === 801) {
          qrCodeInfo.value = '打开网易云音乐APP扫码登录'
        } else if (result.code === 803) {
          qrCodeInfo.value = result.message
          const cookie = result.cookie

          login(cookie)
          pollingQrCheckRequest.cancel()
          context.emit('loginSuccess')
        }
      }
    })

    watch(
      () => props.polling,
      () => {
        if (props.polling) {
          pollingQrCheckRequest.run(qrCodeUniKey.value)
        } else {
          pollingQrCheckRequest.cancel()
        }
      }
    )

    watch(
      () => qrCodeInfo,
      () => {
        context.emit('update:text')
      }
    )

    return {
      qrCode,
      qrCodeInfo,
      qrCodeUniKey,
      updateQrCode,
      pollingQrCheckRequest,
      userShow,
      userinfo,
    }
  }
})
</script>

<template>
  <n-space justify="center">
    <img :src="qrCode?.data?.data.qrimg" v-show="!userShow">
    <n-card bordered v-show="userShow">
      <n-space align="center">
        <n-avatar round :src="userinfo.avatar" />
        <div>{{ userinfo.nickname }}</div>
      </n-space>
    </n-card>
  </n-space>
</template>