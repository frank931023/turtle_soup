import { createRouter, createWebHistory } from 'vue-router'

// 匯入頁面元件
import Login from '@/views/login/index.vue'
import Layout from '@/views/layout/index.vue'
import About from '@/views/about/index.vue'
import Game from '@/views/game/index.vue'
import Home from '@/views/home/index.vue'
import Oauth from '@/views/login/oauth/index.vue'
import Register from '@/views/register/index.vue'
import AddNewStory from '@/views/AddNewStory.vue'
import Landing from '../views/landing/index.vue'

const routes = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Home',
        component: Home,
      },
      {
        path: 'add-story',
        name: 'AddNewStory',
        component: AddNewStory,
      },
      {
        path: '/game',
        name: 'Game',
        component: Game,
      },
      {
        path: 'story-manage',
        name: 'StoryManage',
        component: StoryManage,
      },
      {
        path: 'story-edit/:id',
        name: 'StoryEditor',
        component: StoryEditor,
      },
    ],
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/game',
    name: 'Game',
    component: Game,
  },

  {
    path: '/landing',
    name: 'landing',
    component: Landing,
  },
  {
    path: '/oauth',
    name: 'oauth',
    component: Oauth,
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
