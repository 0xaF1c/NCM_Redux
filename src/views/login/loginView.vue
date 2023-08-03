<script lang="ts" setup>

import { NButton,  NModal, NSpace, NCard, useLoadingBar, NTabs, NTabPane } from 'naive-ui'
import { ref } from 'vue'
import loginWithAccount from './loginWithAccount.vue'
import loginWithQrCode from './loginWithQrCode.vue'
import loginWithPhone from './loginWithPhone.vue'

const qrCodePage = ref(true)
const props = defineProps({
  show: {
    default: true
  }
})
</script>

<template>
  <n-modal preset="card" @update:show="value => $emit('update:show', value)" :show="props.show" :style="{width: '400px'}">
    <n-tabs :tabs-padding="5" v-if="!qrCodePage" animated :show-dots="false">
      <n-tab-pane name="账号登录">
        <loginWithAccount class="loginCard"/>
      </n-tab-pane>
      <n-tab-pane name="手机验证码登录">
        <loginWithPhone class="loginCard" />
      </n-tab-pane>
    </n-tabs>
    <loginWithQrCode v-if="qrCodePage" class="loginCard" />

    <template #action>
      <n-space justify="center">
        <n-button text tag="a" type="tertiary" @click="qrCodePage = !qrCodePage">
          {{ qrCodePage ? '其他登录方式' : '使用二维码登录 (推荐)' }}
        </n-button>
      </n-space>
    </template>
  </n-modal>
</template>