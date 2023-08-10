<script setup lang="ts">
import {
  NMenu,
  NScrollbar
} from 'naive-ui'

import {
  List24Filled,
  Heart24Regular,
  Clock24Regular,
  Heart24Filled,
  Clock24Filled,
  Home24Regular,
  Home24Filled,
  MusicNote124Regular,
  MusicNote124Filled
} from '@vicons/fluent'

import { useMenuOptions } from './menuOption'
import { ref, h, onMounted } from 'vue'
import { useStore } from 'vuex'
import { getUserPlaylist } from '@/requests/getUserPlaylist'
import { formatPlaylistSet } from '@/utils/formatPlaylistSet'
import { renderIcon } from '@/utils/renderIcon'
import { RouterLink } from 'vue-router'

const store = useStore()
const { options, override, insert } = useMenuOptions()

const userId = store.getters.userStatus.profile.userId

const selected = ref<string | number>('home')

const selectedIcon = (condition: () => boolean, icons: any) => {
  return () => (condition() ? renderIcon(icons[0])() : renderIcon(icons[1])())
}

; (async () => {
  const res = await getUserPlaylist(userId)

  const formatted = formatPlaylistSet(res.data.playlist)

  const myPlaylist: any = []
  const myFavoritePlaylist: any = []

  formatted.forEach((item, i) => {
    const leaf = {
      label: () => h(
        RouterLink,
        {
          to: {
            path: '/playlistDetail',
            name: 'playlistDetail',
            query: {
              id: item.id
            }
          },
        },
        { default: () => item.name }
      ),
      key: item.id,
      icon: renderIcon(List24Filled)
    }
    if (i != 0) {
      if (!item.subscribed)
        myPlaylist.push(leaf)
      else
        myFavoritePlaylist.push(leaf)
    }
  })

  insert(3, {
    key: 'favorite',
    label: '我喜欢的歌单',
    icon: selectedIcon(
      () => selected.value == 'favorite',
      [Heart24Filled, Heart24Regular]
    )
  })
  insert(4, {
    key: 'history',
    label: '最近听过',
    icon: selectedIcon(
      () => selected.value == 'history',
      [Clock24Filled, Clock24Regular]
    )
  })

  override([
    {
      key: 'home',
      overrides: {
        icon: selectedIcon(
          () => selected.value == 'home',
          [Home24Filled, Home24Regular]
        )
      }
    },
    {
      key: 'discover',
      overrides: {
        icon: selectedIcon(
          () => selected.value == 'discover',
          [MusicNote124Filled, MusicNote124Regular]
        )
      }
    },
    {
      key: 'myPlaylist',
      overrides: {
        children: myPlaylist
      }
    },
    {
      key: 'myFavoritePlaylist',
      overrides: {
        children: myFavoritePlaylist
      }
    }
  ])

  selected.value = parseInt(window.location.hash.split('?id=')[1])
})()


</script>

<template>
  <n-scrollbar>
    <n-menu :options="options" v-model:value="selected"></n-menu>
  </n-scrollbar>
</template>