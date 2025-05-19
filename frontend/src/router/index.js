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
import Account from '@/views/account/index.vue'
import AdminUser from '@/views/admin/users/index.vue'
import AccountProfileSetting from '@/views/account/components/AccountProfileSetting.vue'
import GameRecordsView from '@/views/history/GameRecordsView.vue'
import LeaderboardView from '@/views/history/LeaderboardView.vue'
import UserStatsView from '@/views/history/UserStatsView.vue'
import GameRecordDetailView from '@/views/history/GameRecordDetailView.vue'
import Landing from '../views/landing/index.vue'
import AccountPorfile from '@/views/account/components/AccountPorfile.vue'
import AccountPasswordReset from '@/views/account/components/AccountPasswordReset.vue'
import { useUserStore } from '@/stores/user.js'

import StoryManage from '../views/StoryManage.vue'
import StoryEditor from '../views/StoryEditor.vue'


import history from '@/views/history/HomeView.vue'

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
    ],
  },


  {
    path: '/admin/questions',
    name: 'StoryManage',
    component: StoryManage,
  },
  {
    path: '/admin/story-edit/:id',
    name: 'StoryEditor',
    component: StoryEditor,
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
    meta: {
      requiresAuth: false,      // 不需要登录
      requiresAdmin: false      // 不需要管理员权限
    }
  },

  {
    path: '/landing',
    name: 'landing',
    component: Landing,
    meta: {
      requiresAuth: false,
      requiresAdmin: false
    }
  },
  {
    path: '/oauth',
    name: 'oauth',
    component: Oauth,
    meta: {
      requiresAuth: false,
      requiresAdmin: false
    }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: {
      requiresAuth: false,      // 需要登录
      requiresAdmin: false      // 不需要管理员权限
    }
  },
  {
    path: '/admin/users',
    component: AdminUser,
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/account',
    component: Account,
    children: [
      {
        path: 'profile-settings',
        component: AccountProfileSetting
      },
      {
        path: '',
        component: AccountPorfile,
      },
      {
        path: 'change-password',
        component: AccountPasswordReset
      }
    ],
    meta: {
      requiresAuth: true,      // 需要登录
      requiresAdmin: false      // 不需要管理员权限
    }
  },


  {
    path: '/history',
    component: history,
    meta: {
      requiresAuth: true,      // 需要登录
    }  },

  {
    path: '/records',
    name: 'game-records',
    component: GameRecordsView,
    meta: {
      requiresAuth: true,      // 需要登录
    }  },
  {
    path: '/leaderboard',
    name: 'leaderboard',
    component: LeaderboardView,
    meta: {
      requiresAuth: true,      // 需要登录
    }
  },
  {
    path: '/stats',
    name: 'user-stats',
    component: UserStatsView,
    meta: {
      requiresAuth: true,      // 需要登录
    }  },
  {
    path: '/records/:id',
    name: 'game-record-detail',
    component: GameRecordDetailView,
    meta: {
      requiresAuth: true,      // 需要登录
    }  },




]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})



// 全局导航守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  // 如果页面需要认证
  if (to.meta.requiresAuth) {
    // 检查是否已登录
    if (!userStore.userInfo?.token) {
      // 未登录，重定向到登录页
      next({
        path: '/login',
        query: { redirect: to.fullPath } // 保存原目标路径
      })
      return
    }

    // 如果页面需要管理员权限
    if (to.meta.requiresAdmin && userStore.userInfo.user.role !== 'admin') {
      // 不是管理员，重定向到首页
      next('/')
      return
    }
  }

  // 如果已登录且要访问登录页，重定向到首页
  if (to.path === '/login' && userStore.userInfo?.token) {
    next('/')
    return
  }

  // 其他情况正常通过
  next()
})

export default router
