<template>
  <div class="chat-container">
    <h1>海龜湯謎題遊戲</h1>

    <div class="mode-selection">
      <button @click="startGame" :disabled="gameStarted" class="mode-button">開始遊戲</button>
      <button @click="resetGame" class="mode-button">重置遊戲</button>
      <div v-if="!connectedToBackend" class="connection-error">
        <span>⚠️ 無法連接到後端服務</span>
      </div>
    </div>

    <!-- 遊戲說明 -->
    <div class="game-info" v-if="!gameStarted">
      <h3>遊戲說明</h3>
      <p>「海龜湯」是一種謎題遊戲，主持人會提出一個奇怪的場景，玩家需要通過是非問題來找出真相。</p>
      <p>遊戲規則：</p>
      <ol>
        <li>關主會提供一個不尋常的情境作為謎題</li>
        <li>你可以提問來了解更多細節，但關主只會回答「是」、「否」或給予有限的提示</li>
        <li>透過邏輯推理，找出事件的真相</li>
      </ol>
      <p>點擊「開始遊戲」來開始挑戰！</p>
    </div>

    <!-- 聊天訊息顯示區 -->
    <div class="chat-messages" ref="chatContainer" v-show="gameStarted">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="['message', getMessageClass(msg.sender)]"
      >
        <div class="message-header">
          <strong>{{ getSenderName(msg.sender) }}</strong>
          <span class="message-time">{{ formatTime(msg.timestamp) }}</span>
        </div>
        <div class="message-content" v-html="formatMessage(msg.text)"></div>
      </div>
      <div v-if="loading" class="loading-message">
        <div class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>

    <!-- 輸入區域 -->
    <div class="input-area" v-show="gameStarted">
      <input
        v-model="userInput"
        @keyup.enter="sendMessage"
        placeholder="輸入你的問題..."
        :disabled="loading || !canUserAsk"
        class="input-field"
      />
      <button
        @click="sendMessage"
        :disabled="loading || !userInput.trim() || !canUserAsk"
        class="send-button"
      >
        發送
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

// 設定API基本URL
axios.defaults.baseURL = 'http://localhost:3000'

export default {
  name: 'ChatGame',
  data() {
    return {
      userInput: '',
      messages: [],
      loading: false,
      gameStarted: false,
      currentTurn: 'host', // host, user, ai-player
      gameContext: '',
      connectedToBackend: true,
      retryCount: 0
    }
  },
  computed: {
    canUserAsk() {
      return this.gameStarted && this.currentTurn === 'user' && this.connectedToBackend
    },
  },
  methods: {
    // 格式化時間
    formatTime(timestamp) {
      if (!timestamp) return ''
      const date = new Date(timestamp)
      return date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
    },

    // 格式化訊息 - 可以支援簡單的markdown語法
    formatMessage(text) {
      if (!text) return ''
      // 加入換行符支援
      return text.replace(/\n/g, '<br>')
    },

    // 取得發言者CSS類別
    getMessageClass(sender) {
      switch (sender) {
        case 'host':
          return 'host-message'
        case 'user':
          return 'user-message'
        case 'ai-player':
          return 'ai-player-message'
        case 'system':
          return 'system-message'
        default:
          return ''
      }
    },

    // 取得發言者名稱
    getSenderName(sender) {
      switch (sender) {
        case 'host':
          return '謎題關主'
        case 'user':
          return '你'
        case 'ai-player':
          return 'AI玩家'
        case 'system':
          return '系統'
        default:
          return sender
      }
    },

    // 添加訊息到聊天
    addMessage(sender, text) {
      this.messages.push({
        sender,
        text,
        timestamp: new Date()
      })
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    },

    // 開始遊戲 - 關主提出謎題
    async startGame() {
      if (this.gameStarted) return

      // 先檢查連接
      const connected = await this.checkBackendConnection()
      if (!connected) {
        this.addMessage('system', '無法連接到後端伺服器，請確認伺服器是否運行中。')
        return
      }

      this.loading = true
      this.gameStarted = true
      this.messages = []
      this.addMessage('system', '遊戲開始！謎題關主正在準備有趣的謎題...')

      try {
        // 關主提出謎題
        const response = await axios.post('/api/host', { isNewGame: true })

        // 添加關主謎題到對話
        this.addMessage('host', response.data.reply)

        // 更新遊戲狀態，輪到用戶提問
        this.updateGameContext()
        this.currentTurn = 'user'
      } catch (error) {
        console.error('生成謎題失敗', error)
        this.addMessage('system', '無法從API獲取謎題。請確認後端伺服器狀態，可能需要重新啟動後端。')
        this.gameStarted = false
        this.connectedToBackend = false
      } finally {
        this.loading = false
      }
    },

    // 用戶發送問題
    async sendMessage() {
      if (!this.userInput.trim() || this.loading || !this.canUserAsk) return

      // 添加用戶訊息到對話
      this.addMessage('user', this.userInput.trim())

      // 清空輸入框並設置加載狀態
      const userQuestion = this.userInput
      this.userInput = ''
      this.loading = true
      this.currentTurn = 'host' // 防止用戶連續提問

      try {
        // 關主回答用戶問題
        this.updateGameContext()
        const hostResponse = await axios.post('/api/host', {
          input: userQuestion,
          isNewGame: false,
        })

        // 添加關主回答
        this.addMessage('host', hostResponse.data.reply)

        // 現在輪到AI玩家提問
        this.currentTurn = 'ai-player'

        // 延遲，讓用戶有時間閱讀關主回答
        setTimeout(async () => {
          try {
            // AI玩家提問
            this.updateGameContext()
            const aiPlayerResponse = await axios.post('/api/ai-player', {
              context: this.gameContext,
            })

            // 添加AI玩家問題
            this.addMessage('ai-player', aiPlayerResponse.data.question)

            // 關主回答AI玩家問題
            this.updateGameContext()
            const hostResponseToAI = await axios.post('/api/host', {
              input: aiPlayerResponse.data.question,
              isNewGame: false,
            })

            // 添加關主回答
            this.addMessage('host', hostResponseToAI.data.reply)

            // 輪到用戶回合
            this.currentTurn = 'user'
          } catch (error) {
            console.error('AI玩家回合出錯', error)
            this.addMessage('system', 'AI玩家思考時發生錯誤，輪到你提問。')
            this.currentTurn = 'user'
          } finally {
            this.loading = false
          }
        }, 1000)
      } catch (error) {
        console.error('遊戲流程出錯', error)
        this.addMessage('system', '與伺服器通訊時發生錯誤。請檢查網路連接，或重新開始遊戲。')
        this.loading = false
        this.currentTurn = 'user'
      }
    },

    // 更新遊戲上下文，用於AI提問
    updateGameContext() {
      this.gameContext = this.messages
        .filter(msg => ['host', 'user', 'ai-player'].includes(msg.sender)) // 不包含系統訊息
        .map((msg) => `${this.getSenderName(msg.sender)}: ${msg.text}`)
        .join('\n')
    },

    // 滾動到對話底部
    scrollToBottom() {
      if (this.$refs.chatContainer) {
        this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight
      }
    },

    // 重置遊戲
    resetGame() {
      this.messages = []
      this.gameStarted = false
      this.currentTurn = 'host'
      this.gameContext = ''
      this.connectedToBackend = true
      this.checkBackendConnection() // 重新檢查連接
    },

    // 檢查後端連接
    async checkBackendConnection() {
      try {
        // 先嘗試 hello 端點
        await axios.get('/api/hello')
        this.connectedToBackend = true
        return true
      } catch (error) {
        if (this.retryCount < 1) {
          // 嘗試一次後再試一次
          this.retryCount++
          console.log('第一次連接失敗，再試一次...')
          
          try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            await axios.get('/api/hello')
            this.connectedToBackend = true
            return true
          } catch (retryError) {
            console.error('無法連接到後端', retryError)
            this.connectedToBackend = false
            return false
          }
        } else {
          console.error('無法連接到後端', error)
          this.connectedToBackend = false
          return false
        }
      }
    }
  },
  async mounted() {
    // 檢查後端連接
    await this.checkBackendConnection()
    
    // 監聽視窗大小變化，保持滾動到底部
    window.addEventListener('resize', this.scrollToBottom)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.scrollToBottom)
  },
}
</script>

<style scoped>
.chat-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'PingFang TC', 'Microsoft JhengHei', Arial, sans-serif;
}

.connection-error {
  display: inline-block;
  margin-left: 10px;
  color: #f44336;
  font-size: 14px;
  padding: 5px 10px;
  background-color: #ffebee;
  border-radius: 4px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 0.7; }
  50% { opacity: 1; }
  100% { opacity: 0.7; }
}

/* 其他樣式保持不變 */
h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 20px;
}

.game-info {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  border-left: 4px solid #4caf50;
}

.mode-selection {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  gap: 10px;
  align-items: center;
}

.mode-button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
}

.mode-button:hover:not(:disabled) {
  background-color: #388e3c;
}

.mode-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.chat-messages {
  height: 400px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  overflow-y: auto;
  background-color: #f9f9f9;
}

.message {
  margin-bottom: 15px;
  padding: 12px;
  border-radius: 8px;
  max-width: 85%;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  position: relative;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 0.9em;
}

.message-time {
  color: #888;
  font-size: 0.8em;
}

.message-content {
  word-break: break-word;
  line-height: 1.4;
}

.user-message {
  background-color: #e3f2fd;
  margin-left: auto;
  text-align: right;
  border-bottom-right-radius: 0;
}

.ai-player-message {
  background-color: #f0e5ff;
  margin-right: auto;
  border-left: 3px solid #9c27b0;
  border-bottom-left-radius: 0;
}

.host-message {
  background-color: #fff3e0;
  margin-right: auto;
  border-left: 3px solid #ff9800;
  border-bottom-left-radius: 0;
  font-weight: 500;
}

.system-message {
  background-color: #f5f5f5;
  max-width: 100%;
  text-align: center;
  color: #666;
  font-style: italic;
  border-left: none;
  box-shadow: none;
  padding: 8px;
}

.loading-message {
  text-align: center;
  margin: 15px 0;
  height: 24px;
}

.typing-indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  margin: 0 2px;
  background-color: #999;
  border-radius: 50%;
  display: inline-block;
  animation: bounce 1.4s infinite ease-in-out both;
}

.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.input-area {
  display: flex;
  gap: 10px;
}

.input-field {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.2s;
}

.input-field:focus {
  outline: none;
  border-color: #4caf50;
}

.input-field:disabled {
  background-color: #f9f9f9;
  cursor: not-allowed;
}

.send-button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
}

.send-button:hover:not(:disabled) {
  background-color: #388e3c;
}

.send-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>