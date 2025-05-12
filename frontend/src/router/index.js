import { createRouter, createWebHistory } from 'vue-router'

// 匯入頁面元件
import Login from '@/views/login/index.vue'
import Layout from '@/views/layout/index.vue'
import About from '@/views/about/index.vue'
import Game from '@/views/game/index.vue'
import Home from '@/views/home/index.vue'
import Chatgame from '@/views/chatGame/index.vue'
import Oauth from '@/views/login/oauth/index.vue'
import Register from '@/views/register/index.vue'


const routes = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Home',
        component: Home
      }
    ]
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
    path: '/game',
    name: 'Game',
    component: Game
  },

  {
    path: '/chatgame',
    name: 'chatgame',
    component: Chatgame
  },
  {
    path: '/oauth',
    name: 'oauth',
    component: Oauth
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
