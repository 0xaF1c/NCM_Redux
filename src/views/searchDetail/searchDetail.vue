<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useRequest } from 'vue-request'
import { useRoute } from 'vue-router'
import { search } from '../../requests/search'
import { formatPlaylist } from '../../utils/formatPlaylist'
import { NScrollbar, useLoadingBar } from 'naive-ui'

import playlistDetail from '../../components/playlistDetail/playlistDetail.vue'


const { start, error, finish } = useLoadingBar()


start()
const route = useRoute()

const playlist = ref()

const matadata = reactive<PlaylistMatadata>({
  id: -1,
  name: '搜索结果 - ' + route.query.keywords,
  coverImgUrl: '',
  userId: 0,
  createTime: 0,
  playCount: -1,
  trackCount: -1,
  tags: [],
  description: '这只是你的搜索结果'
})
const { run, loading, data } = useRequest(search, {
  onSuccess() {
    const songs = data.value.data.result.songs
    if (songs === undefined) {
      matadata.name = '搜索结果 - 什么都没搜到 关于 - ' + route.query.keywords
      
      error()
    } else {
      const formatted = formatPlaylist(songs)
      renderPlaylist.value = formatted.slice(0, limit.value)
      matadata.coverImgUrl = formatted[0]?.album.picUrl
      playlist.value = formatted
      finish()
    }
    
    
  }
})
const update = () => {
  start()
  run(route.query.keywords, 1)
  matadata.name = '搜索结果 - ' + route.query.keywords
}
update()
watch(
  () => route.query,
  () => {
    update()
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
  <n-scrollbar :on-scroll="onScroll">
    <playlist-detail :all-playlist="playlist!" :render-playlist="renderPlaylist!" :playlist-matadata="matadata!" />
  </n-scrollbar>
</template>