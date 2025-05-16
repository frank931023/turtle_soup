<template>
  <div class="page-background">
    <!-- 添加點讚動畫元素 -->
    <div class="thumbs-up-animation" ref="thumbsUpElement">
      <img src="@/assets/thumbs-up.png" alt="點讚">
      <span class="animation-text">找到關鍵線索！</span>
    </div>
    
    <div class="game-container">
      <!-- 頂部導航 -->

      <!-- 固定的題目標題 -->
      <div class="puzzle-title-bar">
        <h2>一個男人進了一家餐廳，點了一碗海龜湯，喝完後自殺了，請問為什麼？</h2>
      </div>
      
      <!-- 題目欄 -->
      <div class="puzzle-card">
        <div class="puzzle-image">
          <img src="@/assets/question1.png" alt="海龜湯謎題圖片">
        </div>
        <div class="puzzle-content">
          <h2 class="puzzle-title">湯面</h2>
          <p class="puzzle-description">
            一個男人進了一家餐廳，點了一碗海龜湯，喝完之後他就舉槍自殺了，請問為什麼？
          </p>
          <div class="puzzle-stats">
            <span class="like"><span class="thumb">👍</span> 200</span>
            <span class="views"><span class="eye">👁️</span> 235</span>
            <span class="solve-rate">49%</span>
          </div>
          <div class="puzzle-hint">
            你擁有8次提問機會，如"他之前有喝過海龜湯嗎？"，回答只有 是/不是/不相關。
          </div>
        </div>
      </div>
      
      <div class="content-wrapper">
        <!-- 左側聊天區域 -->
        <div class="chat-container">
          <h2 class="title">AI 湯神</h2>
      
          <div class="chat-box">
            <div
              v-for="(msg, index) in messages"
              :key="index"
              :class="['message', msg.from === 'user' ? 'user' : 'ai']"
            >
              <span class="icon">{{ msg.from === 'user' ? '🐢' : '🍲' }}</span>
              <span class="text">{{ msg.text }}</span>
            </div>
          </div>
      
          <div class="input-box">
            <input 
              v-model="input" 
              @keyup.enter="sendMessage" 
              placeholder="輸入你的問題..." 
              :disabled="usedQuestions >= 8"
            />
            <button @click="sendMessage" :disabled="usedQuestions >= 8">➤</button>
          </div>
          <div class="question-count" v-if="usedQuestions < 8">
            剩餘提問次數：{{ 8 - usedQuestions }}
          </div>
          <div class="question-count used-all" v-else>
            已用完所有提問次數
          </div>
        </div>
        
        <!-- 右側資訊欄位 -->
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
          
          <div class="clues-container">
            <div v-if="filteredClues.length === 0" class="no-clues">
              {{ activeFilter === 'all' ? '尚未獲得任何線索，試著提出問題吧！' : `沒有回答為「${activeFilter}」的線索` }}
            </div>
            <div v-else class="clue-list">
              <div v-for="(clue, index) in filteredClues" :key="index" class="clue-item">
                <div class="clue-question">Q: {{ clue.question }}</div>
                <div class="clue-answer" :class="clue.answer">A: {{ clue.answer }}</div>
              </div>
            </div>
          </div>
          <div class="info-footer">
            <button @click="resetGame" class="reset-btn">重新開始</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
  
const input = ref('')
const messages = ref([
  { from: 'ai', text: '嗨，我是 AI 湯神，你可以問我關於這個謎題的問題！' }
])
const thumbsUpElement = ref(null)

// 用於追蹤已使用的提問次數
const usedQuestions = ref(0)

// 儲存有用的線索資訊
const clues = ref([])

// 添加過濾器狀態
const activeFilter = ref('all')

// 計算過濾後的線索
const filteredClues = computed(() => {
  if (activeFilter.value === 'all') {
    return clues.value
  } else {
    return clues.value.filter(clue => clue.answer === activeFilter.value)
  }
})

const showThumbsUpAnimation = () => {
  if (thumbsUpElement.value) {
    // 先移除任何現有的類
    thumbsUpElement.value.classList.remove('exit');
    
    // 添加顯示類
    thumbsUpElement.value.classList.add('show');
    
    // 2秒後開始退出動畫
    setTimeout(() => {
      thumbsUpElement.value.classList.remove('show');
      thumbsUpElement.value.classList.add('exit');
      
      // 確保動畫完成後重置
      setTimeout(() => {
        thumbsUpElement.value.classList.remove('exit');
      }, 1000);
    }, 2000);
  }
}

// 添加此函數來處理自動捲動
const scrollToBottom = () => {
  // 使用 nextTick 確保 DOM 已經更新
  nextTick(() => {
    const chatBox = document.querySelector('.chat-box');
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  });
};

const sendMessage = () => {
  const question = input.value.trim()
  if (!question || usedQuestions.value >= 8) return

  // 增加已使用的提問次數
  usedQuestions.value++

  messages.value.push({ from: 'user', text: question })
  
  // 在用戶訊息添加後捲動到底部
  scrollToBottom();
  
  // 在用戶訊息添加後捲動到底部
  scrollToBottom();

  // 模擬回答邏輯
  let answer = ''
  if (question.includes('喝過海龜湯')) {
    answer = '是'
  } else if (question.includes('認識餐廳老闆')) {
    answer = '不是'
  } else if (question.includes('有家人')) {
    answer = '不相關'
  } else {
    answer = ['是', '不是', '不相關'][Math.floor(Math.random() * 3)]
  }

  // 儲存問答作為線索
  clues.value.push({
    question,
    answer
  })

  // 延遲顯示答案
  setTimeout(() => {
    messages.value.push({ from: 'ai', text: answer })
    
    // AI 訊息添加後也捲動到底部
    scrollToBottom();
    
    // AI 訊息添加後也捲動到底部
    scrollToBottom();
    
    // 如果答案是"是"，顯示點讚動畫
    if (answer === '是') {
      showThumbsUpAnimation()
    }
  }, 600)

  input.value = ''
}

// 重置遊戲的函數
const resetGame = () => {
  usedQuestions.value = 0
  clues.value = []
  messages.value = [
    { from: 'ai', text: '嗨，我是 AI 湯神，你可以問我關於這個謎題的問題！' }
  ]
  activeFilter.value = 'all'
}

// 監聽滾動事件，控制題目標題欄的顯示
const handleScroll = () => {
  const puzzleCard = document.querySelector('.puzzle-card')
  const gameContainer = document.querySelector('.game-container')
  
  if (puzzleCard) {
    const rect = puzzleCard.getBoundingClientRect()
    if (rect.bottom < 50) { // 當題目欄底部位置超出可視區域頂部50px時
      gameContainer.classList.add('scrolled')
    } else {
      gameContainer.classList.remove('scrolled')
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  
  // 清除可能的動畫計時器
  const thumbsUp = thumbsUpElement.value
  if (thumbsUp && thumbsUp.classList.contains('show')) {
    thumbsUp.classList.remove('show')
  }
})
</script>
  
<style scoped>
/* 背景使用圖片 */
.page-background {
  width: 100%;
  min-height: 100vh;
  background-image: url("@/assets/game-background.jpg"); /* 修正路徑 */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  display: flex;
  justify-content: center;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

/* 為了確保內容可讀性，可以添加一層半透明覆蓋 */
.page-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(199, 219, 229, 0.8); /* 半透明的藍色，保持與原樣式一致 */
  z-index: -1;
}

/* 修改點讚動畫樣式 */
.thumbs-up-animation {
  position: fixed;
  top: 40%; /* 稍微上移到頂部 */
  left: -300px; /* 初始位置在左側螢幕外 */
  transform: translateY(-50%); /* 垂直置中 */
  background: linear-gradient(90deg, #415274, #527496);
  color: white;
  padding: 15px 25px; /* 調整內邊距 */
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 16px; /* 增加間距 */
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3); /* 增強陰影 */
  z-index: 1000;
  opacity: 0;
  transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1); /* 更順暢的動畫 */
}

.thumbs-up-animation img {
  width: 80px; /* 放大圖片 */
  height: 80px; /* 放大圖片 */
  animation: pulse 1s infinite alternate;
  background: transparent; /* 確保背景透明 */
  object-fit: contain; /* 確保圖片保持原比例 */
}

.animation-text {
  font-size: 24px; /* 增大文字 */
  font-weight: bold;
  white-space: nowrap;
}

/* 更新顯示類 */
.thumbs-up-animation.show {
  left: 50%; /* 移至螢幕中央 */
  transform: translate(-50%, -50%); /* 水平和垂直居中 */
  opacity: 1;
}

/* 更新離開類 */
.thumbs-up-animation.exit {
  left: 120%; /* 向右側離開 */
  opacity: 0;
}

@keyframes pulse {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.2); /* 稍微增大脈動效果 */
  }
}

/* 容器布局 */
.game-container {
  max-width: 1200px;
  width: 70%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  background-color: transparent; /* 移除此處的背景色 */
}

.content-wrapper {
  width: 100%; /* 修改為100%，因為容器已經是70%了 */
  display: flex;
  gap: 20px;
  margin-top: 20px;
  margin-bottom: 40px;
}

/* 頂部導航 */
.game-header {
  width: 100%; /* 修改為100%，因為容器已經是70%了 */
  display: flex;
  padding: 10px 0;
  margin-bottom: 10px;
}

.home-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  text-decoration: none;
  color: #4C6EB1;
  font-weight: bold;
  transition: background 0.2s;
}

.home-link:hover {
  background: white;
}

.home-icon {
  font-size: 18px;
}

/* 題目欄樣式 */
.puzzle-card {
  width: 100%; /* 修改為100%，因為容器已經是70%了 */
  margin: 0 0 20px 0;
  background: #f5f5f5;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
}

.puzzle-image {
  width: 100%;
  height: 240px; /* 固定高度 */
  display: flex;
  justify-content: center;
  align-items: center; /* 垂直置中 */
  background: #e0e0e0;
  padding: 15px;
  overflow: hidden; /* 防止圖片溢出 */
}

.puzzle-image img {
  width: 220px; /* 固定寬度 */
  height: 220px; /* 固定高度 */
  object-fit: contain; /* 保持比例，確保圖片完整顯示 */
}

.puzzle-content {
  padding: 16px;
}

.puzzle-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
}

.puzzle-description {
  margin-bottom: 16px;
  line-height: 1.5;
}

.puzzle-stats {
  display: flex;
  gap: 15px;
  margin-bottom: 12px;
}

.puzzle-hint {
  background: #e8eaf6;
  padding: 10px;
  border-radius: 8px;
  font-size: 14px;
  color: #555;
}

.like, .views {
  display: flex;
  align-items: center;
  gap: 4px;
}

.thumb, .eye {
  font-size: 16px;
}

.solve-rate {
  color: #ff9800;
}

/* 新增固定題目標題欄 */
.puzzle-title-bar {
  display: none; /* 初始時隱藏 */
  position: sticky;
  top: 0;
  width: 100%;
  background: linear-gradient(to right, #4C6EB1, #5278c8);
  color: white;
  padding: 8px 16px;
  border-radius: 0 0 10px 10px;
  margin-bottom: 15px;
  z-index: 100;
  box-shadow: 0 3px 10px rgba(0,0,0,0.15);
  transform: translateY(-100%);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  text-align: center;
}

.puzzle-title-bar h2 {
  margin: 0;
  font-size: 14px; /* 字體更小以容納全文 */
  line-height: 1.4;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.puzzle-title-bar h2:before {
  content: '🍲';
  margin-right: 8px;
  font-size: 15px; /* 縮小圖標大小 */
  flex-shrink: 0; /* 防止圖標縮小 */
  animation: steam 2s infinite alternate;
}

@keyframes steam {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-3px);
  }
}

/* 當滾動到一定位置時顯示題目標題欄 */
.game-container.scrolled .puzzle-title-bar {
  display: block;
  transform: translateY(0);
}

/* 聊天容器樣式 */
.chat-container {
  flex: 2;
  padding: 20px;
  font-family: sans-serif;
  background: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  
}

.title {
  text-align: center;
  margin-bottom: 16px;
}

.chat-box {
  height: 450px;
  overflow-y: auto;
  margin-bottom: 16px;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fff;
}

.message {
  display: flex;
  align-items: flex-start;
  margin: 8px 0;
}

.message.user {
  justify-content: flex-end;
}

.message.ai {
  justify-content: flex-start;
}

.message .icon {
  font-size: 20px;
  margin: 0 8px;
}

.message .text {
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 12px;
  background: #e0e0e0;
  white-space: pre-wrap;
}

.message.user .text {
  background: #d1ecf1;
}

.input-box {
  display: flex;
  gap: 8px;
}

input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

button {
  padding: 0 14px;
  border: none;
  background: #4C6EB1;
  color: white;
  border-radius: 8px;
  cursor: pointer;
}

button:hover {
  background: #2c4a85;
}

button:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.question-count {
  text-align: center;
  margin-top: 10px;
  color: #555;
  font-size: 14px;
}

.used-all {
  color: #ff5252;
}

/* 右側資訊欄位樣式 */
.info-panel {
  flex: 1;
  background: #f0f4f8;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
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

.clues-container {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 16px;
  max-height: 400px; /* 限制最大高度 */
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.4);
}

.no-clues {
  color: #777;
  text-align: center;
  padding: 20px 0;
  font-style: italic;
}

.clue-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.clue-item {
  background: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
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

/* 過濾器樣式優化 */
.filter-tabs {
  display: flex;
  margin-bottom: 16px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  padding: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
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
  color: #4C6EB1;
}

.filter-tab.active {
  background: #fff;
  color: #4C6EB1;
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
  background: #4C6EB1;
  border-radius: 3px;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .game-container {
    width: 95%; /* 手機版使用更大寬度 */
  }
  
  .content-wrapper {
    flex-direction: column;
  }

  .info-panel {
    margin-top: 20px;
    height: 300px;
  }
}
</style>
