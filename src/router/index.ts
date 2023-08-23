import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/home/HomeView.vue')
  },
  {
    path: '/history',
    name: 'history',
    component: () => import('../views/history/history.vue')
  },
  {
    path: '/personalFm',
    name: 'personalFm',
    component: () => import('../views/discover/personalFmView.vue')
  },
  {
    path: '/playlistDetail',
    name: 'playlistDetail',
    component: () => import('../views/playlistDetail/playlistDetailView.vue'),
  },
  {
    path: '/recommendSongs',
    name: 'recommendSongs',
    component: () => import('../views/recommend/recommendSongView.vue') 
  },
  {
    path: '/recommendPlaylist',
    name: 'recommendPlaylist',
    component: () => import('../views/recommend/recommendPlaylistView.vue')
  },
  {
    path: '/artistDetail',
    name: 'artistDetail',
    component: () => import('../views/artistDetail/artistDetail.vue')
  },
  {
    path: '/albumDetail',
    name: 'albumDetail',
    component: () => import('../views/albumDetail/albumDetail.vue')
  },
  {
    path: '/searchDetail',
    name: 'searchDetail',
    component: () => import('../views/searchDetail/searchDetail.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
