<script setup lang="ts">
import {
  NScrollbar,
  NBreadcrumb,
  NBreadcrumbItem,
  NIcon
} from 'naive-ui'
import { 
  Home24Filled,
  MusicNote124Filled
} from '@vicons/fluent'
import { useRequest } from 'vue-request'
import playlistDetail from '../../components/playlistDetail/playlistDetail.vue'

import { reactive, ref } from 'vue'
import { formatPlaylist } from '@/utils/formatPlaylist'
import { PlaylistMatadata } from '@/types'
import { recordRecentSong } from '@/requests/recordRecentSong'
const playlist = ref()

const matadata = reactive<PlaylistMatadata>({
  id: -1,
  name: '最近播放',
  coverImgUrl: '',
  userId: 0,
  createTime: 0,
  playCount: 0,
  trackCount: 0,
  tags: [],
  description: ''
})
const { data, run } = useRequest(recordRecentSong, {
  onSuccess() {    
    const formatted = formatPlaylist(data.value?.data.data.list.map(item => item.data))
    
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
