<script lang="ts">
import { ref } from 'vue';

export default {
  method: {

  },
  data() {
    return {

    }
  },
  setup() {
    const aaa = ref('123')

    return {
      aaa
    }
  }
}
</script>


<template>
  <h1>{{ aaa }}</h1>
</template>