<script lang="ts">
import { defineComponent, InjectionKey, provide, ref, Ref } from 'vue'
import loginModal from './loginModal.vue'
export const loginApiInjectionKey: InjectionKey<loginApiInjection> = 'loginApiKey' as any

export interface loginApiInjection {
  showLoginModal: () => void
  hideLoginModal: () => void
  readonly show: Ref<boolean>
}

export default defineComponent({
  components: {
    loginModal
  },
  setup() {
    const show = ref(false)
    const api: loginApiInjection = {
      showLoginModal: () => {
        show.value = true
      },
      hideLoginModal: () => {
        show.value = false
      },
      show
    }
    provide(loginApiInjectionKey, api)

    return {
      show,
      api
    }
  }
})

</script>


<template>
  <login-modal v-model:show="show"></login-modal>
  <slot></slot>
</template>