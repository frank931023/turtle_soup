import { ref } from 'vue'
import { defineStore } from 'pinia'
import { logingAPI } from '@/apis/login.js'


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
  return {
    getUserInfo,
    userInfo,
    cleanUserInfo
  }
},
  {
    persist: true,
  })

