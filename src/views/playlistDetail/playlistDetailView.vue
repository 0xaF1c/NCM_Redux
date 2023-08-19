<script setup lang="ts">
import { useRoute } from 'vue-router'
import { watch, ref, onMounted } from 'vue'
import { getPlaylistDetail } from '@/requests/getPlaylistDetail'
import { playlistTrackAll } from '@/requests/playlistTrackAll'
import {
  useLoadingBar,
  NScrollbar,
  NSpin
} from 'naive-ui'
import { useRequest } from 'vue-request'
import { formatPlaylist } from '@/utils/formatPlaylist'
import { formatPlaylistMatadata } from '@/utils/formatPlaylistMatadata'
import { Playlist, PlaylistMatadata } from '@/types'

import playlistDetail from '@/components/playlistDetail/playlistDetail.vue'

const route = useRoute()
const { start, finish, error } = useLoadingBar()

const playlistMatadata = ref<PlaylistMatadata>()
const playlist = ref<Playlist>()
const props = defineProps<{
  exportPlaylist: Playlist
}>()
const emits = defineEmits<{
  (e: 'update:update:exportPlaylist', data: Playlist): void
}>()

const limit = ref(20)

const { run, data, loading } = useRequest(playlistTrackAll, {
  onSuccess() {
    // @ts-ignore
    playlist.value = formatPlaylist(data.value?.data.songs)
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
        run(id, limit.value, 0)
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
const onExportPlaylistUpdate = (data: Playlist) => {
  emits('update:update:exportPlaylist', data)
}
const getViewport = (el: HTMLElement) => {
  return el.scrollHeight - el.clientHeight
}

const onScroll = (e: Event) => {
  // @ts-ignore
  if (e.currentTarget?.scrollTop == getViewport(e.currentTarget)) {
    if (loading.value == false) {
      limit.value += 10
      update()
    }
  }
}

</script>


<template>
  <n-scrollbar :on-scroll="onScroll">
    <n-spin :show="loading">
      <playlist-detail @update:export-playlist="onExportPlaylistUpdate" :playlist="playlist!" :playlist-matadata="playlistMatadata!" />
    </n-spin>
  </n-scrollbar>
</template>