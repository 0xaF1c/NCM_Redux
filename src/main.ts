import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { setGlobalOptions } from 'vue-request'
import { setup } from './utils/setup'
import '@/styles/global.css'

setGlobalOptions({
  manual: true
})
setup()

createApp(App)
  .use(store)
  .use(router)
  .mount('#app')
