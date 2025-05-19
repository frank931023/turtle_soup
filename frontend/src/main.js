import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createPinia } from 'pinia'
import { createVuestic } from 'vuestic-ui'
import 'vuestic-ui/css'

const app = createApp(App)

app.use(createVuestic()) // 啟用 Vuestic
app.use(router)

// 使用pinia
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)


app.mount('#app')
