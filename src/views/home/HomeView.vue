<template>
  <div class="home">
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
  </div>
</template>
<style lang="less" scoped>
.n-carousel {
  margin-top: 20px;
  .n-carousel-item {
    width: 55%;
  }
}
.carousel-img {
  margin: 0 auto;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>

<script lang="ts" setup>
import {
  NCarousel,
  NCarouselItem,
  NSpin
} from 'naive-ui'
import { banner } from '@/requests/banner'
import { useRequest } from 'vue-request'
const { loading, data, run } = useRequest(banner, {
  onSuccess() {
    console.log(data.value?.data.banners)
  }
})

; (async () => {
  run()
  
}) ()

</script>
