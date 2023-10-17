<script setup lang="ts">
import PlayerProvider from './components/player/PlayerProvider.vue'
import loginProvider from './components/login/loginProvider.vue'

import {
  NLoadingBarProvider,
  NMessageProvider,
  NLayout,
  NConfigProvider,
  NLayoutContent,
  NLayoutSider,
} from 'naive-ui'
import { RouterView, onBeforeRouteLeave } from 'vue-router'
// @ts-ignore
import { useStore } from 'vuex'
import headerView from './views/header/headerView.vue'
import menuView from './views/menu/menuView.vue'

import { useToggleTheme } from './utils/toggleTheme'
import { isMobile } from './utils/isMobile'
import { ref } from 'vue'
const store = useStore()
const { theme } = useToggleTheme()

const show = ref(false)
const collapsed = ref(isMobile())

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

store.dispatch('getLikelist')
store.commit('player/init')
// store.commit('player/init')
// console.log(isMobile());
onBeforeRouteLeave((_to, from, next) => {
  console.log(from.path)
  next((vm: any) => {
    console.log(from.path)
    vm.fromPath = from.path
  })
})

</script>

<template>
  <n-config-provider :theme="theme" :theme-overrides="theme === null ? lightThemeOverrides : darkThemeOverrides">
    <n-message-provider>
      <n-loading-bar-provider>
        <loginProvider>
          <PlayerProvider>
            <n-layout class="container"
              :scrollbar-props="{ scrollable: false, containerStyle: { overflow: 'hidden' }, contentStyle: { overflow: 'hidden' }, }"
              native-scrollbar>
              <header-view v-model:show="show" v-model:theme="theme"></header-view>
              <n-layout has-sider class="medium">
                <n-layout-sider
                  bordered 
                  collapse-mode="width"
                  :collapsed-width="84"
                  :width="240"
                  :collapsed="collapsed"
                  show-trigger
                  @collapse="collapsed = true"
                  @expand="collapsed = false"
                >
                  <menu-view :collapsed="collapsed" />
                </n-layout-sider>
                <n-layout-content>
                  <router-view />
                </n-layout-content>
              </n-layout>
              
              <router-view name="player" />
              <!-- <playerView /> -->
              <!-- <keep-alive>
              </keep-alive> -->
            </n-layout>
          </PlayerProvider>
        </loginProvider>
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