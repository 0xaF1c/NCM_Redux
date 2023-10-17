<script lang="ts">
import { defineComponent, provide, InjectionKey, reactive, ref } from 'vue'
import player from './Player.vue'

export const playerApiInjectionKey: InjectionKey<playerApiInjection> = 'playerApi' as any
export const playerStateInjectionkey: InjectionKey<iState> = 'playerState' as any

export type onProgressCallback = (progress: number, event: Event) => void
export type onDurationCallback = (duration: number, event: Event) => void
export type onWaitingCallback = (event: Event) => void
export type onEndedCallback = (event: Event) => void
export type onPlayCallback = (paused: boolean, event: Event) => void
export type onPauseCallback = (paused: boolean, event: Event) => void
export type onLoadeddataCallback = (event: Event) => void

export interface playerApiInjection {
  play(url?: string): void
  pause(): void
  muted(): void
  toggle(paused?: boolean): void
  loop(isLoop?: boolean): void
  setVolume(volume: number): void
  setProgress(progress: number): void
  setExternalUpdate(externalUpdate: boolean): void

  onTimeupdate(cb: onProgressCallback): void
  onDurationChange(cb: onDurationCallback): void
  onWaiting(cb: onWaitingCallback): void
  onEnded(cb: onEndedCallback): void
  onPlay(cb: onPlayCallback): void
  onPause(cb: onPauseCallback): void
  onLoadeddata(cb: onLoadeddataCallback): void
}

type iState = {
  url: string
  progress: number // 进度条 范围在1-100
  volume: number // 音量条 范围在1-100
  muted: boolean
  paused: boolean
  loop: boolean
  duration: number
  externalUpdate: boolean // 外部更新 如果外部更新时暂停timeupdate更新 如果timeupdate更新时暂停外部更新
}

export default defineComponent({
  components: {
    player
  },
  setup() {
    // data
    let onTimeupdateCallback: onProgressCallback = () => {}
    let onDurationChangeCallback: onDurationCallback = () => {}
    let onWaitingCallback: onWaitingCallback = () => {}
    let onEndedCallback: onEndedCallback = () => {}
    let onPlayCallback: onPlayCallback = () => {}
    let onPauseCallback: onPauseCallback = () => {}
    let onLoadeddataCallback: onLoadeddataCallback = () => {}

    const audio = ref<HTMLAudioElement>()
    const state = reactive<iState>({
      url: '',
      progress: 0,
      volume: 30,
      muted: false,
      paused: false,
      loop: false,
      duration: 0,
      externalUpdate: false
    })

    // methods
    function play(url: string) {
      const _play = () => {
        state.paused = false
        audio.value?.play()
      }
      if (url == null) {
        if (state.url == null) {
          throw new Error('audio element url is null')
        } else {
          _play()
        }
      } else {
        state.url = url
        const tempHandler = () => {
          _play()
          audio.value?.removeEventListener('loadeddata', tempHandler)
        }
  
        audio.value?.addEventListener('loadeddata', tempHandler)
      }
    }
    function pause() {
      state.paused = true
      audio.value?.pause()
    }
    function toggle(paused?: boolean) {
      if (paused) {
        state.paused = paused
      } else {
        state.paused = !state.paused
      }
    }
    function loop(isLoop?: boolean) {
      if (isLoop) {
        state.loop = isLoop
      } else {
        state.loop = !state.loop
      }
    }
    function setVolume(volume: number) {
      state.volume = volume
    }
    function onTimeupdate(event: any) {
      onTimeupdateCallback(state.progress, event)
    }
    function onDurationChange(event: any) {
      onDurationChangeCallback(state.duration, event)
    }
    function onWaiting(event: any) {
      onWaitingCallback(event)
    }
    function onEnded(event: any) {
      state.paused = true
      onEndedCallback(event)
    }
    function onPlay(event: any) {
      onPlayCallback(state.paused, event)
    }
    function onPause(event: any) {
      onPauseCallback(state.paused, event)
    }
    function onLoadeddata(event: any) {
      onLoadeddataCallback(event)
    }
    function setExternalUpdate(externalUpdate: boolean) {
      state.externalUpdate = externalUpdate
    }

    const api: playerApiInjection = {
      play(url: string) {
        play(url)
      },
      pause() {
        pause()
      },
      toggle(paused?: boolean) {
        toggle(paused)
      },
      setVolume(volume: number) {
        setVolume(volume)
      },
      muted() {
        state.muted = !state.muted
      },
      loop(isLoop?: boolean) {
        loop(isLoop)
      },
      setExternalUpdate(externalUpdate: boolean) {
        setExternalUpdate(externalUpdate)
      },
      onTimeupdate(cb: onProgressCallback) {
        onTimeupdateCallback = cb
      },
      onDurationChange(cb: onDurationCallback) {
        onDurationChangeCallback = cb
      },
      onWaiting(cb: onWaitingCallback) {
        onWaitingCallback = cb
      },
      onEnded(cb: onEndedCallback) {
        onEndedCallback = cb
      },
      onPlay(cb: onPlayCallback) {
        onPlayCallback = cb
      },
      onPause(cb: onPauseCallback) {
        onPauseCallback = cb
      },
      onLoadeddata(cb: onLoadeddataCallback) {
        onLoadeddataCallback = cb
      },
      setProgress(progress) {
        // @ts-ignore
        audio.value.currentTime = progress
      },
    }

    provide(playerApiInjectionKey, api)
    provide(playerStateInjectionkey, state)

    return {
      onTimeupdateCallback,
      onDurationChangeCallback,
      onWaitingCallback,
      onEndedCallback,
      onPlayCallback,
      onPauseCallback,
      onLoadeddataCallback,
      toggle,
      onTimeupdate,
      onDurationChange,
      onWaiting,
      onEnded,
      onPlay,
      onPause,
      onLoadeddata,
      api,
      state,
      audio
    }
  }
})

</script>

<template>
  <player
    :url="state.url"
    :paused="state.paused"
    :loop="state.loop"
    v-model:progress="state.progress"
    :volume="state.volume"
    :muted="state.muted"
    :externalUpdate="state.externalUpdate"

    @update:duration="d => state.duration = d"
    @update:progress="p => state.progress = p"
    @ended="onEnded"
    @timeupdate="onTimeupdate"
    @durationChange="onDurationChange"
    @waiting="onWaiting"
    @play="onPlay"
    @pause="onPause"
    @loadeddata="onLoadeddata"
    @update:audioElement="a => audio = a"
  ></player>
  <slot></slot>
</template>