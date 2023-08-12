<script setup lang="ts">
import { Playlist, PlaylistMatadata, Song } from '@/types';
import {
  NPageHeader,
  NAvatar,
  NCard,
  NTag,
  NText,
  NSpace,
  NButton,
  NGrid,
  NGi,
  NStatistic,
  NDataTable,
  type DataTableColumns
} from 'naive-ui'
import { AddCircle24Regular } from '@vicons/fluent'
import { ref, watch, onMounted, h } from 'vue'
import { formatTimerstamp } from '@/utils/formatTimerstamp'
import { renderIcon } from '@/utils/renderIcon';

const props = defineProps<{
  playlist: Playlist
  playlistMatadata: PlaylistMatadata
}>()

type RawData = {
  cover: string
  name: string
  dt: number
  artists: string
  album: string
  songData: Song
}
const data = ref()
const loading = ref(true)
const exportPlaylist = ref<Playlist>([])
const showDescription = ref(false)
const columns: DataTableColumns<RawData> = [
  {
    key: 'cover',
    render(rowData) {
      return h(
        NAvatar,
        {
          src: rowData?.cover,
          size: 40
        }
      )
    }
  },
  { title: '标题', key: 'name' },
  { title: '作者', key: 'artists' },
  { title: '专辑', key: 'album' },
  {
    key: 'play',
    render(rowData) {
      return h(
        NButton,
        {
          quaternary: true,
          circle: true,
          onClick() {
            exportPlaylist.value.push(rowData.songData)
          }
        },
        {
          icon: renderIcon(AddCircle24Regular)
        }
      )
    }
  },
  { title: '时长', key: 'dt' },
]
const updatePlaylistData = () => {
  data.value = props.playlist.map((song: Song, i) => {
    return {
      cover: song.album.picUrl,
      name: `${song.name}`,
      dt: `${formatTimerstamp(song.dt, (h, m, s) => `${m>9?m:'0'+m}:${s>9?s:'0'+s}`)}`,
      artists: `${song.artists[0].name}`,
      album: `${song.album.name}`,
      songData: song
    }
  })
  loading.value = false
}
watch(
  () => props.playlist,
  () => {
    updatePlaylistData()
  }
)
</script>


<template>
  <n-card :bordered="false" embedded>
    <n-page-header>
      <template #avatar>
        <n-avatar :size="150" :src="props.playlistMatadata?.coverImgUrl" />
      </template>
      <template #title>
        <n-text style="font-size: 2rem;">
          {{ props.playlistMatadata?.name }}
        </n-text>
        <n-space>
          <n-tag :bordered="false" v-for="tag in props.playlistMatadata?.tags">{{ tag }}</n-tag>
        </n-space>
        <n-grid :cols="3">
          <n-gi>
            <n-statistic label="歌曲数" :value="props.playlistMatadata?.trackCount" />
          </n-gi>
          <n-gi>
            <n-statistic label="播放数" :value="props.playlistMatadata?.playCount" />
          </n-gi>
        </n-grid>
        <n-space align="center" style="margin: 10px 0;">
          描述:
          <n-button quaternary circle @click="showDescription = !showDescription">
            {{ showDescription ? '👆' : '👇' }}
          </n-button>
        </n-space>
      </template>
      <template #default>
        <n-text v-show="showDescription" style="font-size: 0.6rem;white-space: pre-wrap;">
          {{ props.playlistMatadata?.description }}
        </n-text>
      </template>
    </n-page-header>
    <n-data-table :loading="loading" :columns="columns" :data="data" />
  </n-card>
</template>

<style scoped lang="less">
.n-text {
  display: inline-block;
}
</style>