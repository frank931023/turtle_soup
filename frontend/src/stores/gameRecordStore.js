import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from './user'

// 導入 API 函數
import {
  createGameRecordAPI,
  getUserRecordsAPI,
  getGameRecordAPI,
  updateGameRecordAPI,
  getLeaderboardAPI,
  getUserStatsAPI
} from '@/apis/gameRecord'

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

      const res = await createGameRecordAPI(dataWithUserId)
      userRecords.value.push(res.data)
      return res
    } catch (err) {
      error.value = err.message || '創建遊戲記錄失敗'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchUserRecords = async () => {
    loading.value = true
    error.value = null

    try {
      const res = await getUserRecordsAPI()
      userRecords.value = res.data
      return userRecords.value
    } catch (err) {
      error.value = err.message || '獲取遊戲記錄失敗'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchGameRecord = async (id) => {
    loading.value = true
    error.value = null

    try {
      const res = await getGameRecordAPI(id)
      currentRecord.value = res.data
      return currentRecord.value
    } catch (err) {
      error.value = err.message || '獲取遊戲記錄失敗'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateGameRecord = async (id, data) => {
    loading.value = true
    error.value = null

    try {
      const res = await updateGameRecordAPI(id, data)

      // 更新記錄在陣列中
      const index = userRecords.value.findIndex(record => record.id === id)
      if (index !== -1) {
        userRecords.value[index] = res.data
      }

      currentRecord.value = res.data
      return currentRecord.value
    } catch (err) {
      error.value = err.message || '更新遊戲記錄失敗'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchLeaderboard = async () => {
    loading.value = true
    error.value = null

    try {
      const res = await getLeaderboardAPI()
      leaderboard.value = res.data
      return leaderboard.value
    } catch (err) {
      error.value = err.message || '獲取排行榜失敗'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchUserStats = async () => {
    loading.value = true
    error.value = null

    try {
      const res = await getUserStatsAPI()
      userStats.value = res.data
      return userStats.value
    } catch (err) {
      error.value = err.message || '獲取用戶統計失敗'
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
