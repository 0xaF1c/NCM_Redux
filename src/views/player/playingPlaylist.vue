<script lang="ts">

import { ref, watch, h } from 'vue'
import { formatTimerstamp } from '../../utils/formatTimerstamp'
import { defineComponent } from 'vue'
// @ts-ignore
import { useStore } from 'vuex'
import albumLink from '../../components/linkBtn/albumLink.vue'
import artistLink from '../../components/linkBtn/artistLink.vue'

// @ts-ignore
import { Song } from '../../types/song'

import {
  NDrawer,
  NDrawerContent,
  NScrollbar,
  NDataTable,
  NAvatar,
  useThemeVars,
  DataTableColumns,
  NText,
  NEllipsis
} from 'naive-ui'
import { usePlayer } from '../../components/player/usePlayer'


type RawData = {
  cover: string
  name: string
  dt: number
  artists: string
  album: string
  songData: Song
  index: number
}



export default defineComponent({
  components: {
    NDrawer,
    NDrawerContent,
    NScrollbar,
    NDataTable,
    NEllipsis
  },
  props: {
    show: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:show'],
  mounted() {
    this.updatePlaylistData()
  },
  setup() {
    const store = useStore()
    const { toggle } = usePlayer()
    const vars = useThemeVars()
    const data = ref()
    let limit = 15
    const playlist = store.getters['player/getPlaylist']
    const condition = (id: number) => {
      return id == store.state.player.playlist[store.state.player.index]?.id
    }
    const iconStyle = {
      '--n-text-color-hover': vars.value.baseColor,
      '--n-text-color': vars.value.baseColor,
      '--n-text-color-disabled': vars.value.baseColor,
      '--n-text-color-focus': vars.value.baseColor,
      '--n-text-color-pressed': vars.value.baseColor,
      margin: '0 2px'
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
        width: 10
      },
      {
        title: '标题',
        key: 'name',
        render(rowData) {
          return h(
            NEllipsis,
            { style: 'max-width: 100px' },
            rowData.songData.name
          )
        }
      },
      {
        title: '作者',
        key: 'artists',
        render(rowData) {
          return h(
            NText,
            {},
            [
              rowData.songData.artists.map((artist: any, _index: number) => ([
                h(
                  artistLink,
                  {
                    id: artist.id,
                    style: condition(rowData.songData.id) ? iconStyle : null,
                  },
                  h(
                    NEllipsis,
                    { style: 'max-width: 100px' },
                    artist.name
                  )
                ),
              ])),
            ]
          )
        }
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
              { style: 'max-width: 100px' },
              rowData.songData.album.name
            )
          )
        }
      },
    ]
    const updatePlaylistData = () => {
      data.value = store.state.player.playlist.slice(0, limit).map((song: Song, i: number) => {
        return {
          cover: song.album.picUrl,
          name: `${song.name}`,
          dt: `${formatTimerstamp(song.dt, (_, m, s) => `${m > 9 ? m : '0' + m}:${s > 9 ? s : '0' + s}`)}`,
          artists: `${song.artists[0].name}`,
          album: `${song.album.name}`,
          songData: song,
          index: i
        }
      })
    }

    const rowProps = (row: RawData, rowIndex: number) => {
      const style = `
        --n-merged-td-color: ${vars.value.primaryColor};
        --n-merged-td-color-hover: ${vars.value.primaryColor};
        --n-td-text-color: ${vars.value.baseColor};
        --n-text-color-hover: ${vars.value.baseColor};
        --n-text-color: ${vars.value.baseColor};
        --n-text-color-hover: ${vars.value.baseColor};
        --n-text-color: ${vars.value.baseColor};
        --n-text-color-disabled: ${vars.value.baseColor};
        --n-text-color-focus: ${vars.value.baseColor};
        --n-text-color-pressed: ${vars.value.baseColor};
      `
      const options: any = {
        ondblclick: () => {
          store.commit('player/setIndex', rowIndex)
          setTimeout(() => toggle(false), 1000)
        },
        style: `
          height: 30px;
        `
      }
      if (condition(row.songData.id)) {
        options.style += style
      }
      return options
    }
    const getViewport = (el: HTMLElement) => {
      return el.scrollHeight - el.clientHeight
    }
    const onScroll = (e: Event) => {
      if (e.currentTarget?.scrollTop == getViewport(e.currentTarget)) {
        limit += 10
        updatePlaylistData()
        
      }
    }

    watch(
      () => store.state.player.playlist,
      () => {
        updatePlaylistData()
      }
    )
    return {
      playlist,
      columns,
      data,
      rowProps,
      updatePlaylistData,
      onScroll
    }
  }
})

</script>

<template>
  <n-drawer :show="show" title="播放列表" :show-mask="false"
    @update:show="(_: any) => $emit('update:show', _)" default-width="600" placement="right" size="large" bordered>
    <n-drawer-content closable title="播放列表">
      <n-scrollbar :on-scroll="onScroll">
        <n-data-table class="n-data-table" :columns="columns" :data="data" :row-props="rowProps"></n-data-table>
      </n-scrollbar>
    </n-drawer-content>
  </n-drawer>
</template>

<style lang="less">
@import url('../../styles/varible.less');

.n-drawer {
  height: calc(100% - @footer-height);
}

.n-list-item__suffix {
  display: flex;
  align-items: center;
}

.n-list-item {
  user-select: none;

  .n-avatar {
    display: flex;
    align-items: center;
  }

  .content {
    width: 100%;
    display: grid;
    grid-template-columns:
      2.5fr 1fr 0.1fr;
    grid-template-areas:
      "name artists dt"
    ;

    * {
      user-select: none;
    }
  }

  .alias {
    font-size: 0.3rem;
  }

  .name,
  .artists,
  .album,
  .dt {
    display: inline-flex;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    justify-content: flex-start;
    align-items: center;
  }

  .name {
    grid-area: name;
    font-size: 1.01rem;
  }

  .artists {
    grid-area: artists;
    font-size: 0.3rem;
  }

  .dt {
    grid-area: dt;
    font-size: 0.3rem;
  }
}
</style>