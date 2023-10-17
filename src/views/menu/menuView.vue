<script setup lang="ts">
import {
  NMenu,
  NScrollbar,
  NTooltip
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
import { ref, h, watch, onMounted } from 'vue'
import { getUserPlaylist } from '../../requests/getUserPlaylist'
import { formatPlaylistSet } from '../../utils/formatPlaylistSet'
import { renderIcon } from '../../utils/renderIcon'
import { RouterLink } from 'vue-router'
import { isLoggedIn } from '../../utils/auth'
import { getUserStatus } from '../../requests/getUserStatus'

const { options, override, insert } = useMenuOptions()

const props = defineProps<{
  collapsed: boolean
}>()

const selected = ref<string | number>('home')

const selectedIcon = (condition: () => boolean, icons: any) => {
  return () => (condition() ? renderIcon(icons[0])() : renderIcon(icons[1])())
}

const update = async () => {
  if (isLoggedIn()) {
    const userId = (await getUserStatus())?.data?.data?.profile?.userId

    const res = await getUserPlaylist(userId)

    const formatted = formatPlaylistSet(res.data.playlist)

    const myPlaylist: any = []
    const myFavoritePlaylist: any = []

    formatted.forEach((item, i) => {
      const leaf = {
        label: () => h(
          NTooltip,
          {
            trigger: 'hover',
            placement: 'bottom',
            showArrow: false,
            disabled: !props.collapsed,
            flip: false
          },
          {
            trigger: h(
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
            default: item.name
          }
        ),
        labelField: item.name,
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
      label: () => h(
        RouterLink,
        {
          to: {
            path: '/playlistDetail',
            name: 'playlistDetail',
            query: {
              id: formatted[0].id
            }
          },
        },
        { default: () => '我喜欢的音乐' }
      ),
      icon: selectedIcon(
        () => selected.value == 'favorite',
        [Heart24Filled, Heart24Regular]
      )
    })
    insert(4, {
      key: 'history',
      label: () => h(
        RouterLink,
        {
          to: {
            path: '/history',
            name: 'history'
          },
        },
        '最近听过'
      ),
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
  }
}

watch(
  () => isLoggedIn(),
  () => {
    update()
  }
)

update()

</script>

<template>
  <n-scrollbar>
    <n-menu :collapsed="props.collapsed" :collapsed-width="64" :collapsed-icon-size="22" :options="options"
      v-model:value="selected"></n-menu>
  </n-scrollbar>
</template>