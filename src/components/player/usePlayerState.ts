import { inject } from 'vue'
import { playerStateInjectionkey } from './PlayerProvider.vue'

export function usePlayerState() {
  const state = inject(playerStateInjectionkey)

  if (state === undefined) {
    throw new Error('usePlayerState() is called without provider.')
  }

  return state
}