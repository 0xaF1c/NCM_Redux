import { getLikeMusic } from '@/requests/getLikeMusic'
import { like } from '@/requests/likeMusic'
import { createStore } from 'vuex'

export default createStore({
  state: {
    userStatus: JSON.parse(localStorage.getItem('userStatus')!),
    likelist: JSON.parse(localStorage.getItem('likelist')!),
    playlist: JSON.parse(localStorage.getItem('playlist')!),
  },
  getters: {
    userStatus(state) { 
      return state.userStatus
    },
    likelist(state) {
      return state.likelist
    }
  },
  mutations: {
    updateUserStatus(state, payload) {
      localStorage.setItem('userStatus', JSON.stringify(payload))
    },
    updateLikelist(state, payload) {
      localStorage.setItem('likelist', JSON.stringify(payload))      
    },
    like(state, { id }) {
      like(id, true)
      state.likelist.push(id)
    },
    unlike(state, { id }) {
      like(id, false)
      state.likelist = state.likelist.filter((item: any) => item != id)
    },
    updatePlaylist(state, playlist) {
      localStorage.setItem('playlist', JSON.stringify(playlist))
    }
  },
  actions: {
    async updateLikelist({ commit }) {
      const id = this.state.userStatus.profile.userId
      const res = await getLikeMusic(id)
      
      await commit('updateLikelist', res.data.ids)
    }
  },
  modules: {
  }
})
