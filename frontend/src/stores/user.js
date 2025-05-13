import { ref } from 'vue'
import { defineStore } from 'pinia'
import { googleLoginAPI, logingAPI,  } from '@/apis/login.js'
import { registerUserAPI } from '@/apis/register.js'

// 前端獲得第三方驗證的token後，將token傳給後端的API

// 使用user pinia
export const useUserStore = defineStore('user', () => {
  // 儲存user的資料
  const userInfo = ref({})

  // 獲得登入後，使用者的資料
  const getUserInfo = async ({username, password}) => {
    const res = await logingAPI({username, password})
    userInfo.value = res.result
  }

  const cleanUserInfo = async () => {
    userInfo.value = {}
  }

  // google登入函數
  const getGoogleUserInfo = async ({ id_token }) => {
    const res = await googleLoginAPI({ id_token })
    userInfo.value = res.result
  }

  // github登入函數
  const getGithubUserInfo =  ( result ) => {
    userInfo.value = result
  }

  // 註冊函數
  const getRegisterUser = async ({username, password}) => {
    const res = await registerUserAPI({username, password})
    userInfo.value = res.result
  }

  return {
    getUserInfo,
    userInfo,
    cleanUserInfo,
    getGoogleUserInfo,
    getGithubUserInfo,
    getRegisterUser
  }
},
  {
    persist: true,
  })

