<template>
  <div class="story-manage-container">
    <h1>故事管理</h1>

    <!-- 篩選器 -->
    <div class="filter-container">
      <div class="filter-group">
        <span class="filter-label">待審核狀態：</span>
        <select v-model="pendingFilter">
          <option value="all">全部</option>
          <option value="pending">待審核</option>
          <option value="approved">已審核</option>
        </select>
      </div>

      <div class="filter-group">
        <span class="filter-label">刪除狀態：</span>
        <select v-model="deletedFilter">
          <option value="all">全部</option>
          <option value="deleted">已刪除</option>
          <option value="active">未刪除</option>
        </select>
      </div>
    </div>

    <!-- 故事列表 -->
    <div class="story-list">
      <div v-if="loading" class="loading">載入中...</div>
      <div v-else-if="filteredStories.length === 0" class="no-stories">沒有符合條件的故事</div>
      <div v-else class="story-table">
        <table>
          <thead>
            <tr>
              <th>故事名稱</th>
              <th>狀態</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="story in paginatedStories"
              :key="story.id"
              :class="{ deleted: story.isDeleted, pending: story.isPending }"
            >
              <td>{{ story.questionName }}</td>
              <td>
                <span
                  class="status"
                  :class="{
                    'pending-status': story.isPending,
                    'deleted-status': story.isDeleted,
                  }"
                >
                  {{ getStatusText(story) }}
                </span>
              </td>
              <td class="actions">
                <button
                  v-if="story.isPending"
                  @click="approveStory(story.id)"
                  class="approve-btn"
                  :disabled="story.isDeleted"
                >
                  審核通過
                </button>
                <button v-if="!story.isDeleted" @click="deleteStory(story.id)" class="delete-btn">
                  刪除
                </button>
                <button v-if="story.isDeleted" @click="restoreStory(story.id)" class="restore-btn">
                  復原
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- 分頁導航 -->
        <div v-if="filteredStories.length > pagination.pageSize" class="pagination">
          <div class="pagination-info">
            <span
              >第 {{ pagination.currentPage }}/{{ totalPages }} 頁，共
              {{ filteredStories.length }} 個故事</span
            >
          </div>
          <div class="pagination-controls">
            <button
              class="pagination-btn"
              @click="goToFirstPage"
              :disabled="pagination.currentPage === 1"
              title="第一頁"
            >
              «
            </button>
            <button
              class="pagination-btn"
              @click="goToPrevPage"
              :disabled="pagination.currentPage === 1"
              title="上一頁"
            >
              ‹
            </button>

            <button
              v-for="page in pageNumbers"
              :key="page"
              @click="page !== '...' ? goToPage(page) : null"
              :class="[
                'pagination-btn',
                'page-num',
                pagination.currentPage === page ? 'active' : '',
                page === '...' ? 'dots' : '',
              ]"
              :disabled="page === '...'"
            >
              {{ page }}
            </button>

            <button
              class="pagination-btn"
              @click="goToNextPage"
              :disabled="pagination.currentPage === totalPages"
              title="下一頁"
            >
              ›
            </button>
            <button
              class="pagination-btn"
              @click="goToLastPage"
              :disabled="pagination.currentPage === totalPages"
              title="最後一頁"
            >
              »
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import {
  getAllStoriesAPI,
  getAllDeletedStoriesAPI,
  deleteStoryAPI,
  restoreStoryAPI,
  approveStoryAPI,
} from '@/apis/story'

// 狀態變數
const allStories = ref([])
const loading = ref(true)
const pendingFilter = ref('all')
const deletedFilter = ref('all')

// 分頁設置
const pagination = ref({
  currentPage: 1,
  pageSize: 10,
})

// 獲取所有故事
const fetchAllStories = async () => {
  loading.value = true
  try {
    // 獲取正常故事
    const activeResponse = await getAllStoriesAPI()
    const activeStories = activeResponse.data || []

    // 獲取已刪除故事
    const deletedResponse = await getAllDeletedStoriesAPI()
    const deletedStories = deletedResponse.data || []

    // 合併並標記故事狀態
    const stories = [
      ...activeStories.map((story) => ({ ...story, isDeleted: false })),
      ...deletedStories.map((story) => ({ ...story, isDeleted: true })),
    ]

    allStories.value = stories
    console.log('成功獲取所有故事:', stories)
  } catch (error) {
    console.error('獲取故事時發生錯誤:', error)
  } finally {
    loading.value = false
  }
}

// 根據篩選條件過濾故事
const filteredStories = computed(() => {
  return allStories.value.filter((story) => {
    // 篩選待審核狀態
    if (pendingFilter.value !== 'all') {
      const isPending = story.isPending || false
      if (pendingFilter.value === 'pending' && !isPending) return false
      if (pendingFilter.value === 'approved' && isPending) return false
    }

    // 篩選刪除狀態
    if (deletedFilter.value !== 'all') {
      const isDeleted = story.isDeleted || false
      if (deletedFilter.value === 'deleted' && !isDeleted) return false
      if (deletedFilter.value === 'active' && isDeleted) return false
    }

    return true
  })
})

// 計算總頁數
const totalPages = computed(() => {
  return Math.ceil(filteredStories.value.length / pagination.value.pageSize)
})

// 獲取分頁後的故事
const paginatedStories = computed(() => {
  const start = (pagination.value.currentPage - 1) * pagination.value.pageSize
  const end = start + pagination.value.pageSize
  return filteredStories.value.slice(start, end)
})

// 生成頁碼陣列
const pageNumbers = computed(() => {
  const totalPageCount = totalPages.value
  const current = pagination.value.currentPage
  const pageNums = []

  // 總是顯示第一頁
  if (current > 3) {
    pageNums.push(1)
  }

  // 添加省略號
  if (current > 4) {
    pageNums.push('...')
  }

  // 當前頁附近的頁碼
  const startPage = Math.max(current - 1, 1)
  const endPage = Math.min(current + 1, totalPageCount)

  for (let i = startPage; i <= endPage; i++) {
    pageNums.push(i)
  }

  // 添加省略號
  if (current < totalPageCount - 3) {
    pageNums.push('...')
  }

  // 總是顯示最後一頁
  if (current < totalPageCount - 2 && totalPageCount > 1) {
    pageNums.push(totalPageCount)
  }

  return pageNums
})

// 獲取故事狀態文字
const getStatusText = (story) => {
  let statusText = []
  if (story.isPending) statusText.push('待審核')
  else statusText.push('已審核')

  if (story.isDeleted) statusText.push('已刪除')

  return statusText.join(' / ')
}

// 分頁導航方法
const goToFirstPage = () => {
  pagination.value.currentPage = 1
}

const goToPrevPage = () => {
  if (pagination.value.currentPage > 1) {
    pagination.value.currentPage--
  }
}

const goToNextPage = () => {
  if (pagination.value.currentPage < totalPages.value) {
    pagination.value.currentPage++
  }
}

const goToLastPage = () => {
  pagination.value.currentPage = totalPages.value
}

const goToPage = (page) => {
  pagination.value.currentPage = page
}

// 當篩選條件變化時，重置為第一頁
const resetPagination = () => {
  pagination.value.currentPage = 1
}

// 監聽篩選條件變化
watch([pendingFilter, deletedFilter], () => {
  resetPagination()
})

// 審核通過故事
const approveStory = async (storyId) => {
  try {
    await approveStoryAPI(storyId)
    await fetchAllStories() // 重新獲取故事列表
    alert('審核成功！')
  } catch (error) {
    console.error('審核故事時發生錯誤:', error)
    alert('審核失敗，請稍後再試。')
  }
}

// 刪除故事
const deleteStory = async (storyId) => {
  if (confirm('確定要刪除這個故事嗎？')) {
    try {
      await deleteStoryAPI(storyId)
      await fetchAllStories() // 重新獲取故事列表
      alert('刪除成功！')
    } catch (error) {
      console.error('刪除故事時發生錯誤:', error)
      alert('刪除失敗，請稍後再試。')
    }
  }
}

// 復原故事
const restoreStory = async (storyId) => {
  try {
    await restoreStoryAPI(storyId)
    await fetchAllStories() // 重新獲取故事列表
    alert('復原成功！')
  } catch (error) {
    console.error('復原故事時發生錯誤:', error)
    alert('復原失敗，請稍後再試。')
  }
}

// 初始加載
onMounted(() => {
  fetchAllStories()
})
</script>

<style scoped>
.story-manage-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.filter-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
}

.filter-group {
  display: flex;
  align-items: center;
}

.filter-label {
  margin-right: 10px;
  font-weight: bold;
}

select {
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background: white;
}

.story-list {
  margin-top: 20px;
}

.loading,
.no-stories {
  text-align: center;
  padding: 40px 0;
  font-style: italic;
  color: #666;
}

table {
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

th,
td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #4c6eb1;
  color: white;
}

tr:hover {
  background-color: #f8f9fa;
}

tr.deleted {
  background-color: #fff5f5;
}

tr.pending {
  background-color: #fff8e1;
}

tr.deleted.pending {
  background: repeating-linear-gradient(45deg, #fff5f5, #fff5f5 10px, #fff8e1 10px, #fff8e1 20px);
}

.status {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.pending-status {
  background-color: #fff8e1;
  color: #ff9800;
  border: 1px solid #ffecc7;
}

.deleted-status {
  background-color: #ffebee;
  color: #f44336;
  border: 1px solid #ffcdd2;
}

.actions {
  display: flex;
  gap: 8px;
}

button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.approve-btn {
  background-color: #4caf50;
  color: white;
}

.approve-btn:hover {
  background-color: #388e3c;
}

.approve-btn:disabled {
  background-color: #a5d6a7;
  cursor: not-allowed;
}

.delete-btn {
  background-color: #f44336;
  color: white;
}

.delete-btn:hover {
  background-color: #d32f2f;
}

.restore-btn {
  background-color: #2196f3;
  color: white;
}

.restore-btn:hover {
  background-color: #1976d2;
}

/* 分頁樣式 */
.pagination {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  width: 100%;
}

.pagination-info {
  margin-bottom: 15px;
  color: #666;
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 5px;
}

.pagination-btn {
  min-width: 36px;
  height: 36px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: white;
  color: #4c6eb1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.3s;
}

.pagination-btn:hover:not(:disabled) {
  background: #eef1f8;
  border-color: #4c6eb1;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn.active {
  background: #4c6eb1;
  color: white;
  border-color: #4c6eb1;
}

.page-num {
  font-weight: 500;
}

.dots {
  background: transparent;
  border-color: transparent;
}
</style>
