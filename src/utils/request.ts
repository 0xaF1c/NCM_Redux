import axios from 'axios'

axios.defaults.withCredentials = true
export const http = axios.create({
  baseURL: 'https://netease-cloud-music-redux-api.vercel.app/', // 生产环境
  // baseURL: '/api', // 开发环境
  timeout: 60000,
  withCredentials: true,
})
