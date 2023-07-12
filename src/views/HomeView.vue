<template>
  <div class="home">

    <loginView />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HelloWorld from '@/components/HelloWorld.vue' // @ is an alias to /src
import loginView from './loginView.vue'

export default defineComponent({
  name: 'HomeView',
  components: {
    HelloWorld,
    loginView
  },
})
</script>
