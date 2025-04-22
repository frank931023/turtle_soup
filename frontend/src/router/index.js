import { createRouter, createWebHistory } from 'vue-router'

// 匯入頁面元件
import Home from '../views/HomePage.vue'
import About from '../views/AboutPage.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
