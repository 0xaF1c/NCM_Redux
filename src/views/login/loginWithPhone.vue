<script setup lang="ts">
import { NButton, NInput, NSpace, NCard, NText } from 'naive-ui'

</script>

<template>
  <n-space vertical>
    <n-input placeholder="输入邮箱or手机号" />
    <n-input placeholder="输入验证码" />
    <n-button type="primary">登录</n-button>
  </n-space>
</template>