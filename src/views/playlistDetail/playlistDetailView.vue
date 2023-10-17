<script setup lang="ts">
import { useRoute } from 'vue-router'
import { watch, ref, onMounted } from 'vue'
import { getPlaylistDetail } from '../../requests/getPlaylistDetail'
import { playlistTrackAll } from '../../requests/playlistTrackAll'
import {
  useLoadingBar,
  NScrollbar,
} from 'naive-ui'
import { useRequest } from 'vue-request'
import { formatPlaylist } from '../../utils/formatPlaylist'
import { formatPlaylistMatadata } from '../../utils/formatPlaylistMatadata'
import { Playlist, PlaylistMatadata } from '../../types'

import playlistDetail from '../../components/playlistDetail/playlistDetail.vue'

const route = useRoute()
const { start, finish, error } = useLoadingBar()

const playlistMatadata = ref<PlaylistMatadata>()
const playlist = ref<Playlist>()
const renderPlaylist = ref<Playlist>()
const limit = ref(20)

const emits = defineEmits<{
  (e: 'update:exportPlaylist', data: Playlist): void
}>()

const { run, data, loading } = useRequest(playlistTrackAll, {
  onSuccess() {
    // @ts-ignore
    playlist.value = formatPlaylist(data.value?.data.songs)
    
    renderPlaylist.value = playlist.value.slice(0, limit.value)
    
  }
})
const update = () => {
  const id: any = window.location.hash.split('?id=')[1]
  
  start()
  getPlaylistDetail(id)
    .then(res => {
      playlistMatadata.value = formatPlaylistMatadata(res.data)
      setTimeout(() => {
        finish()
        run(id)
      })
    })
    .catch(() => {
      setTimeout(() => {
        error()
      })
    })
}

watch(
  () => route.query,
  () => {
    update()
  }
)
onMounted(() => {
  update()
})

const onPlayButtonClick = () => {
  const id: any = window.location.hash.split('?id=')[1]
}
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
    <playlist-detail :all-playlist="playlist!" :render-playlist="renderPlaylist!"  :playlist-matadata="playlistMatadata!" />
  </n-scrollbar>
</template>