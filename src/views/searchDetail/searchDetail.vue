<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useRequest } from 'vue-request'
import { useRoute } from 'vue-router'
import { search } from '@/requests/search'
import { formatPlaylist } from '@/utils/formatPlaylist'
import { NScrollbar } from 'naive-ui'

import playlistDetail from '../../components/playlistDetail/playlistDetail.vue'

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
    const formatted = formatPlaylist(songs)
    
    matadata.coverImgUrl = formatted[0]?.album.picUrl
    playlist.value = formatted
  }
})
const update = () => {
  run(route.query.keywords, 1)
}
update()
watch(
  () => route.query,
  () => {
    update()
  }
)
</script>

<template>
  <n-scrollbar>
    <playlist-detail :playlist="playlist" :playlist-matadata="matadata"></playlist-detail>
  </n-scrollbar>
</template>