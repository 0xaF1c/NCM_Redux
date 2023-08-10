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
import { Playlist } from '@/types'

import playlistDetail from '@/components/playlistDetail/playlistDetail.vue'

const props = defineProps<{
  playlistId: number | string
}>()

const route = useRoute()
const { start, finish, error } = useLoadingBar()

const playlistMatadata = ref({})
const playlist = ref<Playlist>([])

const { run, data, loading } = useRequest(playlistTrackAll, {
  onSuccess() {
    // @ts-ignore
    playlist.value = formatPlaylist(data?.data.songs)
  }
})
const update = () => {
  const id: any = route.query.id
  start()
  getPlaylistDetail(id)
    .then(res => {
      playlistMatadata.value = res.data
      console.log(res.data)
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


</script>


<template>
  <n-scrollbar>
    <n-spin :show="loading">
      <playlist-detail />
    </n-spin>
  </n-scrollbar>
</template>