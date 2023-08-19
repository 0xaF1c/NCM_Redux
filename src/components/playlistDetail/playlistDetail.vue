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
  NIcon,
  NTooltip,
  NSpin,
  type DataTableColumns
} from 'naive-ui'
import { AddCircle24Regular, Play24Filled, Share24Filled, Star24Regular } from '@vicons/fluent'
import { ref, watch, onMounted, h } from 'vue'
import { formatTimerstamp } from '@/utils/formatTimerstamp'
import { renderIcon } from '@/utils/renderIcon'
import { useStore } from 'vuex'

import musicLikeBtn from '@/components/musicLikeBtn/musicLikeBtn.vue'


const store = useStore()
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
          lazy: true,
          src: rowData?.cover,
          size: 40
        }
      )
    },
    width: 10
  },
  { title: '标题', key: 'name' },
  { title: '作者', key: 'artists' },
  { title: '专辑', key: 'album' },
  {
    key: 'like',
    render(rowData) {
      return h(
        musicLikeBtn,
        {
          id: rowData?.songData.id,
        }
      )
    },
    width: 10
  },
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
            store.commit('updatePlaylist', exportPlaylist.value)
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
        <n-avatar lazy :size="150" :src="props.playlistMatadata?.coverImgUrl" />
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
          {{ props.playlistMatadata?.description || '这个人很懒－O－ 什么也没写' }}
        </n-text>
      </template>
      <template #footer>
        <n-space class="toolbox">
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button type="primary" circle @click="store.commit('updatePlaylist', props.playlist)">
                <template #icon>
                  <n-icon :size="25" :component="Play24Filled"></n-icon>
                </template>
              </n-button>
            </template>
            播放全部
          </n-tooltip>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button quaternary circle>
                <template #icon>
                  <n-icon :size="25" :component="Share24Filled"></n-icon>
                </template>
              </n-button>
            </template>
            分享
          </n-tooltip>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button quaternary circle>
                <template #icon>
                  <n-icon :size="25" :component="Star24Regular"></n-icon>
                </template>
              </n-button>
            </template>
            收藏
          </n-tooltip>
        </n-space>
      </template>
    </n-page-header>
    <n-data-table :loading="loading" :columns="columns" :data="data">
      <template #loading>
        <n-spin :show="loading"></n-spin>
      </template>
    </n-data-table>
  </n-card>
</template>

<style scoped lang="less">
.n-text {
  display: inline-block;
}
.toolbox {
  margin-bottom: 20px;
}
</style>