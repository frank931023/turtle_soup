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
    url: '/api/questionbank?limit=1000',
    method: 'GET',
  })
}

// get all deleted stories
export function getAllDeletedStoriesAPI() {
  return request({
    url: 'api/questionbank?deleted=true&limit=1000',
    method: 'GET',
  })
}

// get all passed stories (not pending)
export function getAllPassedStoriesAPI() {
  return request({
    url: 'api/questionbank?pending=false&limit=1000',
    method: 'GET',
  })
}

// approve story
export function approveStoryAPI(id) {
  return request({
    url: `/api/questionbank/${id}/approve`,
    method: 'POST',
  })
}

// delete story
export function deleteStoryAPI(id) {
  return request({
    url: `/api/questionbank/${id}`,
    method: 'DELETE',
  })
}

// restore story
export function restoreStoryAPI(id) {
  return request({
    url: `/api/questionbank/${id}/restore`,
    method: 'POST',
  })
}
