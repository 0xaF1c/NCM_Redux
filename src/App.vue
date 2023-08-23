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
  NMenu,
  NScrollbar
} from 'naive-ui'
import headerView from './views/header/headerView.vue'
import loginView from './views/login/loginView.vue'
import playerView from './views/player/playerView.vue'
import menuView from './views/menu/menuView.vue'

import { useToggleTheme } from './utils/toggleTheme'
import { ref, reactive, watch } from 'vue'
import { useStore, mapGetters } from 'vuex'
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

watch(
  () => store.state.playlist,
  () => {
    state.playlist = store.state.playlist
  }
)

const lightThemeOverrides = {
  common: {
    // primaryColor: '#000000'
  }
}

const darkThemeOverrides = {
  common: {
    // primaryColor: '#FFFFFF'
  }
}
</script>

<template>

  <n-config-provider :theme="theme" :theme-overrides="theme === null ? lightThemeOverrides : darkThemeOverrides">
    <n-message-provider>
      <n-loading-bar-provider>

        <loginView @update:show="value => show = value" :show="show" />
        <n-layout class="container" :scrollbar-props="{scrollable: false, containerStyle: {overflow: 'hidden'}, contentStyle: {overflow: 'hidden'}, }" native-scrollbar>
          <header-view v-model:show="show" v-model:theme="theme"></header-view>
          <n-layout has-sider class="medium">
            <n-layout-sider bordered>
              <menu-view />
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
* {
  padding: 0;
  margin: 0;
}
.n-config-provider {
  height: 100vh;
}

.header {
  height: @header-height;
}

.container {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .medium {
    height: calc(100% - @footer-height - @header-height);
  }

  .n-layout-footer {
    position: relative;
    height: @footer-height;
  }
}
</style>