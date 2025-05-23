<template>
  <div class="page-background">
    <!-- 添加點讚動畫元素 -->
    <div class="thumbs-up-animation" ref="thumbsUpElement">
      <img src="@/assets/thumbs-up.png" alt="點讚" />
      <span class="animation-text">找到關鍵線索！</span>
    </div>

    <!-- 添加錯誤動畫元素 -->
    <div class="wrong-animation" ref="wrongElement">
      <img src="@/assets/wrong.PNG" alt="錯誤" />
      <span class="animation-text">排除了一個可能性！</span>
    </div>

    <!-- 添加無關動畫元素 -->
    <div class="not-relevant-animation" ref="notRelevantElement">
      <img src="@/assets/notrelevant.PNG" alt="無關" />
      <span class="animation-text">這與謎底無關！</span>
    </div>

    <div class="game-container">
      <!-- 頂部導航 -->

      <!-- 固定的題目標題 -->
      <div class="puzzle-title-bar">
        <h2>{{ storyData.questionContent }}</h2>
      </div>

      <!-- 題目欄 -->
      <div class="puzzle-card">
        <div class="puzzle-image">
          <img :src="storyData.imageUrl" alt="海龜湯謎題圖片" />
        </div>
        <div class="puzzle-content">
          <h2 class="puzzle-title">{{ storyData.questionName }}</h2>
          <p class="puzzle-description">
            {{ storyData.questionContent }}
          </p>
          <div class="puzzle-stats">
            <span class="like"><span class="thumb">👍</span> {{ storyData.thumbsUp }}</span>
            <span class="views"><span class="eye">👁️</span> {{ storyData.views }}</span>
            <span class="solve-rate">{{ storyData.solveRate }}</span>
          </div>
          <div class="puzzle-hint">
            你擁有{{ questionCount }}次提問機會，如"他之前有喝過海龜湯嗎？"，回答只有
            是/不是/不相關。
          </div>
        </div>
      </div>

      <!-- 解謎成功對話框 -->
      <div v-if="isSolved" class="solved-dialog">
        <div class="solved-content">
          <h2>🎉 恭喜解謎成功 🎉</h2>
          <p class="puzzle-name">「{{ storyData.questionName }}」</p>
          <p>你總共使用了 {{ usedQuestions }} 次提問</p>
          <div class="soup-answer">
            <h3>謎底：</h3>
            <p>{{ storyData.soupAnswer }}</p>
          </div>
          <div class="action-buttons">
            <button @click="resetGame" class="restart-btn">再玩一次</button>
            <router-link to="/" class="home-btn">返回首頁</router-link>
          </div>
        </div>
      </div>

      <!-- 提示框：對話次數用完 -->
      <div v-if="showFailedDialog && !isSolved" class="failed-dialog">
        <div class="failed-content">
          <h2>❌ 問題次數已用完 ❌</h2>
          <p class="puzzle-name">「{{ storyData.questionName }}」</p>
          <p>你已經使用了所有 {{ questionCount }} 次提問機會，但尚未解開謎題。</p>
          <!-- <div class="soup-answer">
            <h3>謎底揭曉：</h3>
            <p>{{ storyData.soupAnswer }}</p>
          </div> -->
          <div class="action-buttons">
            <button @click="resetGame" class="restart-btn">再試一次</button>
            <router-link to="/" class="home-btn">返回首頁</router-link>
          </div>
        </div>
      </div>

      <div class="content-wrapper">
        <!-- 左側聊天區域 -->
        <div class="chat-container">
          <h2 class="title">AI 湯神</h2>

          <div class="chat-box" ref="chatBoxRef">
            <div
              v-for="(msg, index) in messages"
              :key="index"
              :class="['message', getMessageClass(msg)]"
            >
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
              :disabled="usedQuestions >= questionCount || isSolved || isWaitingResponse"
            />
            <button
              @click="sendMessage"
              :disabled="usedQuestions >= questionCount || isSolved || isWaitingResponse"
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
            <button @click="resetGame" class="reset-btn">重新開始</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getStoryByIdAPI } from '@/apis/story.js'
import { hostAnswerAPI, aiPlayerQuestionAPI, npcQuestionAPI } from '@/apis/agent.js'
import { useGameRecordStore } from '@/stores/gameRecordStore'
import { useUserStore } from '@/stores/user'

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

const input = ref('')
const messages = ref([{ from: 'ai', text: '嗨，我是 AI 湯神，你可以問我關於這個謎題的問題！' }])
const thumbsUpElement = ref(null)
const chatBoxRef = ref(null)
const wrongElement = ref(null)
const notRelevantElement = ref(null)

// 用於追蹤已使用的提問次數
const usedQuestions = ref(0)

// 儲存有用的線索資訊
const clues = ref([])

// 添加過濾器狀態
const activeFilter = ref('all')

// 添加解謎狀態
const isSolved = ref(false)

// 添加當前 NPC 索引，用於追蹤輪到哪個 NPC 提問
const currentNpcIndex = ref(0)

// 添加加載狀態
const isLoading = ref(false)

// 添加一個 ref 引用右側線索容器
const cluesContainerRef = ref(null)

// 添加提示框狀態變量
const showFailedDialog = ref(false)

// 遊戲時間
const gameStartTime = ref(Date.now())
const gameEndTime = ref(null)

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

// 計算過濾後的線索
const filteredClues = computed(() => {
  if (activeFilter.value === 'all') {
    return clues.value
  } else {
    return clues.value.filter((clue) => clue.answer === activeFilter.value)
  }
})

const showThumbsUpAnimation = () => {
  if (thumbsUpElement.value) {
    // 先移除任何現有的類
    thumbsUpElement.value.classList.remove('exit')

    // 添加顯示類
    thumbsUpElement.value.classList.add('show')

    // 2秒後開始退出動畫
    setTimeout(() => {
      thumbsUpElement.value.classList.remove('show')
      thumbsUpElement.value.classList.add('exit')

      // 確保動畫完成後重置
      setTimeout(() => {
        thumbsUpElement.value.classList.remove('exit')
      }, 1000)
    }, 2000)
  }
}

// 添加錯誤動畫函數
const showWrongAnimation = () => {
  if (wrongElement.value) {
    // 先移除任何現有的類
    wrongElement.value.classList.remove('exit')

    // 添加顯示類
    wrongElement.value.classList.add('show')

    // 2秒後開始退出動畫
    setTimeout(() => {
      wrongElement.value.classList.remove('show')
      wrongElement.value.classList.add('exit')

      // 確保動畫完成後重置
      setTimeout(() => {
        wrongElement.value.classList.remove('exit')
      }, 1000)
    }, 2000)
  }
}

// 不相關動畫函數
const showNotRelevantAnimation = () => {
  if (notRelevantElement.value) {
    // 先移除任何現有的類
    notRelevantElement.value.classList.remove('exit')

    // 添加顯示類
    notRelevantElement.value.classList.add('show')

    // 2秒後開始退出動畫
    setTimeout(() => {
      notRelevantElement.value.classList.remove('show')
      notRelevantElement.value.classList.add('exit')

      // 確保動畫完成後重置
      setTimeout(() => {
        notRelevantElement.value.classList.remove('exit')
      }, 1000)
    }, 2000)
  }
}

// scrollToBottom 函數應該使用引入的 nextTick
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

// 修改 sendMessage 函數
const sendMessage = async () => {
  if (!storyId.value) {
    console.error('故事ID未定義!')
    return
  }

  const question = input.value.trim()
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
  await scrollToBottom()

  try {
    console.log('發送問題到後端:', question)
    // 使用 AI 關主回答問題
    const response = await hostAnswerAPI({
      storyId: storyId.value,
      input: question,
    })
    console.log('後端回覆:', response)

    // 移除加載消息
    messages.value.splice(loadingMessageIndex, 1)

    // 儲存問答作為線索
    clues.value.push({
      question,
      answer: response.reply,
    })
    // 添加自動滾動線索列表
    scrollCluesListToBottom()

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
    scrollToBottom()

    // 根據回答類型顯示不同動畫
    if (response.reply === '是') {
      showThumbsUpAnimation()
    } else if (response.reply === '不是') {
      showWrongAnimation()
    } else if (response.reply === '不相關') {
      showNotRelevantAnimation()
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

  input.value = ''
}

// 添加顯示解謎成功對話框的函數
const showSolvedDialog = () => {
  // 解謎成功對話框已經在 template 中定義，
  // 設置 isSolved = true 就會自動顯示
  console.log('顯示解謎成功對話框')
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
    await scrollToBottom()

    // 獲取 NPC 問題
    const response = await npcQuestionAPI({
      storyId: storyId.value,
      npcIndex,
      clueHistory: clues.value,
    })

    // 移除加載消息
    messages.value.splice(loadingMessageIndex, 1)

    // 顯示 NPC 問題
    messages.value.push({
      from: 'npc',
      text: `[NPC ${npcIndex + 1}] ${response.question}`,
    })
    await scrollToBottom()

    // 再添加一個加載消息表示等待關主回答
    const hostLoadingIndex = messages.value.length
    messages.value.push({ type: 'loading', text: '關主思考中...' })
    await scrollToBottom()

    // 獲取關主回答
    const answerResponse = await hostAnswerAPI({
      storyId: storyId.value,
      input: response.question,
    })

    // 移除關主加載消息
    messages.value.splice(hostLoadingIndex, 1)

    // 儲存問答作為線索
    clues.value.push({
      question: `[NPC ${npcIndex + 1}] ${response.question}`,
      answer: answerResponse.reply,
    })
    // 添加自動滾动線索列表
    scrollCluesListToBottom()

    // 顯示關主回答
    messages.value.push({ from: 'ai', text: answerResponse.reply })
    await scrollToBottom()

    // 檢查 NPC 是否猜中謎底
    // In the part where NPC solves the puzzle
    if (answerResponse.isSolved) {
      isSolved.value = true

      if (answerResponse.soup) {
        storyData.value.soupAnswer = answerResponse.soup
      }

      // Submit game record when NPC solves puzzle
      submitGameRecord()

      setTimeout(() => {
        messages.value.push({
          from: 'ai',
          text: `🎉 NPC ${npcIndex + 1} 成功猜中了謎底！遊戲已結束。`,
        })
        showSolvedDialog()
      }, 1000)
      return
    }

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
  activeFilter.value = 'all'
  isSolved.value = false
  showFailedDialog.value = false
  currentNpcIndex.value = 0

  // Reset game timer
  gameStartTime.value = Date.now()
  gameEndTime.value = null

  // Fetch story details
  fetchStoryDetails()
}
// 監聽滾動事件，控制題目標題欄的顯示
const handleScroll = () => {
  const puzzleCard = document.querySelector('.puzzle-card')
  const gameContainer = document.querySelector('.game-container')

  if (puzzleCard) {
    const rect = puzzleCard.getBoundingClientRect()
    if (rect.bottom < 50) {
      // 當題目欄底部位置超出可視區域頂部50px時
      gameContainer.classList.add('scrolled')
    } else {
      gameContainer.classList.remove('scrolled')
    }
  }
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
  clues,
  () => {
    // 等待 DOM 更新後滾動到底部
    nextTick(() => {
      scrollCluesListToBottom()
    })
  },
  { deep: true }
) // deep: true 確保監聽深層變化

onMounted(() => {
  window.addEventListener('scroll', handleScroll)

  // Reset game start time
  gameStartTime.value = Date.now()

  // Fetch story details
  fetchStoryDetails()

  console.log('遊戲設置:', {
    storyId: storyId.value,
    npcCount: npcCount.value,
    questionCount: questionCount.value,
    playAlone: playAlone.value,
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)

  // 清除可能的動畫計時器
  const thumbsUp = thumbsUpElement.value
  if (thumbsUp && thumbsUp.classList.contains('show')) {
    thumbsUp.classList.remove('show')
  }

  // 清除錯誤動畫
  const wrong = wrongElement.value
  if (wrong && wrong.classList.contains('show')) {
    wrong.classList.remove('show')
  }

  // 清除無關動畫
  const notRelevant = notRelevantElement.value
  if (notRelevant && notRelevant.classList.contains('show')) {
    notRelevant.classList.remove('show')
  }
})

// 添加等待回應的狀態
const isWaitingResponse = ref(false)

// 獲取消息的樣式類別
const getMessageClass = (msg) => {
  if (msg.type === 'loading') return 'ai loading' // 加載動畫顯示在左側
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

// 添加一個新的函數來處理按下 Enter 鍵事件
const handleEnterKey = () => {
  // 先執行發送訊息函數
  sendMessage()
  // 無論發送成功與否，都清空輸入框
  input.value = ''
}

// 提交遊戲記錄和增加分數
// Then replace your submitGameRecord function with this improved version
const submitGameRecord = async () => {
  try {
    // 計算實際遊戲時間並四捨五入為整數
    gameEndTime.value = Date.now()
    const timeSpentSeconds = (gameEndTime.value - gameStartTime.value) / 1000
    const timeSpent = Math.round(timeSpentSeconds)

    // 檢查是否有未記錄的最後答案（從 messages 中檢查）
    const lastUserMessage = messages.value
      .filter(msg => msg.from === 'user')
      .pop()

    // 檢查最後一條用戶訊息是否已經在 clues 中
    let hasLastQuestionInClues = false
    if (lastUserMessage) {
      hasLastQuestionInClues = clues.value.some(clue =>
        clue.question === lastUserMessage.text
      )
    }

    // 如果最後答案不在 clues 中且遊戲已解決，手動添加它
    if (lastUserMessage && !hasLastQuestionInClues && isSolved.value) {
      // 假設最後一個問題是正確的（因為它解決了謎題）
      clues.value.push({
        question: lastUserMessage.text,
        answer: "是",
        timestamp: new Date().toISOString()
      })
      console.log('已添加最後的解題關鍵問題到記錄:', lastUserMessage.text)
    }

    // 找出所有正確回答的問題（那些得到"是"回應的問題）
    const correctAnswers = clues.value
      .filter(clue => clue.answer === "是")
      .map(clue => clue.question)

    // 格式化用戶的答案為所有正確回答問題的集合
    let userAnswerText = ""
    if (correctAnswers.length > 0) {
      userAnswerText = correctAnswers.join("\n")
    } else {
      userAnswerText = isSolved.value ? "成功解題，但沒有找到關鍵線索" : "未解出答案"
    }

    // 只創建後端支持的數據字段
    const recordData = {
      questionId: storyId.value,
      score: calculateScore(),
      userAnswer: userAnswerText,
      isCompleted: isSolved.value,
      timeSpent: timeSpent
    }

    console.log('提交遊戲記錄:', recordData)

    // 直接調用 API
    const response = await gameRecordStore.createGameRecord(recordData)
    console.log('遊戲記錄已成功提交:', response)

    // 向用戶顯示成功訊息
    messages.value.push({
      from: 'ai',
      text: '遊戲記錄已保存！你可以在個人頁面查看你的遊戲歷史。'
    })

  } catch (error) {
    console.error('提交遊戲記錄失敗:', error)
    // 向用戶顯示錯誤訊息
    messages.value.push({
      from: 'ai',
      text: '遊戲記錄保存失敗，請稍後再試。'
    })
  }
}

// Add a function to calculate score based on questions used
const calculateScore = () => {
  // Simple scoring example: 100 points base, minus 5 points per question used
  const baseScore = 100
  const pointsPerQuestion = 5
  const usedQuestionsPoints = usedQuestions.value * pointsPerQuestion

  // Bonus for solving with fewer questions
  const remainingQuestionsBonus = (questionCount.value - usedQuestions.value) * 3

  // Calculate total score (minimum 10 points)
  const totalScore = Math.max(baseScore - usedQuestionsPoints + remainingQuestionsBonus, 10)

  return isSolved.value ? totalScore : Math.floor(totalScore / 2)
}
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
  color: #4c6eb1;
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
  width: 100%;
  margin: 0 0 20px 0;
  background: #f5f5f5;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
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
  box-sizing: border-box;
}

.puzzle-content {
  padding: 16px;
  width: 100%;
  box-sizing: border-box;
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

.like,
.views {
  display: flex;
  align-items: center;
  gap: 4px;
}

.thumb,
.eye {
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
  box-sizing: border-box;
  background: linear-gradient(to right, #4c6eb1, #5278c8);
  color: white;
  padding: 8px 16px;
  border-radius: 0 0 10px 10px;
  margin-bottom: 15px;
  z-index: 100;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
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

/* 當滾动到一定位置時顯示題目標題欄 */
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
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
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

/* 解謎成功對話框樣式 */
.solved-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.5s ease;
}

.solved-content {
  background: #fff;
  border-radius: 16px;
  padding: 30px;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  text-align: center;
  animation: slideUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.solved-content h2 {
  color: #4c6eb1;
  margin-bottom: 16px;
  font-size: 28px;
}

.puzzle-name {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.soup-answer {
  background: #f0f4f8;
  padding: 15px;
  border-radius: 8px;
  margin: 16px 0;
  text-align: left;
}

.soup-answer h3 {
  margin-bottom: 8px;
  color: #4c6eb1;
  font-size: 16px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 25px;
}

.restart-btn,
.home-btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.restart-btn {
  background: #4c6eb1;
  color: white;
  border: none;
}

.home-btn {
  background: #eee;
  color: #333;
  text-decoration: none;
}

.restart-btn:hover {
  background: #3a5c9d;
}

.home-btn:hover {
  background: #ddd;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 問題用完未解謎對話框樣式 */
.failed-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.5s ease;
}

.failed-content {
  background: #fff;
  border-radius: 16px;
  padding: 30px;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  text-align: center;
  animation: slideUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.failed-content h2 {
  color: #dc3545;
  margin-bottom: 16px;
  font-size: 28px;
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

/* 錯誤動畫樣式 */
.wrong-animation {
  position: fixed;
  top: 40%;
  left: -300px;
  transform: translateY(-50%);
  background: linear-gradient(90deg, #8b0000, #b22222);
  color: white;
  padding: 15px 25px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  opacity: 0;
  transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.wrong-animation img {
  width: 80px;
  height: 80px;
  animation: pulse 1s infinite alternate;
  background: transparent;
  object-fit: contain;
}

.wrong-animation .animation-text {
  font-size: 24px;
  font-weight: bold;
  white-space: nowrap;
}

/* 無關動畫樣式 */
.not-relevant-animation {
  position: fixed;
  top: 40%;
  left: -300px;
  transform: translateY(-50%);
  background: linear-gradient(90deg, #9e9e9e, #757575);
  color: white;
  padding: 15px 25px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  opacity: 0;
  transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.not-relevant-animation img {
  width: 80px;
  height: 80px;
  animation: pulse 1s infinite alternate;
  background: transparent;
  object-fit: contain;
}

.not-relevant-animation .animation-text {
  font-size: 24px;
  font-weight: bold;
  white-space: nowrap;
}

/* 共用的動畫類 */
.wrong-animation.show,
.not-relevant-animation.show {
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 1;
}

.wrong-animation.exit,
.not-relevant-animation.exit {
  left: 120%;
  opacity: 0;
}
</style>
