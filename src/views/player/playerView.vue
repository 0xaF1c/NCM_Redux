<script lang="ts" setup>
import {
  NLayoutFooter,
  NSlider,
  NButton,
  NIcon,
  NSpin,
  NPopover,
  NAvatar,
  NThing,
  NTooltip,
  useMessage
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
  Heart24Regular,
  Heart24Filled,
  Pause24Filled,
  Play24Filled,
  Next24Filled,
  Previous24Filled
} from '@vicons/fluent'
import playlistView from './playlistView.vue'
import { Playlist } from '@/types'
import { ref, onMounted, watch } from 'vue'
import store from "@/store"
import { getMusicUrl } from '@/requests/getMusicUrl'
import { useRequest } from 'vue-request'
import myAudio from '@/components/myAudio.vue'

const { info } = useMessage()

const props = defineProps<{
  playlist: Playlist
  playlistTitle: string
}>()

const emits = defineEmits<{
  (e: 'update:playlist', data: Playlist): void
}>()

const progress = ref(0)
const show = ref(false)
const index = ref(0)
const playMode = ref(0)
const playModeTooltip = ref(['单曲循环', '列表循环', '播完暂停'])
const volume = ref(1)
const muted = ref(false)
const liked = ref(false)
const volumeBarShow = ref(false)
const paused = ref(true)
const rate = ref(1)
const duration = ref(0)
const cacheTime = ref(0)
const loop = ref(true)
const url = ref('')

const musicLiked = (id: number) => store.state.likelist.includes(id)

const onPlayModeChange = () => {
  if (playMode.value >= 2) {
    playMode.value = 0
  } else {
    playMode.value++
  }
  loop.value = playMode.value == 0
}
const onMuted = () => {

}
const onMusicLike = () => {
  const _id = props.playlist[index.value]?.id

  if (liked.value) {
    store.commit('unlike', { id: _id })
  } else {
    store.commit('like', { id: _id })
  }
  liked.value = musicLiked(_id)
}

const onPaused = () => {
  paused.value = !paused.value
}
const onPrevious = () => {
  if (index.value <= 0) {
    index.value = props.playlist.length - 1
  } else {
    index.value--
  }
  if (playMode.value == 2) {
    if (index.value <= 0) {
      info('到顶了（〃｀ 3′〃）')
    } else {
      index.value--
    }
  } else {
  }
}
const onNext = () => {
  if (index.value >= props.playlist.length - 1) {
    index.value = 0
  } else {
    index.value++
  }
  if (playMode.value == 2) {
    if (index.value >= props.playlist.length - 1) {
      info('已经到最底下了（〃｀ 3′〃）')
    } else {
      index.value++
    }
  }
}

const { run, data, loading } = useRequest(getMusicUrl, {
  onSuccess() {
    url.value = data.value?.data.data[0].url
  }
})
onMounted(() => {
  // 这里就用笨办法了
  setTimeout(() => {
    const _id = props.playlist[index.value]?.id
    liked.value = musicLiked(_id)
    run(_id)
  }, 1000);
})
watch(
  index,
  () => {
    const _id = props.playlist[index.value]?.id
    liked.value = musicLiked(_id)
    run(_id)
  }
)

</script>

<template>
  <n-layout-footer bordered>
    <my-audio
      v-model:url="url"
      v-model:currentTime="progress"
      v-model:volume="volume"
      v-model:muted="muted"
      v-model:paused="paused"
      v-model:rate="rate"
      v-model:duration="duration"
      v-model:loop="loop"
      v-model:cacheTime="cacheTime"
    ></my-audio>
    <div class="container" justify="space-between" align="center">
      <div class="left">
        <n-thing>
          <template #avatar>
            <n-spin :show="loading">
              <n-avatar :size="80" :src="props.playlist[index]?.album.picUrl" />
            </n-spin>
          </template>
          <template #header>
            {{ props.playlist[index]?.name }}
            <span v-for="tns in props.playlist[index]?.tns">({{ tns }})</span>
          </template>
          <template #description>
            <span v-for="artist in props.playlist[index]?.artists">
              {{ artist.name }}
            </span>
          </template>
          <template #header-extra>
            <n-button circle quaternary @click="onMusicLike">
              <template #icon>
                <n-icon v-show="!liked" :component="Heart24Regular" />
                <n-icon v-show="liked" :component="Heart24Filled" />
              </template>
            </n-button>
          </template>
        </n-thing>
      </div>
      <div class="middle">
        <n-button size="large" circle quaternary @click="onPrevious">
          <n-icon size="25" :component="Previous24Filled" />
        </n-button>
        <n-button size="large" circle @click="onPaused" type="primary">
          <n-icon size="30" v-show="!paused" :component="Pause24Filled" />
          <n-icon size="30" v-show="paused" :component="Play24Filled" />
        </n-button>
        <n-button size="large" circle quaternary @click="onNext">
          <n-icon size="25" :component="Next24Filled" />
        </n-button>
      </div>
      <div class="right">
        <n-popover width="trigger" trigger="click" style="height: 200px; display: flex; justify-content: center;"
          content-style="height:100%; padding: 0;" @update:show="val => volumeBarShow = val">
          <template #trigger>
            <n-button size="large" circle quaternary @click="onMuted">
              <template #icon>
                <n-icon size="30" v-show="!volumeBarShow && volume == 0" :component="Speaker024Regular" />
                <n-icon size="30" v-show="!volumeBarShow && volume < 0.6 && volume > 0" :component="Speaker124Regular" />
                <n-icon size="30" v-show="!volumeBarShow && volume > 0.6" :component="Speaker224Regular" />
                <n-icon size="30" v-show="volumeBarShow && volume == 0" :component="Speaker024Filled" />
                <n-icon size="30" v-show="volumeBarShow && volume < 0.6 && volume > 0" :component="Speaker124Filled" />
                <n-icon size="30" v-show="volumeBarShow && volume > 0.6" :component="Speaker224Filled" />
              </template>
            </n-button>
          </template>
          <n-slider vertical v-model:value="volume" :max="1" :min="0" :step="0.01" :tooltip="false"
            :format-tooltip="num => `${Math.floor(num * 100)}%`"></n-slider>
        </n-popover>
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button size="large" circle quaternary @click="onPlayModeChange">
              <template #icon>
                <n-icon size="30" v-show="playMode == 0" :component="Replay20Filled" />
                <n-icon size="30" v-show="playMode == 1" :component="ArrowRepeatAll20Filled" />
                <n-icon size="30" v-show="playMode == 2" :component="ArrowRepeatAllOff20Filled" />
              </template>
            </n-button>
          </template>
          <span>
            {{ playModeTooltip[playMode] }}
          </span>
        </n-tooltip>

        <n-button size="large" circle quaternary @click="show = !show">
          <template #icon>
            <n-icon size="30" v-show="!show" :component="ReceiptPlay20Regular" />
            <n-icon size="30" v-show="show" :component="ReceiptPlay20Filled" />
          </template>
        </n-button>
      </div>
    </div>
    <playlistView v-model:index="index" v-model:show="show" :playlist="props.playlist"
      :playlist-title="props.playlistTitle" />
    <n-slider class="progressSlider" v-model:value="progress" :max="1" :min="0" :step="0.0001"></n-slider>
  </n-layout-footer>
</template>

<style lang="less" scoped>
@import url('@/styles/varible.less');

.progressSlider {
  position: absolute;
  top: -8px;
  z-index: 100;
}

.container {
  height: 100%;
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

  .left {}

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
</style>