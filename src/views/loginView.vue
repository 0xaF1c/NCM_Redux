<script lang="ts" setup>

import { NButton, NSwitch, NSpace, NCard, useLoadingBar, NCarousel } from 'naive-ui'
import { ref } from 'vue'
import loginWithAccount from './login/loginWithAccount.vue'
import loginWithQrCode from './login/loginWithQrCode.vue'
import loginWithPhone from './login/loginWithPhone.vue'

const activePage = ref(0)
const loadingBar = useLoadingBar()

const loading = () => loadingBar.start()
const finish = () => loadingBar.finish()
const error = () => loadingBar.error()

window.loading = loading
window.finish = finish
window.error = error

</script>

<template>

<n-card>
  <n-space justify="center" vertical>
    <n-switch
      checked-value="0"
      unchecked-value="1"
      size="large"
      @update:value="value => activePage = value">
      <template #unchecked>使用账号密码登录</template>
      <template #checked>使用手机号登录</template>
    </n-switch>
    <n-carousel :show-dots="false" :current-index="activePage">
      <loginWithAccount class="loginCard" :class="activePage" />
      <loginWithPhone class="loginCard" :class="activePage" />
    </n-carousel>
  </n-space>

  <loginWithQrCode class="loginCard" :class="activePage" />

  <n-space>
    <n-button text tag="a" type="tertiary">使用二维码登录</n-button>
  </n-space>
</n-card>
</template>

<style scoped lang="less">
.n-card {
  max-width: 500px;
  margin: 0 auto;
  overflow: hidden;

}
.container {
  width: 200%;
  .loginCard {
    max-width: 100%;
    min-width: 100%;
    width: 100%;
  }

}
</style>