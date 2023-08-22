<script setup lang="ts">
import type { PlaylistItemBrief } from '../../types'
import {
  NGrid,
  NGi,
  NCard,
  NEllipsis
} from 'naive-ui'
const props = defineProps<{
  albums: Array<PlaylistItemBrief>
}>()

</script>

<template>
  <n-grid x-gap="20" y-gap="20" :cols="6">
    <n-gi v-for="album in props.albums">
      <n-card hoverable style="cursor: pointer;height: 320px;" @click="$router.push({
        path: '/albumDetail',
        query: {
          id: album.id
        }
      })">
        <template #cover>
          <img :src="album.picUrl" />
        </template>
        <template #header>
          <n-ellipsis :line-clamp="2">{{ album.name }}</n-ellipsis>
        </template>
      </n-card>
    </n-gi>
  </n-grid>
</template>