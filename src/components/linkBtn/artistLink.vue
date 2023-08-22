<script setup lang="ts">
import { NButton } from 'naive-ui'

const props = defineProps<{
  id: string | number
}>()

</script>

<template>
  <n-button text @click="$router.push({
    path: '/artistDetail',
    query: {
      id: props.id
    }
  })">
    <slot></slot>
  </n-button>
</template>