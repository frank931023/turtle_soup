import request from '@/util/http.js'

// 關主回答問題
export function hostAnswerAPI(data) {
  console.log('發送請求:', data);
  return request({
    url: '/api/agent/host',  // 確保這個路徑與後端一致
    method: 'POST',
    data,
    timeout: 30000  // 增加超時時間到30秒
  })
}

// AI 玩家提問
export function aiPlayerQuestionAPI(data) {
  return request({
    url: '/api/agent/ai-player',  // 確保這個路徑與後端一致
    method: 'POST',
    data,
    timeout: 30000  // 增加超時時間到30秒
  })
}

// NPC 提問
export function npcQuestionAPI(data) {
  return request({
    url: '/api/agent/npc-question',  // 確保這個路徑與後端一致
    method: 'POST',
    data,
    timeout: 30000  // 增加超時時間到30秒
  })
}
