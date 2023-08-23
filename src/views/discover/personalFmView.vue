<script setup lang="ts">
import {
  NScrollbar
} from 'naive-ui'
import { useRequest } from 'vue-request'
import playlistDetail from '../../components/playlistDetail/playlistDetail.vue'

import { personalFm } from '../../requests/personalFm'

import { reactive, ref } from 'vue'
import { formatFmPlaylist } from '@/utils/formatPlaylist'
import { PlaylistMatadata } from '@/types'
const playlist = ref()

const matadata = reactive<PlaylistMatadata>({
  id: -1,
  name: '私人FM',
  coverImgUrl: '',
  userId: 0,
  createTime: 0,
  playCount: 0,
  trackCount: 0,
  tags: [],
  description: '私人FM'
})
const { data, run } = useRequest(personalFm, {
  onSuccess() {
    const formatted = formatFmPlaylist(data.value?.data.data)
    
    playlist.value = formatted
    matadata.coverImgUrl = formatted[0].album.picUrl
  }
})

run()
</script>

<template>
  <n-scrollbar>
    <playlist-detail :playlist="playlist" :playlist-matadata="matadata">
    </playlist-detail>
  </n-scrollbar>
</template>
