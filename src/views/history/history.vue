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
import { formatPlaylist } from '../../utils/formatPlaylist'
import { PlaylistMatadata, Playlist } from '../../types'
import { recordRecentSong } from '../../requests/recordRecentSong'
const playlist = ref<Playlist>()
const renderPlaylist = ref<Playlist>()
const limit = ref(10)

const matadata = reactive<PlaylistMatadata>({
  id: -1,
  name: '最近播放',
  coverImgUrl: '',
  userId: 0,
  createTime: 0,
  playCount: 0,
  trackCount: -1,
  tags: [],
  description: ''
})
const { data, run } = useRequest(recordRecentSong, {
  onSuccess() {
    
    const formatted = formatPlaylist(data.value?.data.data.list.map(item => item.data))
    
    
    
    renderPlaylist.value = formatted.slice(0, limit.value)
    playlist.value = formatted
    matadata.coverImgUrl = formatted[0].album.picUrl
  }
})

const getViewport = (el: HTMLElement) => {
  return el.scrollHeight - el.clientHeight
}
const onScroll = (e: Event) => {
  if (e.currentTarget?.scrollTop == getViewport(e.currentTarget)) {
    limit.value += 10
    renderPlaylist.value = playlist.value.slice(0, limit.value)
  }
}


run()
</script>

<template>
  <n-scrollbar :on-scroll="onScroll">
    <playlist-detail :render-playlist="renderPlaylist" :all-playlist="playlist" :playlist-matadata="matadata">
    </playlist-detail>
  </n-scrollbar>
</template>
