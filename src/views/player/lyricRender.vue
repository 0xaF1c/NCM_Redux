<script setup lang="ts">
import {
  NScrollbar
} from 'naive-ui'

import { lyric } from '@/requests/lyric'
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import { FormatTimerstampCallback, formatTimerstamp } from '@/utils/formatTimerstamp'

const props = defineProps<{
  id: number | string
  duration: number
}>()



const lyricObj = ref<any>([])
const tlyricObj = ref<any>([])
const store = useStore()
const progress = ref(0)


const formatLyric = (lyric: any) => {
  return lyric.split('\n').map((item: string) => {
    const time: any = item.match(/\[(.*?)\]/)?.[0] || '[00:00.00]'
    const lyric = item.replace(time, '')
    return {
      time,
      lyric
    }
  })
}

const lyricScrollbar = ref()

const lyricScrollTo = (index: number) => {
  const lyricEls: any = document.querySelectorAll('div.lyricRow')!
  lyricEls.forEach((item: any) => item?.classList.remove('active'))
  lyricEls[index]?.classList.add('active')
  
  lyricScrollbar.value.scrollTo({
    top: lyricEls[index]?.offsetTop - 450,
    behavior: 'smooth'
  })
}

const updateLiryc = async () => {
  const lyricRes = await lyric(props.id)
  
  lyricObj.value = formatLyric(lyricRes.data.lrc.lyric)
  tlyricObj.value = formatLyric(lyricRes.data.tlyric.lyric)
  lyricScrollTo(0)
}

watch(
  () => props.id,
  () => {
    updateLiryc()
  }
)
watch(
  () => store.state.progress,
  () => {
    progress.value = store.state.progress
    
    const cb : FormatTimerstampCallback = (h, m, s, ms) => {
      return `[${m<10?'0':''}${m}:${s<10?'0':''}${s}.${ms}]`
    }
    const time = formatTimerstamp(props.duration * (progress.value / 100), cb)
    
    lyricObj.value.forEach((item: any, index: number) => {
      
      if (item.time.split('.')[0] === time.split('.')[0]) {
        lyricScrollTo(index)
      }
    })
  }
)
updateLiryc()
</script>

<template>
  <n-scrollbar ref="lyricScrollbar" style="max-height: 70vh; width: 500px; margin-top: -120px;">
    <div class="lyricContainer">
      <div class="placeholder"></div>
      <div v-for="(item, i) in lyricObj" class="lyricRow" :name="item.time">
        <div class="lrc">{{ item.lyric }}</div>
        <div v-if="tlyricObj.length > 0" class="tlrc">{{ tlyricObj[i]?.lyric }}</div>
      </div>
    </div>
  </n-scrollbar>
</template>

<style scoped lang="less">
.lyricContainer {
  width: 100%;
  .placeholder {
    height: 450px;
  }
  .lyricRow {
    font-size: 1.3rem;
    min-height: 45px;
    opacity: 0.3;
    transform: scale(0.7) translate(-20%);
    transition: opacity .5s, font-weight .5s, transform .5s;
  }
  .lyricRow.active {
    opacity: 1;
    font-size: 1.3rem;
    font-weight: bold;
    transform: scale(1) translate(2%);
  }
}
</style>