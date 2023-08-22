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
import { useStore } from 'vuex'

const route = useRoute()
const { start, finish, error } = useLoadingBar()

const playlistMatadata = ref<PlaylistMatadata>()
const playlist = ref<Playlist>()
const store = useStore()

const emits = defineEmits<{
  (e: 'update:exportPlaylist', data: Playlist): void
}>()

const limit = ref(20)

const { run, data, loading } = useRequest(playlistTrackAll, {
  onSuccess() {
    // @ts-ignore
    playlist.value = formatPlaylist(data.value?.data.songs)
  }
})
const updatePlaylistStore = (id: string) => {
  playlistTrackAll(id)
    .then((res) => {
      store.commit('updatePlaylist', formatPlaylist(res.data.songs))
      store.commit('updatePlaylistId', id)
    })
}
const update = () => {
  const id: any = window.location.hash.split('?id=')[1]
  store.commit('updatePlaylistId', id)
  
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

const onPlayButtonClick = () => {
  const id: any = window.location.hash.split('?id=')[1]
  updatePlaylistStore(id)
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
    <playlist-detail @play-button-click="onPlayButtonClick" :playlist="playlist!" :playlist-matadata="playlistMatadata!" />
  </n-scrollbar>
</template>