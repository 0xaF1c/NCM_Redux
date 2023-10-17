import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
const player = () => import('../views/player/playerView.vue')
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    components: {
      default: () => import('../views/home/HomeView.vue'),
      player
    }
  },
  {
    path: '/history',
    name: 'history',
    components: {
      default: () => import('../views/history/history.vue'),
      player
    }
  },
  {
    path: '/personalFm',
    name: 'personalFm',
    components: {
      default: () => import('../views/discover/personalFmView.vue'),
      player
    }
  },
  {
    path: '/playlistDetail',
    name: 'playlistDetail',
    components: {
      default: () => import('../views/playlistDetail/playlistDetailView.vue'),
      player
    }
  },
  {
    path: '/recommendSongs',
    name: 'recommendSongs',
    components: {
      default: () => import('../views/recommend/recommendSongView.vue') ,
      player
    }
  },
  {
    path: '/recommendPlaylist',
    name: 'recommendPlaylist',
    components: {
      default: () => import('../views/recommend/recommendPlaylistView.vue'),
      player
    }
  },
  {
    path: '/artistDetail',
    name: 'artistDetail',
    components: {
      default: () => import('../views/artistDetail/artistDetail.vue'),
      player
    }
  },
  {
    path: '/albumDetail',
    name: 'albumDetail',
    components: {
      default: () => import('../views/albumDetail/albumDetail.vue'),
      player
    }
  },
  {
    path: '/searchDetail',
    name: 'searchDetail',
    components: {
      default: () => import('../views/searchDetail/searchDetail.vue'),
      player
    }
  },
  {
    path: '/player',
    name: 'player',
    components: {
      default: () => import('../views/player/playerView.vue'),
    },
    meta: {
      keepAlive: true,
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
