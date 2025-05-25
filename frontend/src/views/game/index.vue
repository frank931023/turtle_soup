<template>
  <div class="page-background">
    <!-- 引入動畫元素組件 -->
    <AnimationElements ref="animationsRef" />

    <div class="game-container">
      <!-- 引入拼圖卡片組件 -->
      <PuzzleCard :storyData="storyData" :questionCount="questionCount" />

      <!-- 引入對話框組件 -->
      <DialogComponents
        :isSolved="isSolved"
        :showFailedDialog="showFailedDialog"
        :storyData="storyData"
        :usedQuestions="usedQuestions"
        :questionCount="questionCount"
        @reset-game="resetGame"
      />

      <div class="content-wrapper">
        <!-- 引入聊天框組件 -->
        <ChatBox
          :storyId="storyId"
          :messages="messages"
          :isWaitingResponse="isWaitingResponse"
          :usedQuestions="usedQuestions"
          :questionCount="questionCount"
          :isSolved="isSolved"
          @send-message="sendMessage"
          ref="chatBoxRef"
        />

        <!-- 引入資訊面板組件 -->
        <InfoPanel :clues="clues" @reset-game="resetGame" ref="infoPanelRef" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { getStoryByIdAPI } from '@/apis/story.js'
import { useGameRecordStore } from '@/stores/gameRecordStore'
import { useUserStore } from '@/stores/user'

// 引入組件
import AnimationElements from './components/AnimationElements.vue'
import PuzzleCard from './components/PuzzleCard.vue'
import ChatBox from './components/ChatBox.vue'
import InfoPanel from './components/InfoPanel.vue'
import DialogComponents from './components/DialogComponents.vue'

// 引入遊戲服務
import GameService from './services/GameService.js'

// 初始化 stores
const gameRecordStore = useGameRecordStore()
const userStore = useUserStore()

const route = useRoute()
// 修正獲取 storyId 的方式，確保能正確接收來自首頁的參數
const storyId = ref(route.query.id || route.params.id)
// 從路由中獲取其他參數
const npcCount = ref(parseInt(route.query.npcCount) || 0)
const questionCount = ref(parseInt(route.query.questionCount) || 8)
const playAlone = ref(route.query.playAlone === 'true' || route.query.playAlone === true)

// 判斷是否啟用 NPC
const npcEnabled = ref(npcCount.value > 0)

// 故事資料
const storyData = ref({
  questionName: '載入中...',
  questionContent: '載入中...',
  thumbsUp: 0,
  views: 0,
  solveRate: '0%',
  imageUrl: '',
  soupAnswer: '', // 添加謎底欄位
})

const messages = ref([{ from: 'ai', text: '嗨，我是 AI 湯神，你可以問我關於這個謎題的問題！' }])

// 用於追蹤已使用的提問次數
const usedQuestions = ref(0)

// 儲存有用的線索資訊
const clues = ref([])

// 添加解謎狀態
const isSolved = ref(false)

// 添加當前 NPC 索引，用於追蹤輪到哪個 NPC 提問
const currentNpcIndex = ref(0)

// 添加加載狀態
const isLoading = ref(false)

// 添加提示框狀態變量
const showFailedDialog = ref(false)

// 添加等待回應的狀態
const isWaitingResponse = ref(false)

// 添加引用
const animationsRef = ref(null)
const chatBoxRef = ref(null)
const infoPanelRef = ref(null)

// 添加顯示對話次數用完提示框的函數
const showQuestionsUsedUpDialog = () => {
  showFailedDialog.value = true
}

// 獲取故事詳情
const fetchStoryDetails = async () => {
  try {
    console.log('獲取故事詳情，ID:', storyId.value)
    if (storyId.value) {
      const response = await getStoryByIdAPI(storyId.value)
      if (response && response.success && response.data) {
        storyData.value = {
          questionName: response.data.questionName || '未知故事',
          questionContent: response.data.story || '無故事內容',
          thumbsUp: response.data.thumbsUp || 0,
          views: response.data.views || Math.floor(Math.random() * 2000 + 500),
          solveRate: response.data.solveRate || `${Math.floor(Math.random() * 50 + 30)}%`,
          imageUrl: response.data.imageURL || '@/assets/question1.png',
          soupAnswer: response.data.soup || '謎底未設定', // 儲存謎底，顯示在解謎對話框
        }
        console.log('成功獲取故事資料:', storyData.value)
      } else {
        console.error('獲取故事詳情失敗:', response)
      }
    }
  } catch (error) {
    console.error('獲取故事詳情錯誤:', error)
  }
}

// 添加顯示解謎成功對話框的函數
const showSolvedDialog = () => {
  // 解謎成功對話框已經在 DialogComponents 中定義，
  // 設置 isSolved = true 就會自動顯示
  console.log('顯示解謎成功對話框')
}

// 修改 sendMessage 函數
const sendMessage = async (question) => {
  if (!storyId.value) {
    console.error('故事ID未定義!')
    return
  }

  if (
    !question ||
    usedQuestions.value >= questionCount.value ||
    isSolved.value ||
    isWaitingResponse.value
  )
    return

  // 設置為等待回應狀態
  isWaitingResponse.value = true

  // 增加已使用的提問次數 (只有玩家提問才增加)
  usedQuestions.value++

  messages.value.push({ from: 'user', text: question })

  // 添加加載消息
  const loadingMessageIndex = messages.value.length
  messages.value.push({ type: 'loading', text: '正在思考...' })

  // 在用戶訊息添加後捲動到底部
  await chatBoxRef.value.scrollToBottom()

  try {
    // 使用 GameService 發送請求
    const response = await GameService.sendQuestion(storyId.value, question, null)

    // 移除加載消息
    messages.value.splice(loadingMessageIndex, 1)

    // 儲存問答作為線索
    clues.value.push({
      question,
      answer: response.reply,
    })

    // 添加自動滾動線索列表
    infoPanelRef.value.scrollCluesListToBottom()

    // 顯示答案
    messages.value.push({ from: 'ai', text: response.reply })

    // 檢查是否猜中謎底 (通過 isSolved 標記判斷)
    // In your sendMessage function, update the part that checks for completion:
    // For successful solving
    if (response.isSolved) {
      isSolved.value = true

      // Record game information
      if (response.soup) {
        storyData.value.soupAnswer = response.soup
      }

      // Submit game record for successful solving
      submitGameRecord()

      setTimeout(() => {
        messages.value.push({
          from: 'ai',
          text: '🎉恭喜你成功解出謎題！🎉 遊戲已結束，請查看謎底解析。',
        })
        showSolvedDialog()
      }, 1000)

      return
    }

    // 只有未解謎時才讓 NPC 提問
    if (!isSolved.value && npcEnabled.value && npcCount.value > 0) {
      // 等待一段時間再讓 NPC 提問，增加交互感
      setTimeout(() => {
        askNpcQuestion()
      }, 1500)
    }

    // AI 訊息添加後也捲動到底部
    chatBoxRef.value.scrollToBottom()

    // 根據回答類型顯示不同動畫
    if (response.reply === '是') {
      animationsRef.value.showThumbsUpAnimation()
    } else if (response.reply === '不是') {
      animationsRef.value.showWrongAnimation()
    } else if (response.reply === '不相關') {
      animationsRef.value.showNotRelevantAnimation()
    }

    // 检查是否已用完所有問題且未解謎
    // For running out of questions (add at the end of sendMessage)
    if (usedQuestions.value >= questionCount.value && !isSolved.value) {
      setTimeout(() => {
        showQuestionsUsedUpDialog()
        // Submit game record for unsuccessful attempt
        submitGameRecord()
      }, 1000)
    }
  } catch (error) {
    // 移除加載消息
    messages.value.splice(loadingMessageIndex, 1)

    console.error('獲取答案失敗:', error)
    messages.value.push({
      from: 'ai',
      text: '抱歉，無法回答這個問題。請稍後再試。',
    })
  } finally {
    // 無論成功或失敗，都恢復輸入狀態
    isWaitingResponse.value = false
  }
}

// 修改 askNpcQuestion 函數，依序讓 NPC 提問
const askNpcQuestion = async () => {
  // 檢查是否還有可用提問次數或已經解謎成功
  if (usedQuestions.value >= questionCount.value || isSolved.value) return

  try {
    // 使用依序的 NPC 索引，而非隨機選擇
    const npcIndex = currentNpcIndex.value

    // 添加加載消息
    const loadingMessageIndex = messages.value.length
    messages.value.push({ type: 'loading', text: '正在思考...' })
    await chatBoxRef.value.scrollToBottom()

    // 使用 GameService 獲取 NPC 問題和答案
    const npcResponseHandler = (response) => {
      // 移除加載消息
      messages.value.splice(loadingMessageIndex, 1)

      // 顯示 NPC 問題
      messages.value.push({
        from: 'npc',
        text: `[NPC ${npcIndex + 1}] ${response.question}`,
      })
      chatBoxRef.value.scrollToBottom()

      // 再添加一個加載消息表示等待關主回答
      const hostLoadingIndex = messages.value.length
      messages.value.push({ type: 'loading', text: '關主思考中...' })
      chatBoxRef.value.scrollToBottom()

      return hostLoadingIndex
    }

    const npcAnswerHandler = async (answerResponse, question, hostLoadingIndex) => {
      // 移除關主加載消息
      messages.value.splice(hostLoadingIndex, 1)

      // 儲存問答作為線索
      clues.value.push({
        question: `[NPC ${npcIndex + 1}] ${question}`,
        answer: answerResponse.reply,
      })

      // 添加自動滾动線索列表
      infoPanelRef.value.scrollCluesListToBottom()

      // 顯示關主回答
      messages.value.push({ from: 'ai', text: answerResponse.reply })
      await chatBoxRef.value.scrollToBottom()

      // 檢查 NPC 是否猜中謎底
      if (answerResponse.isSolved) {
        isSolved.value = true

        // 獲取完整謎底 (如果後端有返回)
        if (answerResponse.soup) {
          storyData.value.soupAnswer = answerResponse.soup
        }

        // 顯示 NPC 猜中的訊息
        setTimeout(() => {
          messages.value.push({
            from: 'ai',
            text: `🎉 NPC ${npcIndex + 1} 成功猜中了謎底！遊戲已結束。`,
          })

          // 自動顯示解謎成功對話框
          showSolvedDialog()
        }, 1000)
        return true
      }
      return false
    }

    // 預先宣告變數，稍後會被賦值
    let hostLoadingIndex

    // 準備回調函數
    const answerCallbackFn = async (answerResponse, question, loadingIndex) => {
      const solved = await npcAnswerHandler(answerResponse, question, loadingIndex)
      return solved
    } // 獲取 NPC 問題
    await GameService.askNpcQuestion(
      storyId.value,
      npcIndex,
      clues.value,
      npcResponseHandler,
      answerCallbackFn,
    )

    // 更新 NPC 索引，讓下一個 NPC 提問
    currentNpcIndex.value = (currentNpcIndex.value + 1) % npcCount.value

    // 看是否還有其他 NPC 要提問
    if (!isSolved.value && npcCount.value > 1 && currentNpcIndex.value !== 0) {
      // 等待一段時間再讓下一個 NPC 提問
      setTimeout(() => {
        askNpcQuestion()
      }, 1500)
    }
  } catch (error) {
    console.error('NPC 提問失敗:', error)
    // 移除可能的加載消息
    messages.value = messages.value.filter((msg) => msg.type !== 'loading')
    // 出錯時也要更新 NPC 索引，避免卡住
    currentNpcIndex.value = (currentNpcIndex.value + 1) % npcCount.value
  }
}

// 重置遊戲的函數
const resetGame = () => {
  usedQuestions.value = 0
  clues.value = []
  messages.value = [{ from: 'ai', text: '嗨，我是 AI 湯神，你可以問我關於這個謎題的問題！' }]
  isSolved.value = false // 重置解謎狀態
  showFailedDialog.value = false // 重置失敗對話框狀態
  currentNpcIndex.value = 0 // 重置 NPC 索引

  // Fetch story details
  fetchStoryDetails()
}

// 提交遊戲記錄和增加分數
const submitGameRecord = async () => {
  try {
    await GameService.submitGameRecord(storyId.value, clues.value)
  } catch (error) {
    console.error('提交遊戲記錄失敗:', error)
  }
}

onMounted(() => {
  // 立即執行獲取故事詳情
  fetchStoryDetails()

  console.log('遊戲設置:', {
    storyId: storyId.value,
    npcCount: npcCount.value,
    questionCount: questionCount.value,
    playAlone: playAlone.value,
  })

  // 初始化 WebSocket 連接（為未來多人遊戲做準備）
  // const socket = GameService.initWebSocket(storyId.value)
})
</script>

<style scoped>
/* 背景使用圖片 */
.page-background {
  width: 100%;
  min-height: 100vh;
  background-image: url('@/assets/game-background.jpg'); /* 修正路徑 */
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

/* 容器布局 */
.game-container {
  max-width: 1200px;
  width: 70%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  background-color: transparent;
}

.content-wrapper {
  width: 100%;
  display: flex;
  gap: 20px;
  margin-top: 20px;
  margin-bottom: 40px;
  box-sizing: border-box;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .game-container {
    width: 95%; /* 手機版使用更大寬度 */
  }

  .content-wrapper {
    flex-direction: column;
  }
}
</style>
