<template>
  <audio
    :src="props.url"
    :ref="setupMyAudio"
    :loop="loop"

    @durationchange="onDurationChange"
    @timeupdate="onTimeupdate"
    @waiting="onWaiting"
    @ended="emits('ended', null)"
    @play="emits('play', null)"
    @pause="emits('pause', null)"
    @loadeddata="emits('loadeddata', null)"
  ></audio>
</template>

<script setup lang="ts">
import { watch, ref, onMounted } from 'vue'

type myAudioProps = {
  url: string
  progress: number // 进度条 范围在1-100
  volume: number // 音量条 范围在1-100
  muted: boolean
  paused: boolean
  loop: boolean
  duration: number
  externalUpdate: boolean // 外部更新 如果外部更新时暂停timeupdate更新 如果timeupdate更新时暂停外部更新
}
const audio = ref<HTMLAudioElement | null>(null)
const props = defineProps<myAudioProps>()
const emits = defineEmits<{
  (e: 'update:progress', data: number) : void
  (e: 'update:duration', data: number) : void
  (e: 'waiting', data: number) : void
  (e: 'ended', data: null) : void
  (e: 'play', data: null) : void
  (e: 'pause', data: null) : void
  (e: 'loadeddata', data: null) : void
}>()

watch(() => props.paused, (value) => {
  const el: HTMLAudioElement = audio.value!
  if (value) {
    el.pause()
  } else {
    el.play()
  }
})
watch(() => props.progress, (value) => {
  const el: HTMLAudioElement = audio.value!

  if (el.currentTime != 0) {
    if (props.externalUpdate) {
      el.currentTime = el.duration * (value / 100)
    }
  }
})
watch(() => props.volume, (value) => {  
  audio.value!.volume = value / 100
})
watch(() => props.muted, (value) => {
  audio.value!.muted = value
})
watch(() => props.loop, (value) => {
  audio.value!.loop = value
})
watch(() => props.url, () => {
  emits('update:progress', 0)
  if (!props.paused) {
    setTimeout(() => audio.value!.play())
  }
})

const onDurationChange = () => {
  emits('update:duration', audio.value!.duration)
}

const onTimeupdate = () => {
  const el: HTMLAudioElement = audio.value!

  if (!props.externalUpdate) {
    emits('update:progress', (el.currentTime / el.duration) * 100)
  }
}

const onWaiting = (event: any) => {
  emits('waiting', event)
}
onMounted(() => {
  audio.value!.volume = props.volume / 100
})
const setupMyAudio: any = (element: HTMLAudioElement) => {
  audio.value = element
}

</script>