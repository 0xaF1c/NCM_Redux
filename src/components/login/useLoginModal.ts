import { inject } from 'vue'
import { loginApiInjectionKey } from './loginProvider.vue'

export function useLoginModal() {
  const api = inject(loginApiInjectionKey)

  if (api === undefined) {
    throw new Error('useLoginModal() is called without provider.')
  }

  return api
}