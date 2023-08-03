<!-- @TODO: 重构 -->
<!-- 好久以前写的了找个机会重构一下 -->
<template>
  <audio
    :src="url"
    ref="audio"
    @timeupdate="timeupdate"
    @volumechange="volumechange"
    @play="playOrPause"
    @pause="playOrPause"
    @durationchange="durationchange"
    autoplay="false"
    ></audio>
</template>

<script>
export default {
  props: [
    "url",
    "currentTime",
    "volume",
    "muted",
    "paused",
    "rate",
    "duration",
    "loop",
    "cacheTime"
  ],
  data() {
    return {
      audioProgress: 0,
      drag: true,
      init: false,
    };
  },
  methods: {
    // eventListener
    timeupdate(event) {
      this.drag = false;
      this.$emit(
        "update:currentTime",
        event.target.currentTime / event.target.duration
      );
      // 获取以缓存的时间
      try {
        let timeRanges = event.target.buffered
        let timeBuffered = timeRanges.end(timeRanges.length - 1);
        // 获取缓存进度，值为0到1
        let bufferPercent = timeBuffered / event.target.duration;
        this.$emit("update:cacheTime", bufferPercent);
      } catch (error) {
      }
    },
    volumechange(event) {
      this.$emit("update:volume", event.target.volume);
      this.$emit("update:muted", event.target.muted);
    },
    playOrPause(event) {
      this.$emit("update:paused", event.target.paused);
    },
    durationchange(event) {
      this.$emit("update:duration", event.target.duration);
    }
  },
  watch: {
    // props update
    currentTime(value) {
      if (this.drag) {
        this.audioProgress = value;
      } else if (!this.drag) {
        this.drag = true;
      }
    },
    volume(value) {
      this.$refs.audio.volume = value;
      if (value == 0) {
        this.$emit("update:muted", true);
      } else if (value > 0) {
        this.$emit("update:muted", false);
      }
    },
    muted(value) {
      this.$refs.audio.muted = value;
    },
    paused(value) {
      if (value) {
        this.$refs.audio.pause();
      } else {
        this.$refs.audio.play();
      }
    },
    rate(value) {
      this.$refs.audio.playbackRate = value;
    },
    loop(value) {
      this.$refs.audio.loop = value;
    },

    url() {
      this.$refs.audio.onloadedmetadata = () => {
        if (this.init) {
          this.$emit("update:paused", false);
          
          this.$refs.audio.play();
        }
      };
    },
    audioProgress() {
      this.$refs.audio.currentTime = this.$refs.audio.duration * this.audioProgress;
    },
  },
  mounted() {
    this.$refs.audio.addEventListener("load", () => {
      this.$refs.audio.volume = this.volume;
      this.$refs.audio.playbackRate = this.rate;
      this.$refs.audio.loop = this.loop;
      this.$refs.audio.muted = this.muted;
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.paused = this.paused;
      console.log(this.$refs.audio.paused);
    });


    setTimeout(() => {
      this.init = true;
    }, 500);
  },
};
</script>