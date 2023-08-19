<script setup lang="ts">
import type { PlaylistItemBrief } from '../../types'
import {
  NGrid,
  NGi,
  NCard,
  NEllipsis
} from 'naive-ui'
const props = defineProps<{
  playlistSet: Array<PlaylistItemBrief>
}>()

</script>

<template>
  <n-grid x-gap="20" y-gap="20" :cols="6">
    <n-gi v-for="playlist in props.playlistSet">
      <n-card hoverable style="cursor: pointer;height: 320px;" @click="$router.push({
        path: '/playlistDetail',
        query: {
          id: playlist.id
        }
      })">
        <template #cover>
          <img :src="playlist.picUrl" />
        </template>
        <template #header>
          <n-ellipsis :line-clamp="2">{{ playlist.name }}</n-ellipsis>
        </template>
      </n-card>
    </n-gi>
  </n-grid>
</template>