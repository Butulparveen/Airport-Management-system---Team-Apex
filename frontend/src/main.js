import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// main.js
import { createVuestic } from 'vuestic-ui'
import 'vuestic-ui/css'

createApp(App).use(store).use(router).use(createVuestic()).mount('#app')
