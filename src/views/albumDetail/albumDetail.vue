<script setup lang="ts">

import playlistDetail from '../../components/playlistDetail/playlistDetail.vue' 
import { album } from '../../requests/album'
import { Playlist, PlaylistMatadata } from '../../types'
import { formatPlaylist } from '../../utils/formatPlaylist'
import { useRequest } from 'vue-request'
import { ref, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const playlistMatadata: PlaylistMatadata = reactive({
  coverImgUrl: '',
  createTime: 0,
  description: '',
  id: -1,
  name: '',
  playCount: 0,
  trackCount: 0,
  tags: [],
  userId: 0,
})
const id = window.location.hash.split('?id=')[1]
const playlist = ref<Playlist>()

const { data, run } = useRequest(album, {
  onSuccess() {
    const formatted = formatPlaylist(data.value?.data.songs)    
    const album = data.value?.data.album        
    
    renderPlaylist.value = formatted.slice(0, limit.value)
    playlist.value = formatted
    playlistMatadata.coverImgUrl = album.picUrl
    playlistMatadata.name = album.name
    playlistMatadata.description = album.description
    playlistMatadata.trackCount = album.size
    playlistMatadata.id = album.id
  }
})
run(id)

watch(
  () => route.query,
  () => {
    run(route.query.id)
  }
)
const renderPlaylist = ref()
const limit = ref(20)
const getViewport = (el: HTMLElement) => {
  return el.scrollHeight - el.clientHeight
}
const onScroll = (e: Event) => {
  if (e.currentTarget?.scrollTop == getViewport(e.currentTarget)) {
    if (loading.value == false) {
      limit.value += 10
      renderPlaylist.value = playlist.value.slice(0, limit.value)
    }
  }
}
</script>

<template>
  <n-scrollbar>
    <playlist-detail :all-playlist="playlist!" :render-playlist="renderPlaylist!"  :playlist-matadata="playlistMatadata!" />
  </n-scrollbar>
</template>