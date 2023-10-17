<script lang="ts">
import { NTabs, NTabPane } from 'naive-ui'
import { defineComponent } from 'vue'

import loginWithAccount from './loginWithAccount.vue'
import loginWithPhone from './loginWithPhone.vue'

export default defineComponent({
  components: {
    NTabs,
    NTabPane,
    loginWithAccount,
    loginWithPhone
  },
  setup() {

  }
})
</script>

<template>
  <n-tabs :tabs-padding="5" animated :show-dots="false">
    <n-tab-pane name="账号登录">
      <loginWithAccount class="loginCard"/>
    </n-tab-pane>
    <n-tab-pane name="手机验证码登录">
      <loginWithPhone class="loginCard" />
    </n-tab-pane>
  </n-tabs>
</template>