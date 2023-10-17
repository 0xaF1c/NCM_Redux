import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { setGlobalOptions } from 'vue-request'
import router from './router'
import store from './store'
import './styles/global.css'

setGlobalOptions({
  manual: true
})


createApp(App)
  .use(store)
  .use(router)
  .mount('#app')
