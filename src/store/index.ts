import { getLikeMusic } from '@/requests/getLikeMusic'
import { like } from '@/requests/likeMusic'
import { createStore } from 'vuex'

export default createStore<any>({
  state: {
    userStatus: JSON.parse(localStorage.getItem('userStatus')!),
    likelist: JSON.parse(localStorage.getItem('likelist')!),
    playlist: JSON.parse(localStorage.getItem('playlist')!),
    playlistId: null,
    index: null,
  },
  getters: {
    userStatus(state) { 
      return state.userStatus
    },
    likelist(state) {
      return state.likelist
    },
    playlist(state) {
      return state.playlist
    },
    index(state) {
      return state.index
    },
    playlistId(state) {
      return state.playlistId
    }
  },
  mutations: {
    updateUserStatus(state, payload) {
      localStorage.setItem('userStatus', JSON.stringify(payload))
      state.userStatus = JSON.parse(localStorage.getItem('userStatus')!)
    },
    updateLikelist(state, payload) {
      localStorage.setItem('likelist', JSON.stringify(payload))
      state.likelist = JSON.parse(localStorage.getItem('likelist')!)
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
      state.playlist = JSON.parse(localStorage.getItem('playlist')!)
    },
    updateIndex(state, index) {
      state.index = index
    },
    updatePlaylistId(state, id) {
      state.playlistId = id
    }
  },
  actions: {
    async updateLikelist({ commit }) {
      const id = this.state.userStatus?.profile.userId
      const res = await getLikeMusic(id)
      
      await commit('updateLikelist', res.data.ids)
    }
  },
  modules: {
  }
})
