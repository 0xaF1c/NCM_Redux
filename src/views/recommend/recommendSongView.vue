<script setup lang="ts">
import { useRequest } from 'vue-request'
import playlistDetail from '../../components/playlistDetail/playlistDetail.vue'

import { recommendSongs } from '../../requests/recommendSongs'

import { reactive } from 'vue'
const { data, run } = useRequest(recommendSongs)

run()
const matadata = reactive({
  id: 0,
  name: '每日退歌曲推荐',
  coverImgUrl: '',
  userId: 0,
  createTime: 0,
  playCount: 0,
  trackCount: 0,
  tags: [],
  description: '根据你的音乐口味生成，每天6:00更新'
})
</script>

<template>
  <playlist-detail :playlist="data?.data.data.dailySongs" :playlist-matadata="matadata"></playlist-detail>
</template>