import { createRouter, createWebHistory } from 'vue-router'

// 匯入頁面元件
import Login from '../views/login/index.vue'
import Layout from '../views/layout/index.vue'
import About from '../views/about/index.vue'
import Home from '../views/table/HomePage.vue'

const routes = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    children: []
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
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
