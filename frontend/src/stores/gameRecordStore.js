import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useUserStore } from './user' // 注意這裡是 './user'，不是 './userStore'

// API 基礎配置
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000
})

// 請求攔截器，添加授權頭
api.interceptors.request.use(config => {
  const userStore = useUserStore()
  // 檢查各種可能的 token 位置
  const token = userStore.userInfo?.token ||
    userStore.userInfo?.accessToken ||
    userStore.userInfo?.access_token

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const useGameRecordStore = defineStore('gameRecord', () => {
  // 狀態
  const userRecords = ref([])
  const currentRecord = ref(null)
  const leaderboard = ref([])
  const userStats = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // 計算屬性
  const sortedRecords = computed(() => {
    return [...userRecords.value].sort((a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt)
    )
  })

  const completedGamesCount = computed(() => {
    return userRecords.value.filter(record => record.isCompleted).length
  })

  const totalScore = computed(() => {
    return userRecords.value.reduce((sum, record) => sum + record.score, 0)
  })

  // 動作
  const createGameRecord = async (recordData) => {
    loading.value = true
    error.value = null

    try {
      // 確保我們有用戶 ID
      const userStore = useUserStore()
      // 檢查 userInfo 中可能的 userId 位置
      const userId = userStore.userInfo?.id ||
        userStore.userInfo?.userId ||
        userStore.userInfo?._id

      if (!userId) {
        throw new Error('未找到用戶ID，請確保已登入')
      }

      // 添加用戶 ID 到記錄數據中
      const dataWithUserId = {
        ...recordData,
        userId: userId
      }

      const response = await api.post('/gameRecord/create', dataWithUserId)
      userRecords.value.push(response.data.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || '創建遊戲記錄失敗'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchUserRecords = async () => {
    loading.value = true
    error.value = null

    try {
      // 修正 API 端點，應該是 '/gameRecord/history' 而不是 '/gameRecord/record'
      const response = await api.get('/gameRecord/history')
      userRecords.value = response.data.data
      return userRecords.value
    } catch (err) {
      error.value = err.response?.data?.error || '獲取遊戲記錄失敗'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchGameRecord = async (id) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get(`/gameRecord/record/${id}`)
      currentRecord.value = response.data.data
      return currentRecord.value
    } catch (err) {
      error.value = err.response?.data?.error || '獲取遊戲記錄失敗'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateGameRecord = async (id, data) => {
    loading.value = true
    error.value = null

    try {
      // 修正 API 端點，應該是 '/gameRecord/update/${id}'
      const response = await api.put(`/gameRecord/update/${id}`, data)

      // 更新記錄在陣列中
      const index = userRecords.value.findIndex(record => record.id === id)
      if (index !== -1) {
        userRecords.value[index] = response.data.data
      }

      currentRecord.value = response.data.data
      return currentRecord.value
    } catch (err) {
      error.value = err.response?.data?.error || '更新遊戲記錄失敗'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchLeaderboard = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/gameRecord/leaderboard')
      leaderboard.value = response.data.data
      return leaderboard.value
    } catch (err) {
      error.value = err.response?.data?.error || '獲取排行榜失敗'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchUserStats = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await api.get('/gameRecord/stats')
      userStats.value = response.data.data
      return userStats.value
    } catch (err) {
      error.value = err.response?.data?.error || '獲取用戶統計失敗'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 清除數據
  const clearGameRecordData = () => {
    userRecords.value = []
    currentRecord.value = null
    leaderboard.value = []
    userStats.value = null
    error.value = null
  }

  return {
    // 狀態
    userRecords,
    currentRecord,
    leaderboard,
    userStats,
    loading,
    error,

    // 計算屬性
    sortedRecords,
    completedGamesCount,
    totalScore,

    // 動作
    createGameRecord,
    fetchUserRecords,
    fetchGameRecord,
    updateGameRecord,
    fetchLeaderboard,
    fetchUserStats,
    clearGameRecordData
  }
}, {
  persist: true
})
