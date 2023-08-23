<script setup lang="ts">
import {
  NScrollbar,
  NBreadcrumb,
  NBreadcrumbItem,
  NIcon,
  NCard
} from 'naive-ui'
import { 
  Home24Filled,
  MusicNote124Filled
} from '@vicons/fluent'
import { useRequest } from 'vue-request'
import playlistViewer from '../../components/playlistViewer/playlistViewer.vue'

import { recommendResource } from '../../requests/recommendResource'

import { ref } from 'vue'
import { formatPlaylistSetWithResources } from '@/utils/formatPlaylistSet'

const playlistSet = ref()

const { data, run } = useRequest(recommendResource, {
  onSuccess() {
    const formatted = formatPlaylistSetWithResources(data.value?.data.recommend)    

    playlistSet.value = formatted
  }
})

run()
</script>

<template>
  <n-scrollbar>
    <n-card>
      <n-breadcrumb>
        <n-breadcrumb-item href="/#/">
          <n-icon :component="Home24Filled"></n-icon>
          首页
        </n-breadcrumb-item>
        <n-breadcrumb-item>
          <n-icon :component="MusicNote124Filled"></n-icon>
          每日推荐
        </n-breadcrumb-item>
      </n-breadcrumb>
      <playlistViewer style="margin-top: 20px;" :playlist-set="playlistSet" />
    </n-card>
  </n-scrollbar>
</template>