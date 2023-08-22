<script setup lang="ts">
import {
  NDrawer,
  NDrawerContent,
  NAvatar,
  NSpace,
  NText,
  NConfigProvider,
  darkTheme
} from 'naive-ui'
// @ts-ignore
import analyze from 'rgbaster'
import { watch, ref } from 'vue'
import { Song } from '@/types';

const darkMode = ref(false)
const props = defineProps<{
  song: Song
  show: boolean
}>()

const emits = defineEmits<{
  (e: 'update:show', data: boolean) : void
  (e: 'update:darkMode', data: boolean) : void
}>()

const update = async () => {
  const result = await analyze(props.song?.album.picUrl, { scale: 0.3 })
  const samp = 35
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
</script>


<template>
  <n-config-provider :theme="darkMode ? darkTheme : null">
    <n-drawer close-on-esc :show="props.show" @update:show="v => emits('update:show', v)" placement="bottom" height="100%">
      <n-drawer-content class="container" closable header-style="border: none;z-index: 2;">
        <div class="shader" :style="{backgroundImage: `url(${props.song?.album.picUrl})`}"></div>
        <n-space class="content" vertical justify="center" align="center">
          <n-avatar :src="props.song?.album.picUrl" :size="500"></n-avatar>
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
          <n-text class="album">
            {{ props.song?.album.name }}
          </n-text>
        </n-space>
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
}
</style>