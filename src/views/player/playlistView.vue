<script setup lang="ts">
import { Playlist } from '@/types'
import {
  NDrawer,
  NDrawerContent,
  NList,
  NListItem,
  NTime,
  NAvatar,
  NIcon,
  useThemeVars,
  NScrollbar,
  NEmpty
} from 'naive-ui'
import { Speaker228Filled } from '@vicons/fluent'

const themeVars = useThemeVars()

const props = defineProps<{
  playlist: Playlist
  playlistTitle: string
  show: boolean
  index: number
}>()

const emits = defineEmits<{
  (e: 'update:show', data: boolean): void
  (e: 'update:index', data: number): void
}>()
</script>

<template>
  <n-drawer
    :show="props.show"
    :title="props.playlistTitle == '' ? '空空如也' : props.playlistTitle"
    :show-mask="false"
    @update:show="(show) => emits('update:show', show)"
    default-width="600"
    placement="right"
    size="large"
    bordered
  >
    <n-drawer-content closable :title="props.playlistTitle">
      <n-scrollbar v-if="props.playlist.length > 0">
        <n-list clickable bordered hoverable>
          <n-list-item
            v-for="(song, i) in props.playlist"
            @dblclick="emits('update:index', i)"
            :style="props.index == i ? {
              backgroundColor: themeVars.primaryColor,
              color: themeVars.baseColor
            } : ''"
          >
            <template #prefix>
              <n-avatar :src="song.album.picUrl" lazy size="large"></n-avatar>
            </template>
  
            <div class="content">
              <div class="name">
                <span>{{ song.name }}</span>
                <!-- <span class="alias" v-for="alia in song.alias">({{ alia }})</span> -->
  
              </div>
              <div class="artists">
                <span v-for="(artist, i) in song.artists">
                  {{ i > 0 && i < song.artists.length ? ' / ' : '' }}{{ artist.name }} </span>
              </div>
              <!-- <div class="album">
                <span>
                  {{ song.album.name }}
                </span>
              </div> -->
            </div>
  
            <template #suffix class="suffix">
                <n-icon v-show="props.index == i" :component="Speaker228Filled" size="18"></n-icon>
                <n-time v-show="props.index != i" :time="song.dt" format="mm:ss" style="white-space: nowrap;"></n-time>
            </template>
          </n-list-item>
        </n-list>
      </n-scrollbar>
      <n-empty
        v-if="props.playlist.length == 0 || props.playlist == null || props.playlist == undefined"
        description="这里是空的啊"
      >

      </n-empty>
    </n-drawer-content>
  </n-drawer>
</template>

<style lang="less">
@import url('@/styles/varible.less');
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
      2.5fr 1fr 0.1fr
    ;
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