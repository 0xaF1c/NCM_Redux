<script setup lang="ts">
import {
  NPageHeader,
  NButton,
  NSpace,
  NText,
  NTag,
  NAvatar,
  NCard,
  NDivider
} from 'naive-ui'
import { artistAlbum } from '@/requests/artistAlbum'
import { artistDetail } from '@/requests/artistDetail'
import { useRequest } from 'vue-request'
import { ref } from 'vue'
import { formatPlaylistSetWithAlbum } from '@/utils/formatPlaylistSet'
import albumViewer from '@/components/playlistViewer/albumViewer.vue'

const showDescription = ref(false)
const id = window.location.hash.split('?id=')[1]
const artist = ref()
const albums = ref()
const { data, loading, run } = useRequest(artistDetail, {
  onSuccess() {
    artist.value = data.value?.data.data.artist
  },
})
const artistAlbumReq = useRequest(artistAlbum, {
  onSuccess() {
    albums.value = formatPlaylistSetWithAlbum(artistAlbumReq?.data.value?.data.hotAlbums)
  }
})
run(id)
artistAlbumReq?.run(id)

</script>

<template>
  <n-card>
    <n-spin :show="loading">
      <n-page-header>
        <template #avatar>
          <n-avatar lazy :size="150" :src="data?.data.data.artist.avatar" />
        </template>
        <template #title>
          <n-text style="font-size: 2rem;">
            {{ data?.data.data.artist.name }}
          </n-text>
          <n-space>
            <n-tag :bordered="false" v-for="tag in data?.data.data.artist.identities">{{ tag }}</n-tag>
            <n-tag :bordered="false" v-for="tag in data?.data.data.artist.identifyTag">{{ tag }}</n-tag>
          </n-space>
          <n-space align="center" style="margin: 10px 0;">
            描述:
            <n-button quaternary circle @click="showDescription = !showDescription">
              {{ showDescription ? '👆' : '👇' }}
            </n-button>
          </n-space>
        </template>
        <template #default>
          <n-text v-show="showDescription" style="font-size: 0.6rem;white-space: pre-wrap;">
            {{ data?.data.data.artist.briefDesc || '这个人很懒－O－ 什么也没写' }}
          </n-text>
        </template>
      </n-page-header>
      <n-divider title-placement="left">专辑</n-divider>
      <albumViewer :albums="albums"></albumViewer>
    </n-spin>
  </n-card>
</template>