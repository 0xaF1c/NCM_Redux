import { Playlist, Song } from "../../types"

export const playingPlaylistStoreKey = 'playingPlaylistStoreKey'
export const playingPlaylistIndexStoreKey = 'playingPlaylistIndexStoreKey'
export const playingPlaylistProgressStoreKey = 'playingPlaylistProgressStoreKey'

const state = () => ({
  playlist: [],
  index: 0,
  progress: 0,
})

const getters = {
  getPlaylist: () => {    
    const playlist = JSON.parse(localStorage.getItem(playingPlaylistStoreKey)! ?? '[]')
    if (playlist.length > 0) {
      return playlist
    } else {
      return []
    }
  },
  getIndex: () => Number(localStorage.getItem(playingPlaylistIndexStoreKey)),
  getCurrentSong: (state: any, getters: any): Song | null => {
    if (getters.getPlaylist.length < 0) {
      return null
    }
    
    return getters.getPlaylist[state.index]
  },
  getProgress: () => Number(localStorage.getItem(playingPlaylistProgressStoreKey)),
}

const actions = {}

const mutations = {
  setPlaylist(state: any, playlist: Playlist) {    
    localStorage.setItem(playingPlaylistStoreKey, JSON.stringify(playlist))
    state.playlist = playlist
  },
  setIndex(state: any, index: number) {
    localStorage.setItem(playingPlaylistIndexStoreKey, index.toString())
    state.index = index
  },
  setProgress(state: any, progress: number) {
    localStorage.setItem(playingPlaylistProgressStoreKey, progress.toString())
    state.progress = progress
  },
  next(state: any) {
    const index = (getters.getIndex()+1)
    state.index = index
    localStorage.setItem(playingPlaylistIndexStoreKey, index.toString())
    
    if (getters.getIndex() > getters.getPlaylist().length - 1){
      localStorage.setItem(playingPlaylistIndexStoreKey, '0')
      state.index = 0
    }
  },
  previous(state: any) {
    const index = (getters.getIndex()-1)
    state.index = index
    localStorage.setItem(playingPlaylistIndexStoreKey, index.toString())
    
    if (getters.getIndex() < 0){
      localStorage.setItem(playingPlaylistIndexStoreKey, (getters.getPlaylist().length-1).toString())
      state.index = getters.getPlaylist().length - 1
    }
  },
  init(state: any) {
    state.index = getters.getIndex()
    state.playlist = getters.getPlaylist()
    state.progress = getters.getProgress()
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}