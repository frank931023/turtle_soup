<template>

  <div class="game-container">
    <!-- 題目欄 -->
    <div class="puzzle-card">
      <div class="puzzle-image">
        <img src="https://via.placeholder.com/200x150" alt="謎題圖片">
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
        <div class="clues-container">
          <div v-if="clues.length === 0" class="no-clues">
            尚未獲得任何線索，試著提出問題吧！
          </div>
          <div v-else class="clue-list">
            <div v-for="(clue, index) in clues" :key="index" class="clue-item">
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
</template>

<script setup>
import { ref } from 'vue'

const input = ref('')
const messages = ref([
  { from: 'ai', text: '嗨，我是 AI 湯神，你可以問我關於這個謎題的問題！' }
])

// 用於追蹤已使用的提問次數
const usedQuestions = ref(0)

// 儲存有用的線索資訊
const clues = ref([])

const sendMessage = () => {
  const question = input.value.trim()
  if (!question || usedQuestions.value >= 8) return

  // 增加已使用的提問次數
  usedQuestions.value++

  messages.value.push({ from: 'user', text: question })

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

  setTimeout(() => {
    messages.value.push({ from: 'ai', text: answer })
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
}
</script>

<style scoped lang="scss" >
/* 容器布局 */
.game-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #C7DBE5;
}

.content-wrapper {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

/* 題目欄樣式 */
.puzzle-card {
  max-width: 800px;
  margin: 20px auto;
  background: #f5f5f5;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
}

.puzzle-image {
  width: 100%;
  display: flex;
  justify-content: center;
  background: #e0e0e0;
  padding: 15px;
}

.puzzle-image img {
  max-width: 200px;
  max-height: 200px;
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
  height: 300px;
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
}

.clue-answer.不是 {
  background-color: #f8d7da;
  color: #721c24;
}

.clue-answer.不相關 {
  background-color: #fff3cd;
  color: #856404;
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

/* 響應式設計 */
@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
  }

  .info-panel {
    margin-top: 20px;
    height: 300px;
  }
}
</style>
