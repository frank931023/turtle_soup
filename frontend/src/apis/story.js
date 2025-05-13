// 處理故事相關的 API 請求
import request from '@/util/http.js'

// 創建新故事
export function createStoryAPI(storyData) {
  return request({
    url: '/api/questionbank/create',
    method: 'POST',
    data: storyData,
  })
}

// 獲取故事詳情
export function getStoryByIdAPI(id) {
  return request({
    url: `/api/questionbank/${id}`,
    method: 'GET',
  })
}

// 更新故事
export function updateStoryAPI(id, storyData) {
  return request({
    url: `/api/questionbank/${id}`,
    method: 'PUT',
    data: storyData,
  })
}

// 獲取所有故事
export function getAllStoriesAPI() {
  return request({
    url: '/api/questionbank',
    method: 'GET',
  })
}

// 獲取所有 pending stories
// export function getAllPendingStoriesAPI() {
//   return request({
//     url: '/api/questionbank?isPending=true',
//     method: 'GET',
//   })
// }
