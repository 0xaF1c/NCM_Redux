
import { renderIcon } from '@/utils/renderIcon'
import { type MenuOption } from 'naive-ui'
import { h, reactive } from 'vue'

import {
  Home24Regular,
  MusicNote124Regular,
} from '@vicons/fluent'
import { RouterLink } from 'vue-router'

type overridesOptions = Array<{
  key: string
  overrides: MenuOption
}>

export const useMenuOptions = () => {
  const options = reactive<MenuOption[]>([
    {
      label: () => h(
        RouterLink,
        {
          to: {
            path: '/',
            name: 'home'
          },
        },
        { default: () => '首页' }
      ),
      key: 'home',
      icon: renderIcon(Home24Regular),
    },
    {
      label: () => h(
        RouterLink,
        {
          to: {
            path: '/personalFm',
            name: 'personalFm'
          },
        },
        { default: () => '发现' }
      ),
      key: 'discover',
      icon: renderIcon(MusicNote124Regular),
    },
    {
      key: 'divider-1',
      type: 'divider'
    },
    {
      key: 'divider-2',
      type: 'divider'
    },
    {
      key: 'myPlaylist',
      type: 'group',
      label: '我的歌单',
      children: [

      ]
    },
    {
      key: 'divider-3',
      type: 'divider'
    },
    {
      key: 'myFavoritePlaylist',
      type: 'group',
      label: '我收藏的歌单',
      children: [

      ]
    },
  ])

  return {
    override(overridesOptions: overridesOptions) {
      overridesOptions.forEach(item => {
        const { overrides, key } = item
    
        options.map((option, i) => {
          if (option.key == key) {
            const override: any = Object.assign(options[i], overrides)
            options[i] = override
          }
        })
      })
    },
    insert: (i: number,option: MenuOption | any) => options.splice(i, 0, option),
    options
  }
} 