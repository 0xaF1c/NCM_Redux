<script lang="ts" setup>
import { reactive } from 'vue'
import axios from 'axios'
import store from '@/store'

const getQrCodeKey = async () => {
  return (await axios.get(`/api/login/qr/key?timerstamp=${Date.now()}`)).data.data.unikey
}

const getLoginStatus = async () => {
  return (await axios.post(`/api/login/status?timerstamp=${Date.now()}`, {
    cookie: store.getters.cloudMusicCookies
  })).data.data
}

const getQrCode = async (key: string) => {
  return (await axios.get(`/api/login/qr/create?key=${key}&qrimg=true&timerstamp=${Date.now()}`)).data
}

const pollingQrCheck = (key: string) => {
  // axiosPolling(axios, {
  //   retryLimit: 20
  // })
  // const { on, emit, off } = axios.poll({
  //   url: `/api/login/qr/check?key=${key}&timerstamp=${Date.now()}`
  // })

  // emit()
  // on('response', (response) => {
  //   if (response.data.code == 803 || response.data.code == 800) {
  //     off()
  //     state.QrCodeState = response.data
  //   }
  // })
  setInterval(async () => {
    const result = await axios.get(`/api/login/qr/check?key=${key}&timerstamp=${Date.now()}`)
    console.log(result);

  }, 1000)
}

const account = async () => {
  return await axios.get('/api/user/account')
}
const subcount = async () => {
  return await axios.get('/api/user/subcount')
}
const userPlaylist = async (uid: string) => {
  return await axios.get(`/api/user/playlist?uid=${uid}`)
}
const login = async () => {
  const loginStatus = await getLoginStatus()

  if (loginStatus.account != undefined) return loginStatus

  const unikey = await getQrCodeKey()

  const qrCode = await getQrCode(unikey)

  state.QrCodeUrl = qrCode.data.qrurl
  state.QrImg = qrCode.data.qrimg
  pollingQrCheck(unikey)
}
;; (async () => {
  const result = await login()
  console.log(result)
  console.log((await account()).data);
  console.log((await subcount()).data);
  console.log((await userPlaylist(result.account.id)).data);


})()
const state = reactive<any>({
  QrCodeState: '',
  QrCodeUrl: '',
  QrImg: '',
  avatar: ''
})

</script>


<template>
  <div class="hello">
    <img :src="state.QrImg" alt="">
    <img :src="state.QrCodeState.avatarUrl" alt="">
    <div>
      {{ state.QrCodeState }}
    </div>
    <a :href="state.QrCodeUrl">{{ state.QrCodeUrl }}</a>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}</style>
