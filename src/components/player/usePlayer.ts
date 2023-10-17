import { inject } from 'vue'
import { playerApiInjectionKey } from './PlayerProvider.vue'

export function usePlayer() {
  const api = inject(playerApiInjectionKey)

  if (api === undefined) {
    throw new Error('usePlayer() is called without provider.')
  }

  return api
}