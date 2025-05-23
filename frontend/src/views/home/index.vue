<template>
  <div
    class="turtle-soup-app"
    @click="handleOutsideClick"
    :style="{ backgroundImage: `url(${backgroundImageUrl})` }"
  >
    <!-- 引入故事模式選擇器組件 -->
    <story-mode-selector
      ref="storySelectorModal"
      :storyId="selectedStoryId"
      @start-game="handleStartGame"
    />

    <main class="main-content">
      <!-- 加載提示 -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p class="loading-text">正在加載故事...</p>
      </div>

      <!-- 無數據提示 -->
      <div v-else-if="puzzles.length === 0" class="no-data">
        <p>目前沒有可用的故事</p>
        <button @click="fetchStories" class="retry-button">重試</button>
      </div>

      <template v-else>
        <!-- 過濾器區域 -->
        <div class="filter-container">
          <!-- 新增搜索欄 -->
          <div class="filter-section search-section">
            <h3>搜尋故事</h3>
            <div class="search-container" ref="searchContainer">
              <div class="search-input-wrapper">
                <input
                  type="text"
                  v-model="filters.searchText"
                  placeholder="搜尋故事名稱或描述..."
                  class="search-input"
                  @focus="showSearchHistory = true"
                  @input="handleSearchInput"
                  @blur="handleSearchBlur"
                  @keyup.enter="applySearch"
                />
                <button class="search-button" @click="applySearch">搜尋</button>
                <button class="clear-search" @click="clearSearch" v-if="filters.searchText">
                  ×
                </button>
              </div>
              <!-- 搜尋歷史 -->
              <div
                class="search-history"
                v-if="
                  showSearchHistory && searchHistory.length > 0 && filters.searchText.trim() === ''
                "
              >
                <div
                  v-for="(item, index) in searchHistory"
                  :key="index"
                  class="history-item"
                  @click="selectSearchHistory(item)"
                  @mousedown="preventBlur"
                >
                  <span>{{ item }}</span>
                  <button class="delete-history" @click.stop="removeSearchHistoryItem(index)">
                    ×
                  </button>
                </div>
                <div class="history-footer">
                  <button
                    class="clear-history"
                    @click.stop="clearSearchHistory"
                    @mousedown="preventBlur"
                  >
                    清除所有歷史
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="filter-section">
            <h3>難度選擇</h3>
            <div class="difficulty-options">
              <button
                @click="setDifficultyFilter(1)"
                :class="['difficulty-btn', filters.difficulty === 1 ? 'active' : '']"
              >
                簡單
              </button>
              <button
                @click="setDifficultyFilter(2)"
                :class="['difficulty-btn', filters.difficulty === 2 ? 'active' : '']"
              >
                普通
              </button>
              <button
                @click="setDifficultyFilter(3)"
                :class="['difficulty-btn', filters.difficulty === 3 ? 'active' : '']"
              >
                困難
              </button>
              <button
                @click="setDifficultyFilter(null)"
                :class="['difficulty-btn clear-btn', !filters.difficulty ? 'active' : '']"
              >
                全部
              </button>
            </div>
          </div>
          <div class="filter-section">
            <h3>故事分類</h3>
            <div class="category-options">
              <label
                v-for="category in categoryOptions"
                :key="category.value"
                :class="[
                  'category-tag',
                  filters.categories.includes(category.value) ? 'active' : '',
                ]"
              >
                <input
                  type="checkbox"
                  :value="category.value"
                  v-model="filters.categories"
                  @change="applyFilters"
                />
                <span>{{ category.label }}</span>
                <!-- 添加 span 包裹文字 -->
              </label>
              <button class="clear-filters" @click="clearCategoryFilters">清除分類</button>
            </div>
          </div>
        </div>

        <!-- 過濾後無數據提示 -->
        <div v-if="filteredPuzzles.length === 0" class="no-data">
          <p>沒有符合過濾條件的故事</p>
          <button @click="clearAllFilters" class="retry-button">清除所有過濾</button>
        </div>

        <!-- 故事列表 -->
        <div v-else class="puzzle-options">
          <div
            class="puzzle-option-container"
            v-for="(puzzle, index) in paginatedPuzzles"
            :key="puzzle.id || index"
            :style="getStoryColorStyles(index)"
            @mouseenter="hoveredPuzzle = puzzle.name"
            @mouseleave="hoveredPuzzle = null"
          >
            <button
              class="puzzle-option"
              @click="navigateToPuzzle(puzzle.name)"
              :class="{ active: hoveredPuzzle === puzzle.name }"
            >
              {{ puzzle.name }}
            </button>

            <transition name="slide-fade">
              <div class="puzzle-description" v-if="hoveredPuzzle === puzzle.name">
                <div class="description-content">
                  {{ puzzle.description }}
                </div>
              </div>
            </transition>
          </div>

          <!-- 分頁導航 -->
          <div v-if="filteredPuzzles.length > pagination.pageSize" class="pagination">
            <div class="pagination-info">
              <span
                >第 {{ pagination.currentPage }}/{{ totalPages }} 頁，共
                {{ filteredPuzzles.length }} 個故事</span
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
      </template>
    </main>
  </div>
</template>

<script>
import { getAllStoriesAPI, getAllPassedStoriesAPI } from '@/apis/story.js'
import { ElMessage } from 'element-plus'
import StoryModeSelector from '@/views/layout/components/StoryModeSelector.vue'
import backgroundImage from '@/assets/home.jpg' // 引入圖片
import { ref } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'HomePage',
  components: {
    StoryModeSelector,
  },
  setup() {
    const route = useRoute()
    const storyId = ref(route.params.id)
    return {
      storyId,
    }
  },
  data() {
    return {
      backgroundImageUrl: backgroundImage,
      selectedStoryId: null, // 當前選中的故事ID
      hoveredPuzzle: null,
      puzzles: [],
      filteredPuzzles: [],
      loading: false,
      // 過濾器狀態
      filters: {
        categories: [],
        difficulty: null,
        searchText: '', // 搜尋文本
      },
      // 搜尋相關
      showSearchHistory: false, // 控制是否顯示搜尋歷史
      searchHistory: [], // 儲存搜尋歷史
      // 分頁相關
      pagination: {
        currentPage: 1, // 當前頁碼
        pageSize: 10, // 每頁顯示數量
      },
      // 可用的分類選項
      categoryOptions: [
        { label: '死亡', value: '死亡' },
        { label: '誤會', value: '誤會' },
        { label: '失憶', value: '失憶' },
        { label: '巧合', value: '巧合' },
        { label: '身份', value: '身份' },
        { label: '時間', value: '時間' },
        { label: '報復', value: '報復' },
        { label: '心理', value: '心理' },
        { label: '語言', value: '語言' },
        { label: '奇幻', value: '奇幻' },
      ],
      // 顏色配置
      colors: [
        {
          bg: 'rgba(76, 175, 80, 0.1)',
          border: '#4caf50',
          text: '#4caf50',
        },
        {
          bg: 'rgba(255, 87, 34, 0.1)',
          border: '#ff5722',
          text: '#ff5722',
        },
        {
          bg: 'rgba(33, 150, 243, 0.1)',
          border: '#2196f3',
          text: '#2196f3',
        },
        {
          bg: 'rgba(156, 39, 176, 0.1)',
          border: '#9c27b0',
          text: '#9c27b0',
        },
        {
          bg: 'rgba(255, 193, 7, 0.1)',
          border: '#ffc107',
          text: '#ffc107',
        },
      ],
      preventHistoryClose: false,
    }
  },
  computed: {
    // 計算總頁數
    totalPages() {
      return Math.ceil(this.filteredPuzzles.length / this.pagination.pageSize)
    },

    // 計算當前頁的故事數據
    paginatedPuzzles() {
      const start = (this.pagination.currentPage - 1) * this.pagination.pageSize
      const end = start + this.pagination.pageSize
      return this.filteredPuzzles.slice(start, end)
    },

    // 計算頁碼導航
    pageNumbers() {
      const totalPages = this.totalPages
      const currentPage = this.pagination.currentPage

      // 簡單情況：總頁數少於等於7頁
      if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1)
      }

      // 複雜情況：總頁數大於7頁，顯示當前頁周圍的頁碼和首尾頁碼
      const pages = []

      // 始終添加第一頁
      pages.push(1)

      // 當前頁靠前時
      if (currentPage < 4) {
        pages.push(2, 3, 4, 5, '...', totalPages)
      }
      // 當前頁靠後時
      else if (currentPage > totalPages - 3) {
        pages.push(
          '...',
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        )
      }
      // 當前頁在中間時
      else {
        pages.push('...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
      }

      return pages
    },
  },
  methods: {
    navigateToPuzzle(puzzleName) {
      console.log(`選擇了謎題: ${puzzleName}`)

      // 找到對應的故事對象
      const selectedPuzzle = this.puzzles.find((puzzle) => puzzle.name === puzzleName)

      if (selectedPuzzle && selectedPuzzle.id) {
        // 設置當前選中的故事ID
        this.selectedStoryId = selectedPuzzle.id
        console.log('設置選中的故事ID:', this.selectedStoryId)

        // 打開故事模式選擇器模態框，直接傳遞故事ID
        this.$refs.storySelectorModal.openModal(selectedPuzzle.id)
      } else {
        ElMessage.warning('無法找到該故事的詳細信息')
      }
    },

    // 處理故事模式選擇後的遊戲啟動
    handleStartGame(gameParams) {
      console.log('開始遊戲，參數為:', gameParams)

      // 這裡可以執行跳轉到遊戲頁面的邏輯
      this.$router.push({
        name: 'Game',
        query: {
          storyId: this.selectedStoryId,
          npcCount: gameParams.npcCount,
          playAlone: gameParams.playAlone,
          questionCount: gameParams.questionCount,
        },
      })
    },

    handleSearchBlur() {
      // Using setTimeout to allow click events to happen before hiding the dropdown
      setTimeout(() => {
        if (!this.preventHistoryClose) {
          this.showSearchHistory = false
        }
        this.preventHistoryClose = false
      }, 100)
    },

    handleOutsideClick(event) {
      // Check if the click is outside the search container
      if (this.$refs.searchContainer && !this.$refs.searchContainer.contains(event.target)) {
        this.showSearchHistory = false
      } else if (this.showSearchHistory) {
        // If clicking inside while history is showing, prevent history close
        this.preventHistoryClose = true
      }
    },

    // 新增防止失去焦點事件處理器
    preventBlur(event) {
      event.preventDefault()
    },

    // 處理搜尋輸入
    handleSearchInput() {
      // 當有輸入文字時，不顯示搜尋歷史
      if (this.filters.searchText.trim() !== '') {
        this.showSearchHistory = false
      } else {
        // 沒有輸入文字時顯示搜尋歷史
        this.showSearchHistory = true
      }
    },

    // 清除當前搜索
    clearSearch() {
      this.filters.searchText = ''
      // Keep the search history visible when clearing
      this.preventHistoryClose = true
      this.showSearchHistory = true
      this.applyFilters()
    },

    // 從歷史記錄中選擇搜索詞
    selectSearchHistory(item) {
      this.filters.searchText = item
      // Hide search history after selecting an item
      this.showSearchHistory = false
      this.applySearch()
    },

    // 從後端獲取故事數據
    async fetchStories() {
      this.loading = true
      try {
        // const response = await getAllStoriesAPI()
        const response = await getAllPassedStoriesAPI()
        if (response && response.success && response.data) {
          // 將後端數據映射到前端需要的格式
          this.puzzles = response.data.map((story) => {
            return {
              id: story.id,
              name: story.questionName,
              description: story.description,
              level: story.level,
              category: Array.isArray(story.category) ? story.category : [],
            }
          })
          // 應用過濾器
          this.applyFilters()
        } else {
          ElMessage.warning('獲取故事數據失敗')
        }
      } catch (error) {
        console.error('獲取故事數據錯誤:', error)
        ElMessage.error('無法連接到伺服器，請稍後再試')
      } finally {
        this.loading = false
      }
    },

    // 應用過濾器
    applyFilters() {
      let result = [...this.puzzles]

      // 應用難度過濾
      if (this.filters.difficulty) {
        result = result.filter((puzzle) => puzzle.level === this.filters.difficulty)
      }

      // 應用類別過濾
      if (this.filters.categories.length > 0) {
        result = result.filter((puzzle) => {
          // 檢查故事的類別是否包含任何所選類別
          return this.filters.categories.some(
            (cat) => puzzle.category && puzzle.category.includes(cat)
          )
        })
      }

      // 應用搜尋過濾
      if (this.filters.searchText.trim()) {
        const searchTerm = this.filters.searchText.trim().toLowerCase()
        result = result.filter(
          (puzzle) =>
            (puzzle.name && puzzle.name.toLowerCase().includes(searchTerm)) ||
            (puzzle.description && puzzle.description.toLowerCase().includes(searchTerm))
        )
      }

      this.filteredPuzzles = result

      // 重置頁碼到第一頁
      this.pagination.currentPage = 1
    },

    // 設置難度過濾器
    setDifficultyFilter(level) {
      this.filters.difficulty = level
      this.applyFilters()
    },

    // 清除分類過濾器
    clearCategoryFilters() {
      this.filters.categories = []
      this.applyFilters()
    },

    // 清除所有過濾器
    clearAllFilters() {
      this.filters.difficulty = null
      this.filters.categories = []
      this.filters.searchText = ''
      this.applyFilters()
    },

    // 搜尋相關方法
    applySearch() {
      if (this.filters.searchText.trim()) {
        // 將新的搜索詞添加到歷史記錄的前面
        const trimmedSearch = this.filters.searchText.trim()
        // 從歷史中移除相同項目（如果存在）
        this.searchHistory = this.searchHistory.filter((item) => item !== trimmedSearch)
        // 添加到前面
        this.searchHistory.unshift(trimmedSearch)
        // 只保留最近5個
        if (this.searchHistory.length > 5) {
          this.searchHistory = this.searchHistory.slice(0, 5)
        }
        // 保存到本地存儲
        this.saveSearchHistory()
        // 應用過濾器
        this.applyFilters()
      }
    },

    // 從本地存儲加載搜索歷史
    loadSearchHistory() {
      const savedHistory = localStorage.getItem('turtleSoupSearchHistory')
      if (savedHistory) {
        try {
          this.searchHistory = JSON.parse(savedHistory)
        } catch (e) {
          console.error('加載搜索歷史出錯:', e)
          this.searchHistory = []
        }
      }
    },

    // 保存搜索歷史到本地存儲
    saveSearchHistory() {
      localStorage.setItem('turtleSoupSearchHistory', JSON.stringify(this.searchHistory))
    },

    // 移除單個搜索歷史項
    removeSearchHistoryItem(index) {
      this.searchHistory.splice(index, 1)
      this.saveSearchHistory()
    },

    // 清除所有搜索歷史
    clearSearchHistory() {
      this.searchHistory = []
      this.saveSearchHistory()
    },

    // 分頁相關方法
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.pagination.currentPage = page
        // 回到頂部，提供更好的用戶體驗
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },

    goToFirstPage() {
      this.goToPage(1)
    },

    goToLastPage() {
      this.goToPage(this.totalPages)
    },

    goToPrevPage() {
      this.goToPage(this.pagination.currentPage - 1)
    },

    goToNextPage() {
      this.goToPage(this.pagination.currentPage + 1)
    },

    // 獲取故事顏色樣式
    getStoryColorStyles(index) {
      // 使用循環方式分配顏色，確保每個故事都有顏色
      const colorIndex = index % this.colors.length
      const color = this.colors[colorIndex]

      return {
        '--story-bg-color': color.bg,
        '--story-border-color': color.border,
        '--story-text-color': color.text,
      }
    },
  },
  // 在組件掛載時獲取數據
  mounted() {
    this.fetchStories()
    this.loadSearchHistory()
  },

  // 監聽過濾器變化
  watch: {
    'filters.categories': {
      handler() {
        this.applyFilters()
      },
      deep: true,
    },
    'filters.searchText': {
      handler(val) {
        // 當輸入框內容變化時，實時過濾
        if (val === '' || val.length >= 2) {
          // 為了性能，至少輸入2個字符才開始過濾
          this.applyFilters()
        }
      },
    },
  },
}
</script>

<style scoped>
/* 保留原有樣式 */
@import url('https://fonts.googleapis.com/css2?family=Special+Elite&display=swap'); /* 英文打字機字體 */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC&display=swap'); /* 中文字體 */

.turtle-soup-app {
  font-family: 'Special Elite', 'Noto Sans TC', monospace;
  /*max-width: 80%;
  margin: 0 auto;*/
  min-height: 100vh;
  position: relative;
  z-index: 0;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-repeat: no-repeat;
  background: transparent;
  width: 100%;
}

.turtle-soup-app::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}

.header {
  /* 保持原有樣式 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border-bottom: 1px solid #e0e0e0;
  position: relative; /* 添加相對定位 */
  z-index: 10; /* 確保在背景圖片和其他內容上方 */
  background-color: white; /* 添加白色背景 */
}

.logo-container {
  display: flex;
  align-items: center;
}

.soup-bowl {
  position: relative;
  margin-right: 8px;
}

.steam {
  position: absolute;
  top: -12px;
  left: 5px;
  color: #666;
  font-size: 14px;
}

.bowl-img {
  width: 32px;
  height: 32px;
}

.app-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.subtitle {
  font-size: 14px;
  font-weight: normal;
  color: #666;
}

.sound-icon img {
  width: 24px;
  height: 24px;
}

.main-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background-color: rgb(31, 31, 31); /* 維持半透明黑色背景 */
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
}

.puzzle-introduction {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.turtle-img {
  display: block;
  width: 200px;
  height: auto;
  margin: 0 auto 20px;
}

.intro-text,
.rules-text {
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 15px;
  color: #333;
  text-align: center;
  padding: 0 20px;
}

.warning {
  justify-content: center;
  background-color: white;
  margin-top: 20px;
  color: #ff3b30;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.warning-icon {
  margin-right: 5px;
}

.puzzle-options {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 500px;
  align-self: center;
}

/* 修改為包含按鈕和描述的容器 */
.puzzle-option-container {
  position: relative;
  margin-bottom: 25px;
  width: 100%;
  transition: transform 0.3s ease;
}

.puzzle-option-container:hover {
  transform: scale(1); /* 移除縮放效果，改為不縮放 */
}

/* 修改按鈕樣式：默認白色背景 */
.puzzle-option {
  background-color: white; /* 改為白底 */
  border: none;
  border-radius: 10px; /* 四個角都是圓角 */
  padding: 16px 25px;
  text-align: center;
  font-size: 17px;
  font-weight: 600;
  color: var(--story-text-color, #4caf50); /* 保留彩色文字 */
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  letter-spacing: 0.5px;
  margin-bottom: 0;
  border-left: 4px solid var(--story-border-color, #4caf50); /* 保留彩色邊框 */
}

.puzzle-option.expanded {
  transform: translateX(5px);
}

.puzzle-option:hover::before {
  right: 15px;
  opacity: 1;
}

.puzzle-option.active {
  border-radius: 10px 10px 0 0; /* 只保留上方圓角 */
  border-bottom: none;
}

/* 重新設計描述框，確保無縫連接 */
.puzzle-description {
  position: relative;
  width: 100%;
  background-color: white; /* 白色背景 */
  border-radius: 0 0 10px 10px; /* 只保留下方圓角 */
  padding: 15px 25px 18px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  z-index: 4;
  transform-origin: top center;
  margin-top: 0;
  border-top: none;
  border-left: 4px solid var(--story-border-color, #4caf50);
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

/* 修改展開動畫以避免視覺上的突變 */
@keyframes smoothExpand {
  0% {
    opacity: 0;
    transform: scaleY(0);
    max-height: 0;
  }
  100% {
    opacity: 1;
    transform: scaleY(1);
    max-height: 300px;
  }
}

/* 確保描述內容的視覺連續性 */
.description-content {
  font-size: 14px;
  line-height: 1.6;
  padding-top: 8px;
  position: relative;
  color: var(--story-text-color, #4caf50); /* 使用變數設置文字顏色 */
}

.puzzle-option-container {
  position: relative;
  margin-bottom: 25px;
  width: 100%;
  transition: transform 0.2s ease; /* 減少過渡時間 */
}

/* 按鈕展開效果 */
.puzzle-option.active,
.puzzle-option.expanded {
  border-radius: 10px 10px 0 0; /* 只保留上方圓角 */
  border-bottom: 1px solid rgba(0, 0, 0, 0.1); /* 當展開時添加底部邊框 */
}

/* 添加新的描述框樣式 */
.puzzle-description {
  position: relative;
  width: 100%;
  background-color: white;
  border-radius: 0 0 10px 10px; /* 只保留下方圓角 */
  padding: 15px 25px 18px; /* 增加頂部間距 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  z-index: 4; /* 確保在按鈕下方 */
  transform-origin: top center;
  border-top: none; /* 移除頂部邊框 */
  margin-top: 0; /* 消除頂部間距 */
  border-left: 4px solid var(--story-border-color, #4caf50); /* 保持左側邊框與按鈕一致 */
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

/* 使用CSS變數動態設置描述框顏色 */
.puzzle-option-container .puzzle-description {
  background-color: white; /* 覆蓋變數，強制使用白色背景 */
  border-left: 4px solid var(--story-border-color, #4caf50);
  border-right: 1px solid var(--story-border-color, rgba(76, 175, 80, 0.2));
  border-bottom: 1px solid var(--story-border-color, rgba(76, 175, 80, 0.2));
}

.description-content {
  font-size: 14px;
  line-height: 1.6;
  padding-top: 8px;
  position: relative;
}

/* 使用CSS變數動態設置描述文字顏色 */
.puzzle-option-container .description-content {
  color: var(--story-text-color, #4caf50);
}

.slide-fade-enter-active {
  animation: smoothExpand 0.3s ease-out;
}

.slide-fade-leave-active {
  animation: smoothExpand 0.2s ease-in reverse;
}

@keyframes smoothExpand {
  0% {
    opacity: 0;
    transform: scaleY(0);
    max-height: 0;
  }
  100% {
    opacity: 1;
    transform: scaleY(1);
    max-height: 300px;
  }
}

/* 過濾器樣式 */
.filter-container {
  width: 100%;
  max-width: 800px;
  margin-bottom: 30px;
  padding: 20px 5px;
  background-color: transparent;
  border-radius: 0;
  align-self: center;
}

.filter-section {
  margin-bottom: 35px;
}

.filter-section h3 {
  font-size: 22px;
  margin-bottom: 15px;
  color: #f5f5f5;
  font-weight: 600;
  letter-spacing: 1px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  padding-bottom: 8px;
  position: relative;
}

.filter-section h3::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 80px; /* 不要橫跨整個區域，只顯示部分底線 */
  height: 3px; /* 底線厚度 */
  background: linear-gradient(to right, #4caf50, transparent);
  border-radius: 2px;
}

.search-section h3::after {
  background: linear-gradient(to right, #4caf50, transparent); /* 搜尋故事: 綠色 */
}

/* 難度選擇部分的底線 */
.filter-section:nth-of-type(2) h3::after {
  background: linear-gradient(to right, #d68433, transparent); /* 難度選擇: 橙色 */
}

/* 故事分類部分的底線 */
.filter-section:nth-of-type(3) h3::after {
  background: linear-gradient(to right, #2196f3, transparent); /* 故事分類: 藍色 */
}

.difficulty-options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.difficulty-options button:nth-child(1):hover {
  background-color: #ff9800; /* 橘色背景 */
  color: white;
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(255, 152, 0, 0.4);
}

/* 普通按鈕懸停效果 - 藍色 */
.difficulty-options button:nth-child(2):hover {
  background-color: #2196f3; /* 藍色背景 */
  color: white;
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(33, 150, 243, 0.4);
}
.difficulty-options button:nth-child(3):hover {
  background-color: #f44336; /* 紅色背景 */
  color: white;
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(244, 67, 54, 0.4);
}

/* 全部按鈕懸停效果保持原樣 */
.difficulty-options button:nth-child(4):hover {
  background-color: #4caf50; /* 改為綠色背景 */
  color: white;
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(76, 175, 80, 0.4); /* 綠色陰影 */
}

.difficulty-btn {
  padding: 10px 18px;
  border-radius: 25px;
  border: 1px solid #555;
  background-color: #333;
  cursor: pointer;
  font-size: 14px;
  color: #ddd;
  transition: all 0.3s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.difficulty-btn:hover {
  background-color: #444;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.difficulty-options button:nth-child(1).active {
  background-color: #ff9800; /* 橘色背景 */
  color: white;
  border-color: transparent;
  box-shadow: 0 0 10px rgba(255, 152, 0, 0.5);
}

/* 普通按鈕選中效果 - 藍色 */
.difficulty-options button:nth-child(2).active {
  background-color: #2196f3; /* 藍色背景 */
  color: white;
  border-color: transparent;
  box-shadow: 0 0 10px rgba(33, 150, 243, 0.5);
}

/* 困難按鈕選中效果 - 紅色 */
.difficulty-options button:nth-child(3).active {
  background-color: #f44336; /* 紅色背景 */
  color: white;
  border-color: transparent;
  box-shadow: 0 0 10px rgba(244, 67, 54, 0.5);
}

.difficulty-options button:nth-child(4).active {
  background-color: #4caf50; /* 保持綠色 */
  color: white;
  border-color: transparent;
  box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
}

/* 覆蓋原有的統一選中樣式 */
.difficulty-btn.active {
  color: white;
  border-color: transparent;
}

.category-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-tag {
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  padding: 8px 15px;
  background-color: #333;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s;
  color: #ddd;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  text-align: center; /* 確保文字本身居中 */
  min-width: 60px; /* 設置最小寬度使每個標籤大小更一致 */
  min-height: 36px; /* 設置固定高度確保垂直居中效果一致 */
  line-height: 36px; /* 設置行高等於高度，確保單行文字垂直居中 */
  padding: 0 15px; /* 調整左右內邊距，移除上下內邊距 */
}

.category-tag span {
  display: inline-block;
  line-height: normal; /* 重置行高，避免內部文字受行高影響 */
  vertical-align: middle; /* 垂直居中文字 */
  width: 100%; /* 讓span元素占滿父元素寬度 */
}

.category-tag:hover {
  background-color: #2196f3; /* 改為藍色背景 */
  color: white; /* 文字改為白色，提高對比度 */
  transform: translateY(-2px); /* 保留向上移動效果 */
  box-shadow: 0 4px 8px rgba(33, 150, 243, 0.4); /* 變更為藍色陰影 */
}

/* 活動狀态的分類標籤懸停效果 - 保持藍色但加深 */
.category-tag.active:hover {
  background-color: #1976d2; /* 使用更深的藍色 */
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(25, 118, 210, 0.6);
}

.category-tag input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.category-tag.active {
  background-color: #2196f3;
  color: white;
  box-shadow: 0 0 10px rgba(33, 150, 243, 0.5);
}

.clear-filters {
  padding: 8px 15px;
  background-color: rgba(255, 87, 34, 0.8);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.clear-filters:hover {
  background-color: #ff5722;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
}

/* 搜索欄樣式 */
.search-section {
  margin-bottom: 25px;
}

.search-container {
  position: relative;
  width: 100%;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.search-input {
  flex: 1;
  padding: 12px 18px;
  border: 1px solid #555;
  border-radius: 30px;
  font-size: 14px;
  background-color: #333;
  color: #eee;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;
}

.search-input::placeholder {
  color: #999;
}

.search-input:focus {
  outline: none;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.2), 0 0 0 2px rgba(76, 175, 80, 0.3);
  border-color: #4caf50;
}

.search-button {
  padding: 12px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
}

.search-button:hover {
  background-color: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
}

.clear-search {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 87, 34, 0.8);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.clear-search:hover {
  background-color: #ff5722;
  transform: rotate(90deg);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.search-history {
  position: absolute;
  top: 100%;
  left: 0;
  width: calc(100% - 80px); /* 調整寬度以匹配輸入框寬度，扣除按鈕寬度和間距 */
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px; /* 使用與輸入框相似的圓角 */
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
  padding: 10px;
  margin-top: 5px; /* 添加一點頂部間距 */
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.history-item:hover {
  background-color: #f0f0f0;
}

.delete-history {
  padding: 5px;
  background-color: #ff5722;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.delete-history:hover {
  background-color: #e64a19;
}

.history-footer {
  margin-top: 10px;
  text-align: right;
}

.clear-history {
  padding: 5px 10px;
  background-color: #ff5722;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.clear-history:hover {
  background-color: #e64a19;
}

/* 加載動畫 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #4caf50;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

.loading-text {
  font-size: 16px;
  color: #555;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 無數據提示 */
.no-data {
  text-align: center;
  padding: 40px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.retry-button {
  margin-top: 15px;
  padding: 8px 16px;
  background-color: #4caf50;
}

/* 分頁導航樣式 */
.pagination {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  padding: 15px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.pagination-info {
  margin-bottom: 15px;
  color: #555;
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  gap: 5px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
}

.pagination-btn {
  min-width: 35px;
  height: 35px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  color: #333;
  font-size: 14px;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #f0f0f0;
}

.pagination-btn.active {
  background-color: #4caf50;
  color: white;
  border-color: #4caf50;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn.dots {
  cursor: default;
}

.pagination-btn.page-num {
  font-weight: 600;
}
</style>
