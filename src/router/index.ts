import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/home/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
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
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
