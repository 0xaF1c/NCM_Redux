import { createStore } from 'vuex'
import player from './modules/player'
import { getUserStatus } from '../requests/getUserStatus'
import { getLikeMusic } from '../requests/getLikeMusic'
import { like } from '../requests/likeMusic'

export default createStore<any>({
  state: {
    likelist: []
  },
  getters: {},
  mutations: {
    updateLikeList(state: any, likelist: any) {
      state.likelist = likelist
    },
    like(state: any, { id }: any) {
      like(id, true)
      state.likelist.push(id)
    },
    unlike(state: any, { id }: any) {
      like(id, false)
      state.likelist = state.likelist.filter((item: any) => item != id)
    },
  },
  actions: {
    async getLikelist({ commit }) {
      const profile = (await getUserStatus())?.data?.data?.profile
      const likelist = await getLikeMusic(profile.id)
      commit('updateLikeList', likelist.data.ids)
    }
  },
  modules: {
    player
  }
})