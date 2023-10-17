<script setup lang="ts">
import { NInput, NDropdown, DropdownOption, NIcon } from 'naive-ui'
import { searchDefault } from '../../requests/searchDefault'

import { ref, h } from 'vue'
import { searchSuggest } from '../../requests/searchSuggest';

import { People24Filled, MusicNote124Filled, List24Filled, Album24Filled, Search24Filled } from '@vicons/fluent'
import { useRouter } from 'vue-router';
import { searchHot } from '../../requests/searchHot';

const router = useRouter()
const ordersContrast: any = {
  songs: {
    path: '/searchDetail',
    name: 'searchDetail',
    title: '单曲',
    icon: MusicNote124Filled,
    method(option: DropdownOption) {
      router.push({
        path: this.path,
        name: this.name,
        query: {
          // @ts-ignore
          keywords: option.data.name
        }
      })
    }
  },
  artists: {
    path: '/artistDetail',
    name: 'artistDetail',
    title: '艺术家',
    icon: People24Filled,
    method(option: DropdownOption) {
      router.push({
        path: this.path,
        name: this.name,
        query: {
          // @ts-ignore
          id: option.data.id
        }
      })
    }
  },
  albums: {
    path: '/albumDetail',
    name: 'albumDetail',
    title: '专辑',
    icon: Album24Filled,
    method(option: DropdownOption) {
      router.push({
        path: this.path,
        name: this.name,
        query: {
          // @ts-ignore
          id: option.data.id
        }
      })
    }
  },
  playlists: {
    path: '/playlistDetail',
    name: 'playlistDetail',
    title: '歌单',
    icon: List24Filled,
    method(option: DropdownOption) {
      router.push({
        path: this.path,
        name: this.name,
        query: {
          // @ts-ignore
          id: option.data.id
        }
      })
    }
  },
  final: {
    path: '/searchDetail',
    name: 'searchDetail',
    title: '搜索',
    icon: Search24Filled,
    method(option: DropdownOption) {
      router.push({
        path: this.path,
        name: this.name,
        query: {
          // @ts-ignore
          keywords: option.data.name
        }
      })
    }
  }
}

const dropdownShow = ref(false)
const maybeSearch = ref()
const value = ref('')

const searchResultsOption = ref<Array<DropdownOption>>([])

const onSelect = (key: string, option: DropdownOption) => {
  const k: any = option.keyType

  ordersContrast[k].method(option)
}

const updateResultOption = async () => {
  const res = await searchSuggest(value.value)
  const result = res.data.result

  if (result != undefined) {
    if (res.data?.result.order != undefined) {
      const options: any = []
      result.order.forEach((key: string) => {
        result[key].forEach((item: any) => {
          const option: DropdownOption = {
            label: `${ordersContrast[key].title} - ${item.name}`,
            key: `${key}-${item.id}`,
            icon() {
              return h(NIcon, null, {
                default: () => h(ordersContrast[key].icon)
              })
            },
            keyType: key,
            data: item
          }
          options.push(option)
        })
      })
      options.push({
        label: `${ordersContrast.final.title} - ${value.value}`,
        key: `search-${value.value}`,
        icon() {
          return h(NIcon, null, {
            default: () => h(ordersContrast.final.icon)
          })
        },
        keyType: 'final',
        data: { name: value.value }
      })
      searchResultsOption.value = options
    } else {
      searchResultsOption.value = [
        {
          label: `${ordersContrast.final.title} - ${value.value}`,
          key: `search-${value.value}`,
          icon() {
            return h(NIcon, null, {
              default: () => h(ordersContrast.final.icon)
            })
          },
          keyType: 'final',
          data: { name: value.value }
        }
      ]
    }
  }
}

const onInput = async () => {
  if (value.value == '') {
    const res = await searchHot()
    const hots = res.data.result.hots

    searchResultsOption.value = hots.map((item: any, index: number) => ({
      label: `${ordersContrast.songs.title} - ${item.first}`,
      key: `songs-${index}`,
      icon() {
        return h(NIcon, null, {
          default: () => h(ordersContrast.songs.icon)
        })
      },
      keyType: 'songs',
      data: {
        name: item.first
      }
    }))
  } else {
    await updateResultOption()
  }


}
const onBlur = () => {
  setTimeout(() => {
    dropdownShow.value = false
  }, 300)
  if (value.value === maybeSearch.value) {
    value.value = ''
  }
}
const onFocus = () => {
  dropdownShow.value = true

  if (value.value === '') {
    value.value = maybeSearch.value
    onInput()
  } else {
    updateResultOption()
  }
}

const onEnter = (event: KeyboardEvent) => {

  if (event.key === 'Enter') {
    ordersContrast.final.method({ data: { name: value.value } })
  }

}

  ;; (async () => {
    const res = await searchDefault()

    maybeSearch.value = res.data.data.showKeyword
  })()
</script>

<template>
  <div style="width: 500px;">
    <n-dropdown style="width: 500px;" :options="searchResultsOption" trigger="manual" :show="dropdownShow"
      @select="onSelect">
      <n-input :placeholder="`猜你想搜: ${maybeSearch}`" @blur="onBlur" @input="onInput" @focus="onFocus"
        v-model:value="value" @keyup="onEnter" />
    </n-dropdown>
  </div>
</template>