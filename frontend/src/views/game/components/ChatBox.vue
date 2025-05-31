<template>
  <div class="chat-container">
    <h2 class="title">AI 湯神</h2>
    <p class="current-player" :class="{ 'user-turn': isUserTurn, 'other-turn': !isUserTurn }">
      {{ isUserTurn ? '輪到你提問' : `${currentQuestioner}正在提問...` }}
    </p>

    <div class="chat-box" ref="chatBoxRef">
      <div v-for="(msg, index) in messages" :key="index" :class="['message', getMessageClass(msg)]">
        <span class="icon">{{ getMessageIcon(msg) }}</span>
        <span class="text" v-if="msg.type !== 'loading'">{{ msg.text }}</span>
        <span class="text loading-animation" v-else>
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </span>
      </div>
    </div>

    <!-- 輸入框部分 -->
    <div class="input-box">
      <input
        v-model="input"
        @keyup.enter="handleEnterKey"
        placeholder="輸入你的問題..."
        :disabled="usedQuestions >= questionCount || isSolved || isWaitingResponse || !isUserTurn"
      />
      <button
        @click="sendMessage"
        :disabled="usedQuestions >= questionCount || isSolved || isWaitingResponse || !isUserTurn"
      >
        ➤
      </button>
    </div>
    <div class="question-count" v-if="!isSolved && usedQuestions < questionCount">
      剩餘提問次數：{{ questionCount - usedQuestions }}
    </div>
    <div class="question-count used-all" v-else-if="!isSolved">已用完所有提問次數</div>
    <div class="question-count solved" v-else>🎉 已成功解謎 🎉</div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'

const props = defineProps({
  storyId: {
    type: [String, Number],
    required: true,
  },
  messages: {
    type: Array,
    required: true,
  },
  isWaitingResponse: {
    type: Boolean,
    default: false,
  },
  usedQuestions: {
    type: Number,
    required: true,
  },
  questionCount: {
    type: Number,
    required: true,
  },
  isSolved: {
    type: Boolean,
    default: false,
  },
  isUserTurn: {
    type: Boolean,
    default: true,
  },
  currentQuestioner: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['send-message'])

const input = ref('')
const chatBoxRef = ref(null)

// 獲取消息的樣式類別
const getMessageClass = (msg) => {
  if (msg.type === 'loading') return 'ai loading'
  if (msg.from === 'user') return 'user'
  if (msg.from === 'npc') return 'npc'
  return 'ai'
}

// 獲取消息的圖標
const getMessageIcon = (msg) => {
  if (msg.type === 'loading') return '⏳'
  if (msg.from === 'user') return '🐢'
  if (msg.from === 'npc') return '🔍'
  return '🍲'
}

// 發送消息
const sendMessage = () => {
  if (
    !input.value.trim() ||
    props.isWaitingResponse ||
    props.usedQuestions >= props.questionCount ||
    props.isSolved ||
    !props.isUserTurn
  ) {
    return
  }

  const question = input.value.trim()
  emit('send-message', question)
  input.value = ''
}

// 處理按下 Enter 鍵事件
const handleEnterKey = () => {
  sendMessage()
}

// scrollToBottom 函數
const scrollToBottom = async () => {
  await nextTick()
  setTimeout(() => {
    if (chatBoxRef.value) {
      chatBoxRef.value.scrollTop = chatBoxRef.value.scrollHeight
    } else {
      const chatContainer = document.querySelector('.chat-box')
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight
      }
    }
  }, 50)
}

// 監聽messages變化，自動滾動到底部
watch(
  () => props.messages,
  () => {
    scrollToBottom()
  },
  { deep: true },
)

// 暴露方法供父組件調用
defineExpose({
  scrollToBottom,
})

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
/* 聊天容器樣式 */
.chat-container {
  flex: 2;
  padding: 20px;
  font-family: sans-serif;
  background: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  margin-bottom: 8px;
}

.current-player {
  text-align: center;
  margin-bottom: 16px;
  font-size: 14px;
  padding: 4px;
  border-radius: 6px;
}

.user-turn {
  color: #28a745;
  background-color: #e8f5e9;
  font-weight: bold;
}

.other-turn {
  color: #ff5252;
  background-color: #ffebee;
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

.loading-animation {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  min-width: 60px;
}

.dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  margin: 0 3px;
  border-radius: 50%;
  background-color: #888;
  animation: bounce 1.4s infinite ease-in-out both;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}

.dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
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

.message.npc {
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

input:disabled {
  background-color: #f5f5f5;
  color: #999;
  cursor: not-allowed;
  border-color: #ddd;
}

button {
  padding: 0 14px;
  border: none;
  background: #4c6eb1;
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

.solved {
  color: #28a745;
  font-weight: bold;
}
</style>
