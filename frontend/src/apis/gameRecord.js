import request from '@/util/http.js'

// 創建遊戲記錄
export function createGameRecordAPI(data) {
  return request({
    url: '/api/gameRecord/create',
    method: 'POST',
    data
  })
}

// 獲取用戶遊戲記錄
export function getUserRecordsAPI() {
  return request({
    url: '/api/gameRecord/history',
    method: 'GET'
  })
}

// 獲取特定遊戲記錄
export function getGameRecordAPI(id) {
  return request({
    url: `/api/gameRecord/record/${id}`,
    method: 'GET'
  })
}

// 更新遊戲記錄
export function updateGameRecordAPI(id, data) {
  return request({
    url: `/api/gameRecord/update/${id}`,
    method: 'PUT',
    data
  })
}

// 獲取排行榜
export function getLeaderboardAPI() {
  return request({
    url: '/api/gameRecord/leaderboard',
    method: 'GET'
  })
}

// 獲取用戶統計
export function getUserStatsAPI() {
  return request({
    url: '/api/gameRecord/stats',
    method: 'GET'
  })
}
