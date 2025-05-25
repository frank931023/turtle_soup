<template>
  <div class="info-panel">
    <h3 class="info-title">已獲得的線索</h3>

    <!-- 添加過濾器 -->
    <div class="filter-tabs">
      <button
        :class="['filter-tab', activeFilter === 'all' ? 'active' : '']"
        @click="activeFilter = 'all'"
      >
        全部
      </button>
      <button
        :class="['filter-tab', activeFilter === '是' ? 'active' : '']"
        @click="activeFilter = '是'"
      >
        是
      </button>
      <button
        :class="['filter-tab', activeFilter === '不是' ? 'active' : '']"
        @click="activeFilter = '不是'"
      >
        不是
      </button>
      <button
        :class="['filter-tab', activeFilter === '不相關' ? 'active' : '']"
        @click="activeFilter = '不相關'"
      >
        不相關
      </button>
    </div>

    <div class="clues-container" ref="cluesContainerRef">
      <div v-if="filteredClues.length === 0" class="no-clues">
        {{
          activeFilter === 'all'
            ? '尚未獲得任何線索，試著提出問題吧！'
            : `沒有回答為「${activeFilter}」的線索`
        }}
      </div>
      <div v-else class="clue-list">
        <div v-for="(clue, index) in filteredClues" :key="index" class="clue-item">
          <div class="clue-question">Q: {{ clue.question }}</div>
          <div class="clue-answer" :class="clue.answer">A: {{ clue.answer }}</div>
        </div>
      </div>
    </div>
    <div class="info-footer">
      <button @click="handleResetGame" class="reset-btn">重新開始</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'

const props = defineProps({
  clues: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['reset-game'])

const cluesContainerRef = ref(null)
const activeFilter = ref('all')

// 計算過濾後的線索
const filteredClues = computed(() => {
  if (activeFilter.value === 'all') {
    return props.clues
  } else {
    return props.clues.filter((clue) => clue.answer === activeFilter.value)
  }
})

// 新增右側線索滾動到底部的函數
const scrollCluesListToBottom = async () => {
  await nextTick()
  // 增加延遲，確保 DOM 完全更新
  setTimeout(() => {
    if (cluesContainerRef.value) {
      // 檢查並輸出目前的滾動高度
      console.log('滾動高度:', cluesContainerRef.value.scrollHeight)
      // 強制滾動到底部
      cluesContainerRef.value.scrollTop = cluesContainerRef.value.scrollHeight + 1000

      // 雙重保險：再次滾動確保到達底部
      setTimeout(() => {
        cluesContainerRef.value.scrollTop = cluesContainerRef.value.scrollHeight + 1000
      }, 100)
    } else {
      console.warn('線索容器引用未找到')
    }
  }, 150) // 延長等待時間
}

// 重置遊戲
const handleResetGame = () => {
  emit('reset-game')
}

// 監聽過濾器變化
watch(activeFilter, () => {
  nextTick(() => {
    if (cluesContainerRef.value) {
      cluesContainerRef.value.scrollTop = 0
    }
  })
})

// 監聽 clues 數組變化
watch(
  () => props.clues,
  () => {
    // 等待 DOM 更新後滾動到底部
    nextTick(() => {
      scrollCluesListToBottom()
    })
  },
  { deep: true },
) // deep: true 確保監聽深層變化

defineExpose({
  scrollCluesListToBottom,
})
</script>

<style scoped>
/* 右側資訊欄位樣式 */
.info-panel {
  flex: 1;
  background: #f0f4f8;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 640px; /* 設置固定高度 */
}

.info-title {
  text-align: center;
  margin-bottom: 16px;
  color: #333;
  font-size: 18px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
}

/* 過濾器樣式優化 */
.filter-tabs {
  display: flex;
  margin-bottom: 16px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  padding: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.filter-tab {
  flex: 1;
  border: none;
  background: transparent;
  color: #506690;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 0;
  margin: 0 2px;
  cursor: pointer;
  transition: all 0.25s ease;
  border-radius: 8px;
  text-align: center;
  position: relative;
  z-index: 1;
}

.filter-tab:hover {
  background: rgba(255, 255, 255, 0.7);
  color: #4c6eb1;
}

.filter-tab.active {
  background: #fff;
  color: #4c6eb1;
  box-shadow: 0 2px 6px rgba(76, 110, 177, 0.15);
  transform: translateY(-1px);
}

.filter-tab.active:before {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 25%;
  width: 50%;
  height: 3px;
  background: #4c6eb1;
  border-radius: 3px;
}

/* 修改 .clues-container 樣式 */
.clues-container {
  flex: 1;
  overflow-y: auto !important;
  margin-bottom: 16px;
  max-height: 450px;
  min-height: 300px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.4);
  display: flex;
  flex-direction: column;
}

.clue-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-grow: 1;
}

/* 重要：確保滾動發生在正確元素上 */
.clue-item:last-child {
  margin-bottom: 20px;
}

.no-clues {
  color: #777;
  text-align: center;
  padding: 20px 0;
  font-style: italic;
}

.clue-item {
  background: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.clue-question {
  font-weight: bold;
  margin-bottom: 6px;
}

.clue-answer {
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
}

.clue-answer.是 {
  background-color: #d4edda;
  color: #155724;
  font-weight: 500;
  border-left: 3px solid #28a745;
}

.clue-answer.不是 {
  background-color: #f8d7da;
  color: #721c24;
  font-weight: 500;
  border-left: 3px solid #dc3545;
}

.clue-answer.不相關 {
  background-color: #fff3cd;
  color: #856404;
  font-weight: 500;
  border-left: 3px solid #ffc107;
}

.info-footer {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

.reset-btn {
  background: #6c757d;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.reset-btn:hover {
  background: #5a6268;
}
</style>
