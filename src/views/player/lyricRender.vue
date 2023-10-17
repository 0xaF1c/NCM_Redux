<script setup lang="ts">
import {
  NScrollbar
} from 'naive-ui'

import { lyric } from '../../requests/lyric'
import { ref, watch } from 'vue'
import { usePlayerState } from '../../components/player/usePlayerState'

import { lyricParser } from '../../utils/lyrics'
import { usePlayer } from '../../components/player/usePlayer'

const { setProgress } = usePlayer()

const playerState = usePlayerState()
const props = defineProps<{
  id: number | string
  duration: number
  lycDelay: number
  romaEnable: boolean
  tlyricEnable: boolean
}>()



const lyrics = ref<any>([])
const progress = ref(0)
const index = ref(0)
const userScroll = ref(false)

const lyricScrollbar = ref()

const lyricScrollTo = (index: number) => {
  const lyricEls: any = document.querySelectorAll('div.lyricRow')!
  lyricEls.forEach((item: any) => item?.classList.remove('active'))
  lyricEls[index]?.classList.add('active')
  
  if (!userScroll.value) {
    lyricScrollbar.value.scrollTo({
      top: lyricEls[index]?.offsetTop - 260,
      behavior: 'smooth'
    })
  }
}

const syncLyric = () => {
  progress.value = playerState.progress

  document.querySelectorAll('div.lyricRow')?.forEach((item: any, i: number) => {
    const currentTime = playerState.progress / 100 * playerState.duration
    const diff = Math.abs(Number(item.getAttribute('name')) - Number(currentTime))

    if (diff < 1) {
      setTimeout(() => {
        index.value = i
        lyricScrollTo(index.value)
      }, props.lycDelay)
    }
  })
}
syncLyric()
const updateLiryc = async () => {
  const lyricRes = await lyric(props.id)

  lyrics.value = lyricParser(lyricRes?.data)

  lyricScrollbar.value?.scrollTo({
    top: 0
  })
}
const onLrcClick = (item: any, index: number) => {
  setProgress(Number(item.time))
  lyricScrollTo(index)
}
let timer: any = null
const onScroll = () => {
  //防抖算法
  const delay = 500
  userScroll.value = true

  if (timer != null) clearTimeout(timer)
  timer = setTimeout(() => {
    userScroll.value = false
  }, delay)
}

watch(
  () => props.id,
  () => {
    updateLiryc()
  }
)
watch(
  () => playerState.progress,
  () => {
    syncLyric()
  }
)
updateLiryc()
</script>

<template>
  <n-scrollbar ref="lyricScrollbar" style="max-height: 70vh; width: 500px; margin-top: -120px;" @scroll="onScroll">
    <div class="lyricContainer">
      <div class="placeholder"></div>

      <div v-for="(item, i) in lyrics.lyric" class="lyricRow" :name="item.time" @click="onLrcClick(item, i)">
        <div class="lrc">{{ item.content }}</div>
        <div v-if="props.tlyricEnable" class="tlyric">{{ lyrics.tlyric.find((lrc: any) => lrc.time == item.time)?.content }}
        </div>
        <div v-if="props.romaEnable" class="romalyric">{{ lyrics.romalyric.find((lrc: any) => lrc.time == item.time)?.content }}
        </div>
      </div>
      <div class="placeholder"></div>
    </div>
  </n-scrollbar>
</template>

<style scoped lang="less">
.lyricContainer {
  width: 100%;

  .placeholder {
    height: 260px;
  }

  .lyricRow {
    font-size: 1.3rem;
    min-height: 45px;
    opacity: 0.3;
    transform: scale(0.7) translate(-20%);
    transition: opacity .5s, font-weight .5s, transform .5s;
    cursor: pointer;
  }

  .lyricRow.active,
  .lyricRow.active:hover {
    opacity: 1;
    font-size: 1.3rem;
    font-weight: bold;
    transform: scale(1) translate(2%);
  }
  .lyricRow:hover {
    opacity: 1;
    font-size: 1.3rem;
    font-weight: bold;
    transform: scale(0.8) translate(-10%);
  }
}
</style>