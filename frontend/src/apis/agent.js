import request from '@/util/http.js'

// 關主回答問題
export function hostAnswerAPI(data) {
  return request({
    url: '/api/agent/host',
    method: 'POST',
    data,
  })
}

// AI 玩家提問
export function aiPlayerQuestionAPI(data) {
  return request({
    url: '/api/agent/ai-player',
    method: 'POST',
    data,
  })
}

// NPC 提問
export function npcQuestionAPI(data) {
  return request({
    url: '/api/agent/npc-question',
    method: 'POST',
    data,
    timeout: 30000, // 設定超時時間為10秒
  })
}
