<script lang="ts" setup>
import {
  NLayoutFooter,
  NSlider,
  NButton,
  NIcon,
  NPopover,
  NAvatar,
  NThing,
  NTooltip,
} from "naive-ui"
import {
  ReceiptPlay20Regular,
  ReceiptPlay20Filled,
  Replay20Filled,
  ArrowRepeatAll20Filled,
  ArrowRepeatAllOff20Filled,
  Speaker224Regular,
  Speaker124Regular,
  Speaker024Regular,
  Speaker224Filled,
  Speaker124Filled,
  Speaker024Filled,
  Pause24Filled,
  Play24Filled,
  Next24Filled,
  Previous24Filled
} from '@vicons/fluent'
import { ref, onMounted, watch } from 'vue'
import { Song } from '../../types'
import { getMusicUrl } from '../../requests/getMusicUrl'

// @ts-ignore
import { useStore } from "vuex"

import playingPlaylist from './playingPlaylist.vue'
import playerDetail from "./playerDetail.vue"
import musicLikeBtn from '../../components/musicLikeBtn/musicLikeBtn.vue'
import artistLink from '../../components/linkBtn/artistLink.vue'
import { usePlayer } from "../../components/player/usePlayer"
import { usePlayerState } from "../../components/player/usePlayerState"
// @ts-ignore
import { formatSeconds } from '../../utils/formatSeconds'

const store = useStore()
const { toggle, setExternalUpdate, onEnded, loop, onTimeupdate, setProgress, onLoadeddata } = usePlayer()
const playerState = usePlayerState()

const playerDetailShow = ref(false)
const playingPlaylistShow = ref(false)
const loopMode = ref(0)
const playModeTooltip = ref([
  '列表循环',
  '单曲循环',
  '播完歌单后暂停'
])
const volumeBarShow = ref(false)
const currentSong = ref<Song | null>(null)

// getPlaylistDetail(7162471052).then((res) => {
//   const playlist = res?.data.playlist.tracks
//   const formatted = formatPlaylist(playlist)

//   store.commit('player/setPlaylist', formatted)
// })

onTimeupdate((progress) => {  
  store.commit('player/setProgress', isNaN(progress) ? 0 : progress)
})
let init = true
onMounted(() => {
  onLoadeddata(() => {
    if (init) {
      setProgress(playerState.duration * (store.state.player.progress / 100))
    }
    init = false
  })
})

onEnded(() => {
  if (loopMode.value === 0) {
    onNext()
    
  } else if (loopMode.value === 2) {
    if (store.state.player.index === store.state.player.playlist.length - 1) {
      store.commit('player/setIndex', 0)
    }
  }
})

const onDarg = () => {
  setExternalUpdate(true)
  const tempHandler = () => {
    setExternalUpdate(false)
    window.removeEventListener('mouseup', tempHandler)
  }
  window.addEventListener('mouseup', tempHandler)
}
const onCoverClick = () => {
  playerDetailShow.value = true
}
const onPlayModeChange = () => {
  if (loopMode.value === 1) {
    loop(true)
  }
  if (loopMode.value === 2) {
    loopMode.value = 0
  } else {
    loop(false)
    loopMode.value++
  }
}
const updateSong = () => {
  const song = store.state.player.playlist[store.state.player.index]
  
  if (song === undefined) {
    return
  }
  
  if (song !== null || song !== undefined) {
    currentSong.value = song
    window.document.title = `${playerState.paused?' ':'▶'} ${currentSong.value?.name} - NCM_Redux`
    console.log(currentSong.value)
    navigator.mediaSession.metadata = new MediaMetadata({
      title: song.name,
      artist: song?.artists.map((a: any) => a.name + " "),
      album:  song?.name,
      artwork: [{ src: song?.album.picUrl }],
    })
    getMusicUrl(song?.id)
      .then(res => {
        
        playerState.url = res?.data?.data[0]?.url
        // play()
        setTimeout(() => toggle(true), 100)
      })
  }
}

const onPrevious = () => {
  store.commit('player/previous')
  setTimeout(() => toggle(false), 1000)
}
const onNext = () => {
  store.commit('player/next')
  setTimeout(() => toggle(false), 1000)
}
const onPauseClick = () => {
  window.document.title = `${playerState.paused?' ':'▶'} ${currentSong.value?.name} - NCM_Redux`
  toggle()
}

navigator.mediaSession.setActionHandler('play', () => onPauseClick())
navigator.mediaSession.setActionHandler('pause', () => onPauseClick())
navigator.mediaSession.setActionHandler("previoustrack", () => onPrevious())
navigator.mediaSession.setActionHandler("nexttrack", () => onNext())
navigator.mediaSession.setActionHandler("seekbackward", () => onPrevious())
navigator.mediaSession.setActionHandler("seekforward", () => onNext())


watch(
  () => store.state.player.index,
  () => {
    updateSong()
  }
)
watch(
  () => store.state.player.playlist,
  () => {
    updateSong()
  }
)
onMounted(() => {
  updateSong()
})
</script>

<template>
  <n-layout-footer bordered class="player">
    <div class="container">
      <div class="left">
        <n-thing>
          <template #avatar>
            <n-avatar @click="onCoverClick" :size="80" class="cover" :src="currentSong?.album.picUrl"></n-avatar>
          </template>
          <template #header>
            {{ currentSong?.name }}
          </template>
          <template #description>
            <artist-link v-for="artist in currentSong?.artists" :id="artist.id" style="margin-right: 7px;">
              {{ artist.name }}
            </artist-link>
          </template>
          <template #header-extra>
            <musicLikeBtn :id="currentSong?.id" />
          </template>
        </n-thing>
      </div>
      <div class="middle">
        <n-button size="large" circle quaternary @click="onPrevious">
          <n-icon size="25" :component="Previous24Filled" />
        </n-button>
        <n-button size="large" circle @click="onPauseClick" type="primary">
          <n-icon size="30" v-show="!playerState.paused" :component="Pause24Filled" />
          <n-icon size="30" v-show="playerState.paused" :component="Play24Filled" />
        </n-button>
        <n-button size="large" circle quaternary @click="onNext">
          <n-icon size="25" :component="Next24Filled" />
        </n-button>
      </div>
      <div class="right">
        <n-popover width="trigger" trigger="click" style="height: 200px; display: flex; justify-content: center;z-index: 9999;"
          content-style="height:100%; padding: 0;" @update:show="val => volumeBarShow = val">
          <template #trigger>
            <n-button size="large" circle quaternary>
              <template #icon>
                <n-icon size="30" v-show="!volumeBarShow && playerState.volume == 0" :component="Speaker024Regular" />
                <n-icon size="30" v-show="!volumeBarShow && playerState.volume < 0.6 && playerState.volume > 0" :component="Speaker124Regular" />
                <n-icon size="30" v-show="!volumeBarShow && playerState.volume > 0.6" :component="Speaker224Regular" />
                <n-icon size="30" v-show="volumeBarShow && playerState.volume == 0" :component="Speaker024Filled" />
                <n-icon size="30" v-show="volumeBarShow && playerState.volume < 0.6 && playerState.volume > 0" :component="Speaker124Filled" />
                <n-icon size="30" v-show="volumeBarShow && playerState.volume > 0.6" :component="Speaker224Filled" />
              </template>
            </n-button>
          </template>
          <n-slider vertical v-model:value="playerState.volume" :step="0.01" :tooltip="false"
            :format-tooltip="num => `${Math.floor(num)}%`"></n-slider>
        </n-popover>
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button size="large" circle quaternary @click="onPlayModeChange">
              <template #icon>
                <n-icon size="30" v-show="loopMode == 0" :component="Replay20Filled" />
                <n-icon size="30" v-show="loopMode == 1" :component="ArrowRepeatAll20Filled" />
                <n-icon size="30" v-show="loopMode == 2" :component="ArrowRepeatAllOff20Filled" />
              </template>
            </n-button>
          </template>
          <span>
            {{ playModeTooltip[loopMode] }}
          </span>
        </n-tooltip>
        <n-button size="large" circle quaternary @click="playingPlaylistShow = !playingPlaylistShow">
          <template #icon>
            <n-icon size="30" v-show="!playingPlaylistShow" :component="ReceiptPlay20Regular" />
            <n-icon size="30" v-show="playingPlaylistShow" :component="ReceiptPlay20Filled" />
          </template>
        </n-button>
      </div>
    </div>
    <n-slider
      :class="['progressSlider', { playerDetailActive: playerDetailShow}]"
      v-model:value="playerState.progress"
      :step="0.001"
      @update:value="onDarg"
      :format-tooltip="_ => formatSeconds(playerState.duration * (playerState.progress / 100))"
    >
      <template #thumb>
        <n-button v-if="playerDetailShow" text circle></n-button>
      </template>
    </n-slider>

    <playerDetail :song="currentSong!" v-model:show="playerDetailShow" />
    <playing-playlist :playlist-title="'aaa'" v-model:show="playingPlaylistShow"></playing-playlist>
  </n-layout-footer>
</template>

<style lang="less" scoped>
@import url('../../styles/varible.less');
.player {
  width: 100%;
  display: flex;
}
.progressSlider {
  position: absolute;
  bottom: calc(@footer-height - 8px);
  z-index: 1000;
  transition: bottom .5s;
  left: 0;
  width: 100%;
}
.progressSlider.playerDetailActive {
  z-index: 5000;
  bottom: -6.5px;
}

.container {
  height: 100%;
  width: 100%;
  padding-left: @total-padding-left;
  padding-right: @total-padding-right;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;

  .middle,
  .right,
  .left {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .left {
    transition: margin-left .5s;
  }

  .middle {
    width: 12vw;
    position: absolute;
    left: 50%;
    transform: translate(-50%);
  }

  .right {
    width: 10vw;
    height: 100%;
  }
}
.cover {
  cursor: pointer;
}
</style>