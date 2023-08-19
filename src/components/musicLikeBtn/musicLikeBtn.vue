<script setup lang="ts">
import {
  Heart24Regular,
  Heart24Filled,
} from '@vicons/fluent'

import {
  NButton,
  NIcon,
  useMessage
} from 'naive-ui'

import { useStore } from 'vuex'
import { ref, onMounted, watch } from 'vue'

const liked = ref(false)
const store = useStore()

const props = defineProps<{
  id: number
}>()

const musicLiked = (id: number) => store.state.likelist.includes(id)
const { info } = useMessage()

const onMusicLike = () => {
  const _id = props.id
  
  if (_id == undefined || _id == null) return

  if (liked.value) {
    store.commit('unlike', { id: _id })
    info('取消喜欢成功')
  } else {
    store.commit('like', { id: _id })
    info('已成功添加到我喜欢的音乐')
  }
  liked.value = musicLiked(_id)
}

watch(
  () => props.id,
  () => {
    liked.value = musicLiked(props.id)
  }
)
onMounted(() => {
  setTimeout(() => {
    liked.value = musicLiked(props.id)
  }, 1000)
})
</script>

<template>
  <n-button circle quaternary @click="onMusicLike">
    <template #icon>
      <n-icon v-show="!liked" :component="Heart24Regular" />
      <n-icon v-show="liked" :component="Heart24Filled" />
    </template>
  </n-button>
</template>