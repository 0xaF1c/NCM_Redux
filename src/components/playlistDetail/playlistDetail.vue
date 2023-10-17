<script setup lang="ts">
import { Playlist, PlaylistMatadata, Song } from '../../types'
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
  useThemeVars,
  type DataTableColumns,
  useMessage,
  NEllipsis
} from 'naive-ui'
import { Play24Filled, Play24Regular, Share24Filled, Star24Regular } from '@vicons/fluent'
import { ref, watch, h } from 'vue'
import { formatTimerstamp } from '../../utils/formatTimerstamp'
import { renderIcon } from '../../utils/renderIcon'
// @ts-ignore
import { useStore } from 'vuex'

import musicLikeBtn from '../../components/musicLikeBtn/musicLikeBtn.vue'
import albumLink from '../../components/linkBtn/albumLink.vue'
import artistLink from '../../components/linkBtn/artistLink.vue'
import { usePlayer } from '../../components/player/usePlayer'

const { toggle } = usePlayer();

const store = useStore()
const emits = defineEmits<{
  (e: 'playButtonClick', data: Event): void
}>()
const props = defineProps<{
  allPlaylist: Playlist
  renderPlaylist: Playlist
  playlistMatadata: PlaylistMatadata
  album?: boolean
}>()
const { info } = useMessage()

type RawData = {
  cover: string
  name: string
  dt: number
  artists: string
  album: string
  songData: Song
  index: number
}
const vars = useThemeVars()

const data = ref()
const loading = ref(true)
const showDescription = ref(false)

const condition = (id: number) => {
  return id == store.state.player.playlist[store.state.player.index]?.id
}
const iconStyle = {
  '--n-text-color-hover': vars.value.baseColor,
  '--n-text-color': vars.value.baseColor,
  '--n-text-color-disabled': vars.value.baseColor,
  '--n-text-color-focus': vars.value.baseColor,
  '--n-text-color-pressed': vars.value.baseColor,
}
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
    width: 10,
    resizable: true
  },
  {
    key: 'like',
    render(rowData) {
      return h(
        musicLikeBtn,
        {
          id: rowData?.songData.id,
          style: condition(rowData.songData.id) ? iconStyle : null,
        }
      )
    },
    width: 10
  },
  {
    key: 'play',
    render(rowData, index) {
      return h(
        NButton,
        {
          quaternary: true,
          circle: true,
          style: condition(rowData.songData.id) ? iconStyle : null,
          onClick() {
            store.commit('player/setPlaylist', props.allPlaylist)
            store.commit('player/setIndex', index)
            setTimeout(() => {
              toggle(false)
            }, 1000);
          }
        },
        {
          icon: condition(rowData.songData.id) ? renderIcon(Play24Filled) : renderIcon(Play24Regular)
        }
      )
    },
    width: 10
  },
  {
    title: '标题',
    key: 'name',
    resizable: true,
    render(rowData) {
      return h(
        NEllipsis,
        {
          style: {
            maxWidth: '200px'
          }
        },
        rowData.songData.name
      )
    }
  },
  {
    title: '作者',
    key: 'artists',
    render(rowData) {
      return h(
        NEllipsis,
        {
          style: {
            maxWidth: '100px'
          }
        },
        [
          rowData.songData.artists.map((artist, _index) => ([
            h(
              artistLink,
              {
                id: artist.id,
                style: condition(rowData.songData.id) ? iconStyle : null,
              },
              artist.name
            ),
            ' '])
          )
        ]
      )
    },
    resizable: true
  },
  {
    title: '专辑',
    key: 'album',
    render(rowData) {
      return h(
        albumLink,
        {
          style: condition(rowData.songData.id) ? iconStyle : null,
          id: rowData.songData.album.id
        },
        h(
          NEllipsis,
          {
            style: {
              maxWidth: '240px'
            }
          },
          rowData.songData.album.name
        )
      )
    },
    resizable: true
  },

  {
    title: '时长',
    key: 'dt',
    render(rowData: RawData) {
      return h(
        NEllipsis,
        {
          style: {
            maxWidth: '100px'
          }
        },
        rowData.dt
      )
    }
  },
]
const updatePlaylistData = () => {

  data.value = props.renderPlaylist.map((song: Song, i) => {
    return {
      cover: song.album.picUrl,
      name: `${song.name}`,
      dt: `${formatTimerstamp(song.dt, (_h, m, s) => `${m > 9 ? m : '0' + m}:${s > 9 ? s : '0' + s}`)}`,
      artists: `${song.artists[0].name}`,
      album: `${song.album.name}`,
      songData: song,
      index: i
    }
  })
  loading.value = false
}
const rowProps = (row: RawData, rowIndex: number) => {
  const style = `
    --n-merged-td-color: ${vars.value.primaryColor};
    --n-merged-td-color-hover: ${vars.value.primaryColor};
    --n-td-text-color: ${vars.value.baseColor};
    --n-text-color-hover: ${vars.value.baseColor};
    --n-text-color: ${vars.value.baseColor};
  `
  const options: any = {
    ondblclick: () => {
      store.commit('player/setPlaylist', props.allPlaylist)
      store.commit('player/setIndex', rowIndex)
      setTimeout(() => {
        toggle(false)
      }, 1000);
    },
    style: ''
  }
  if (condition(row.songData.id)) {
    options.style += style
  }
  return options
}
const onPlayButtonClick = () => {
  store.commit('player/setPlaylist', props.allPlaylist)
  store.commit('player/setIndex', 0)
}
watch(
  () => props.renderPlaylist,
  () => {
    updatePlaylistData()
  }
)
watch(
  () => store.state.player.playlist,
  () => {
    updatePlaylistData()
  }
)
</script>


<template>
  <n-card :bordered="false" embedded>
    <n-page-header>
      <template #header>
        <slot name="header" />
      </template>
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
        <n-grid v-if="props.playlistMatadata?.trackCount != -1" :cols="3">
          <n-gi>
            <n-statistic label="歌曲数" :value="props.playlistMatadata?.trackCount" />
          </n-gi>
          <n-gi>
            <n-statistic label="播放数" :value="props.playlistMatadata?.playCount" />
          </n-gi>
        </n-grid>
        <n-space align="center" style="margin: 10px 0;" v-if="props.playlistMatadata?.trackCount != -1">
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
              <n-button type="primary" circle @click="onPlayButtonClick">
                <template #icon>
                  <n-icon :size="25" :component="Play24Filled"></n-icon>
                </template>
              </n-button>
            </template>
            播放全部
          </n-tooltip>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button quaternary circle @click="info('尚在开发')">
                <template #icon>
                  <n-icon :size="25" :component="Share24Filled"></n-icon>
                </template>
              </n-button>
            </template>
            分享
          </n-tooltip>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button quaternary circle @click="info('尚在开发')">
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
    <n-data-table class="n-data-table" :loading="loading" :columns="columns" :data="data" :row-props="rowProps">
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

.n-data-table {
  td {
    background: var(--active-background-color);
    color: var(--active-color);
  }
}
</style>