import request from '@/util/http.js'

// 檢查後端是否連線成功
export function checkBackendConnectionAPI() {
  return request({
    url: '/api/hello',
    method: 'GET',
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  });
}

// 啟動新遊戲：取得新謎題
export function startGameAPI() {
  return request({
    url: '/api/agent/host',
    method: 'POST',
    data: { isNewGame: true }
  });
}

// 使用者提問
export function userAskAPI(input) {
  return request({
    url: '/api/agent/host',
    method: 'POST',
    data: { input, isNewGame: false }
  });
}

// AI 玩家提問
export function aiAskAPI(context) {
  return request({
    url: '/api/agent/ai-player',
    method: 'POST',
    data: { context }
  });
}
