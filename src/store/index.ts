import { createStore } from 'vuex'

export default createStore({
  state: {
    cloudMusicCookies: localStorage.getItem('CloudMusicCookies')
  },
  getters: {
    CloudMusicCookies(state) { 
      return state.cloudMusicCookies
    }
  },
  mutations: {
    saveCloudMusicCookies(cookies: any) {
      localStorage.setItem('CloudMusicCookies', cookies)
    }
  },
  actions: {
  },
  modules: {
  }
})
