import { createRouter, createWebHistory } from 'vue-router'

// 匯入頁面元件
import Home from '../views/HomePage.vue'
import About from '../views/AboutPage.vue'
import Login from '../views/login/index.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
