<template>
  
  <n-scrollbar>
    <div class="home">
      <n-space vertical>
        <n-spin :show="loading">
          <n-carousel
            effect="card"
            prev-slide-style="transform: translateX(-150%) translateZ(-800px);"
            next-slide-style="transform: translateX(50%) translateZ(-800px);"
            style="height: 240px"
            :show-dots="true"
            draggable
          >
            <n-carousel-item class="n-carousel-item" v-for="item in data?.data.banners">
              <img
                class="carousel-img"
                :src="item.imageUrl"
              >
            </n-carousel-item>
          </n-carousel>
        </n-spin>
        <n-space justify="space-between" item-style="width: 49%;">
          <n-card hoverable class="recommend">
            <n-thing>
              <template #avatar>
                <n-avatar :size="150" :src="recommendSongsRef?.dailySongs[0].al.picUrl"></n-avatar>
              </template>
              <template #header>
                <n-text style="font-size: 2.5rem;">
                  每日推荐
                </n-text>
              </template>
              <template #description>
                <n-text style="font-size: 1.2rem;">
                  猜你喜欢:
                  {{ recommendSongsRef?.dailySongs[0].name }}
                </n-text>
              </template>
            </n-thing>
          </n-card>
          <n-card hoverable class="recommend">
            <n-thing>
              <template #avatar>
                <n-avatar :size="150" :src="recommendResourceRef?.recommend[0].picUrl"></n-avatar>
              </template>
              <template #header>
                <n-ellipsis style="font-size: 2.5rem;">
                  {{ recommendResourceRef?.recommend[0].name }}
                </n-ellipsis>
              </template>
              <template #description>
                <n-ellipsis style="font-size: 1.2rem;">
                  {{ recommendResourceRef?.recommend[1].name }}
                </n-ellipsis>
              </template>
            </n-thing>
          </n-card>
        </n-space>
        <n-divider title-placement="left">推荐歌单</n-divider>
        <playlistViewer :playlist-set="personalizedRef?.result" />
      </n-space>
    </div>
  </n-scrollbar>
</template>
<style lang="less" scoped>
.home {
  padding: 10px 100px;
}
.n-carousel {
  .n-carousel-item {
    width: 60%;
  }
}
.carousel-img {
  margin: 0 auto;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.recommend {
  cursor: pointer;
}
</style>

<script lang="ts" setup>
import {
  NCarousel,
  NCarouselItem,
  NSpin,
  NCard,
  NThing,
  NAvatar,
  NSpace,
  NText,
  NDivider,
  NScrollbar,
  NEllipsis
} from 'naive-ui'
import playlistViewer from '@/components/playlistViewer/playlistViewer.vue'
import { banner } from '@/requests/banner'
import { recommendSongs } from '@/requests/recommendSongs'
import { recommendResource } from '@/requests/recommendResource'
import { personalized } from '@/requests/personalized'
import { useRequest } from 'vue-request'
import { ref } from 'vue'
const { loading, data, run } = useRequest(banner)


const recommendSongsRef = ref()
const recommendResourceRef = ref()
const personalizedRef = ref()

; (async () => {
  run()
  const recommendSongsRes = await recommendSongs()
  const recommendResourceRes = await recommendResource()
  const personalizedRes = await personalized()

  recommendSongsRef.value = recommendSongsRes.data?.data
  recommendResourceRef.value = recommendResourceRes?.data
  personalizedRef.value = personalizedRes?.data
}) ()

</script>
