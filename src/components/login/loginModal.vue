<script lang="ts">

import { defineComponent, ref } from 'vue'
import { NModal, NSpace, NButton, useMessage } from 'naive-ui'
import loginOuther from './loginOuther.vue'
import loginWithQrCode from './loginWithQrCode.vue'


export default defineComponent({
  components: {
    loginOuther,
    loginWithQrCode,
    NModal,
    NSpace,
    NButton
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    'update:show'
  ],
  setup(_, context) {
    const message = useMessage()
    const title = ref('登录')
    const page = ref<'qr' | 'outher'>('qr')
    const useOutherLogin = () => {
      if (page.value == 'qr') {
        page.value = 'outher'
        title.value = '登录'
      } else {
        page.value = 'qr'
      }
    }
    const onQrLoginSuccess = () => {
      message.success('扫码登录成功')
      setTimeout(() => {
        context.emit('update:show', false)
      }, 100)
    }

    return {
      title,
      page,
      useOutherLogin,
      onQrLoginSuccess
    }
  }
})
</script>

<template>
  <n-modal
    :show="show"
    @update-show="(v: any) => $emit('update:show', v)"

    preset="card"
    :style="{ width: '400px' }"
    size="huge"
    :bordered="true"
    :segmented="{ content: 'soft', footer: 'soft'}"
  >
    <loginOuther v-if="page === 'outher'" />
    <loginWithQrCode v-if="page === 'qr'" @update:text="v => title = v" @login-success="onQrLoginSuccess" :polling="show" />
    <template #header>
      <n-space justify="center">
        {{ title }}
      </n-space>
    </template>
    <template #action>
      <n-space justify="center">
        <n-button text page @click="useOutherLogin">
          {{ page === 'qr' ? '使用其他方式登录' : '使用二维码登录(推荐)' }}
        </n-button>
      </n-space>
    </template>
  </n-modal>
</template>