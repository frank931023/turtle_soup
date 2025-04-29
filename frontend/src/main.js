import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createPinia } from 'pinia'

const app = createApp(App)
app.use(router)

// 使用pinia
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)


app.mount('#app')
