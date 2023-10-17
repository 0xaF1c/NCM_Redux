<script setup lang="ts">
import {
  NScrollbar
} from 'naive-ui'
import { useRequest } from 'vue-request'
import playlistDetail from '../../components/playlistDetail/playlistDetail.vue'

import { personalFm } from '../../requests/personalFm'

import { reactive, ref } from 'vue'
import { formatFmPlaylist } from '../../utils/formatPlaylist'
import { PlaylistMatadata } from '../../types'
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
    
    
    matadata.coverImgUrl = formatted[0].album.picUrl
    renderPlaylist.value = formatted.slice(0, limit.value)
    playlist.value = formatted
  }
})

const renderPlaylist = ref()
const limit = ref(20)
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
    <playlist-detail :all-playlist="playlist!" :render-playlist="renderPlaylist!"  :playlist-matadata="matadata!" />
  </n-scrollbar>
</template>
