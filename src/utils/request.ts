import axios from 'axios'

axios.defaults.withCredentials = true
export const http = axios.create({
  baseURL: 'http://111.180.195.83:3000/', // 生产环境
  // baseURL: '/api', // 开发环境
  timeout: 60000,
  withCredentials: true,
})