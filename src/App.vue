<script setup lang="ts">
import {
  NLoadingBarProvider,
  NMessageProvider,
  NLayout,
  NConfigProvider,
  NLayoutContent,
  NLayoutFooter,
  NLayoutSider,
  NSlider,
  NMenu
} from 'naive-ui'
import headerView from './views/header/headerView.vue'
import loginView from './views/login/loginView.vue'
import playerView from './views/player/playerView.vue'
import menuView from './views/menu/menuView.vue'

import { useToggleTheme } from './utils/toggleTheme'
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { http } from './utils/request'
import { Song } from './types'

const store = useStore()

const { theme } = useToggleTheme()

const show = ref(false)

/* test */
const state = reactive<{
  playlist: Array<Song>
  playlistTitle: string
}>({
  playlist: [],
  playlistTitle: ''
})
const userId = store.getters.userStatus.profile.userId
;;( async () => {
  // 准备数据
  // const userPlaylist = (await http.get(`/user/playlist?uid=${userId}`)).data.playlist
  // const formattedPlaylists = userPlaylist.map((item: any) => ({ name: item.name, id: item.id }))

  // const playlistTrackAll = (await http.get(`/playlist/track/all?id=${formattedPlaylists[0].id}`))
  // state.playlistTitle = formattedPlaylists[0].name
  // console.log(playlistTrackAll)
  
  // state.playlist = playlistTrackAll.data.songs.map((item: any): Song => {
  //   return {
  //     album: item.al,
  //     alias: item.alia,
  //     artists: item.ar,
  //     dt: item.dt,
  //     id: item.id,
  //     name: item.name,
  //     tns: item.tns,
  //   }
  // })
  
} )()
</script>

<template>

  <n-config-provider :theme="theme">
    <n-message-provider>
      <n-loading-bar-provider>

        <loginView @update:show="value => show = value" :show="show" />
        <n-layout class="container">
          <header-view v-model:show="show" v-model:theme="theme"></header-view>
          <n-layout has-sider class="medium">
            <n-layout-sider bordered>
              <menu-view></menu-view>
            </n-layout-sider>
            <n-layout-content>

              <router-view />
            </n-layout-content>
          </n-layout>
          <playerView v-model:playlist="state.playlist" :playlist-title="state.playlistTitle" />
        </n-layout>

      </n-loading-bar-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<style scoped lang="less">
@import url('./styles/varible.less');

.n-config-provider {
  height: 100vh;
}

.header {
  height: @header-height;
}

.container {
  height: 100%;

  .medium {
    height: calc(100% - @footer-height - @header-height);
  }

  .n-layout-footer {
    position: relative;
    height: @footer-height;
  }
}
</style>