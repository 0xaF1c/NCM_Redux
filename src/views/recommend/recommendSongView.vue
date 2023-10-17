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

import { recommendSongs } from '../../requests/recommendSongs'

import { reactive, ref } from 'vue'
import { formatPlaylist } from '../../utils/formatPlaylist'
import { PlaylistMatadata } from '../../types'
const playlist = ref()

const matadata = reactive<PlaylistMatadata>({
  id: -1,
  name: '每日歌曲推荐 - 根据你的音乐口味生成，每天6:00更新',
  coverImgUrl: '',
  userId: 0,
  createTime: 0,
  playCount: -1,
  trackCount: -1,
  tags: [],
  description: ''
})
const { data, run } = useRequest(recommendSongs, {
  onSuccess() {
    const formatted = formatPlaylist(data.value?.data.data.dailySongs)
    
    renderPlaylist.value = formatted.slice(0, limit.value)
    
    playlist.value = formatted
    matadata.coverImgUrl = formatted[0].album.picUrl
  }
})


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
run()
</script>

<template>
  <n-scrollbar>
    <playlist-detail :all-playlist="playlist!" :render-playlist="renderPlaylist!" :playlist-matadata="matadata">
      <template #header>
        <n-breadcrumb>
          <n-breadcrumb-item href="/#/">
            <n-icon :component="Home24Filled"></n-icon>
            首页
          </n-breadcrumb-item>
          <n-breadcrumb-item>
            <n-icon :component="MusicNote124Filled"></n-icon>
            每日推荐
          </n-breadcrumb-item>
        </n-breadcrumb>
      </template>
    </playlist-detail>
  </n-scrollbar>
</template>
