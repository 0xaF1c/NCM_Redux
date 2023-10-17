<script setup lang="ts">
import {
  NDrawer,
  NDrawerContent,
  NAvatar,
  NSpace,
  NText,
  NConfigProvider,
  darkTheme,
  NButton,
  NIcon,
  NPopover,
  NSlider,
  NSwitch,
  NInputNumber,
  NTooltip
} from 'naive-ui'

import lyricRender from './lyricRender.vue'

// @ts-ignore
import analyze from 'rgbaster'
import { watch, ref } from 'vue'
import { Song } from '../../types';
import AlbumLink from '../../components/linkBtn/albumLink.vue';
import ArtistLink from '../../components/linkBtn/artistLink.vue';
import { Next24Filled, Pause24Filled, Play24Filled, Previous24Filled, Speaker024Filled, Speaker024Regular, Speaker124Filled, Speaker124Regular, Speaker224Filled, Speaker224Regular } from '@vicons/fluent';
import { usePlayerState } from '../../components/player/usePlayerState';
// @ts-ignore
import { useStore } from 'vuex';
import { usePlayer } from '../../components/player/usePlayer';
import { isMobile } from '../../utils/isMobile'

const store = useStore()
const playerState = usePlayerState()
const { toggle } = usePlayer()

const volumeBarShow = ref(false)
const darkMode = ref(false)
const roma = ref(false)
const tlyric = ref(true)
const lycDelay = ref(500)

const props = defineProps<{
  song: Song
  show: boolean
}>()

const emits = defineEmits<{
  (e: 'update:show', data: boolean): void
  (e: 'update:darkMode', data: boolean): void
}>()

const update = async () => {
  const result = await analyze(props.song?.album.picUrl, { scale: 0.3 })
  const samp = result.length < 35 ? result.length - 1 : 35
  let sum = 0

  // 取样前十种颜色
  for (let i = 0; i < samp; i++) {
    const item = result[i]
    const colorStr = item.color.match(/\((.*?)\)/)[1].split(',')

    // 算明暗度
    let rgbSum = 0
    colorStr.forEach((item: any) => {
      rgbSum += parseInt(item)
    })
    sum += rgbSum / 3
  }
  sum /= samp

  darkMode.value = sum < 255 * 0.6

  emits('update:darkMode', darkMode.value)
}
watch(
  () => props.song,
  () => {
    update()
  }
)

const onPrevious = () => {
  store.commit('player/previous')
  setTimeout(() => toggle(false), 1000)
}
const onNext = () => {
  store.commit('player/next')
  setTimeout(() => toggle(false), 1000)
}
</script>


<template>
  <n-config-provider :theme="darkMode ? darkTheme : null">
    <n-drawer close-on-esc :show="props.show" @update:show="v => emits('update:show', v)" placement="bottom" height="100%"
      style="overflow: hidden;">
      <n-drawer-content class="container" closable header-style="border: none;z-index: 2;">
        <div class="shader" :style="{ backgroundImage: `url(${props.song?.album.picUrl})` }"></div>
        <n-space class="content" :justify="isMobile() ? 'flex-start' : 'space-evenly'" align="center"
          :vertical="isMobile() ? true : false" :wrap="false">
          <n-space vertical justify="center" align="center" v-show="isMobile() ? false : true">
            <n-avatar :src="props.song?.album.picUrl" :size="isMobile() ? 300 : 500"></n-avatar>
            <n-text class="name">
              {{ props.song?.name }}
            </n-text>
            <n-text class="tns">
              <span v-for="tn in props.song?.tns">
                {{ tn }}
              </span>
              <span v-for="alia in props.song?.alias">
                {{ alia }}
              </span>
            </n-text>
            <n-text class="artist">
              <span v-for="artist in props.song.artists">
                <ArtistLink :id="artist.id" @click="emits('update:show', false)">
                  {{ artist.name }}
                </ArtistLink>
                &nbsp;
              </span>
            </n-text>
            <n-text class="album">
              <AlbumLink :id="props.song.album.id" @click="emits('update:show', false)">
                {{ props.song?.album.name }}
              </AlbumLink>
            </n-text>
          </n-space>
          <lyricRender class="lyricRender" :lyc-delay="lycDelay" :romaEnable="roma" :tlyricEnable="tlyric"
            :id="props.song.id" :style="isMobile() ? { maxHeight: '100vh' } : {}" :duration="props.song.dt" />
        </n-space>
        <div class="controller">
          <div class="left">
            <div>
              <span>歌词延迟:</span>
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-input-number v-model:value="lycDelay" clearable button-placement="both" style="width: 150px;" :step="100">
                    <template #suffix>
                      ms
                    </template>
                  </n-input-number>
                </template>
                别调太大 会鬼畜
              </n-tooltip>
            </div>
            <n-switch size="large" v-model:value="roma">
              <template #checked>
                罗马音 开
              </template>
              <template #unchecked>
                罗马音 关
              </template>
            </n-switch>
            <n-switch size="large" v-model:value="tlyric">
              <template #checked>
                翻译 开
              </template>
              <template #unchecked>
                翻译 关
              </template>
            </n-switch>
          </div>
          <div class="middle">
            <n-button size="large" circle quaternary @click="onPrevious">
              <n-icon size="25" :component="Previous24Filled" />
            </n-button>
            <n-button size="large" circle @click="toggle()" type="primary">
              <n-icon size="30" v-show="!playerState.paused" :component="Pause24Filled" />
              <n-icon size="30" v-show="playerState.paused" :component="Play24Filled" />
            </n-button>
            <n-button size="large" circle quaternary @click="onNext">
              <n-icon size="25" :component="Next24Filled" />
            </n-button>
          </div>

          <div class="right">
            <n-popover width="trigger" trigger="click"
              style="height: 200px; display: flex; justify-content: center;z-index: 9999;"
              content-style="height:100%; padding: 0;" @update:show="val => volumeBarShow = val">
              <template #trigger>
                <n-button size="large" circle quaternary>
                  <template #icon>
                    <n-icon size="30" v-show="!volumeBarShow && playerState.volume == 0" :component="Speaker024Regular" />
                    <n-icon size="30" v-show="!volumeBarShow && playerState.volume < 0.6 && playerState.volume > 0"
                      :component="Speaker124Regular" />
                    <n-icon size="30" v-show="!volumeBarShow && playerState.volume > 0.6"
                      :component="Speaker224Regular" />
                    <n-icon size="30" v-show="volumeBarShow && playerState.volume == 0" :component="Speaker024Filled" />
                    <n-icon size="30" v-show="volumeBarShow && playerState.volume < 0.6 && playerState.volume > 0"
                      :component="Speaker124Filled" />
                    <n-icon size="30" v-show="volumeBarShow && playerState.volume > 0.6" :component="Speaker224Filled" />
                  </template>
                </n-button>
              </template>
              <n-slider vertical v-model:value="playerState.volume" :step="0.01" :tooltip="false"
                :format-tooltip="num => `${Math.floor(num)}%`"></n-slider>
            </n-popover>
          </div>
        </div>

      </n-drawer-content>
    </n-drawer>
  </n-config-provider>
</template>

<style scoped lang="less">
.name {
  font-size: 2.5rem;
}

.shader {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: center center no-repeat;
  background-size: cover;
  filter: blur(100px);
  z-index: 1;
  transform: scale(1.25);
}

.container {
  position: relative;
  overflow: hidden;
}

.content {
  position: relative;
  z-index: 2;
  height: 100%;
}

.controller {
  display: flex;
  position: absolute;
  left: 0;
  bottom: 0;
  height: 80px;
  width: 100%;
  z-index: 3;
  justify-content: space-evenly;
  align-items: center;

  .middle {
    display: flex;
    justify-content: space-between;
    width: 150px;
    align-items: flex-end;
  }

  .left {
    width: 400px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  .right {
    width: 400px;
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
  }
}
</style>