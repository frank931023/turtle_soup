<template>
  <div class="chat-container">
    <h1>海龜湯謎題遊戲</h1>

    <div class="mode-selection">
      <button @click="startGame" :disabled="gameStarted" class="mode-button">開始遊戲</button>
      <button @click="resetGame" class="mode-button">重置遊戲</button>
    </div>

    <!-- 聊天訊息顯示區 -->
    <div class="chat-messages" ref="chatContainer">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="['message', getMessageClass(msg.sender)]"
      >
        <strong>{{ getSenderName(msg.sender) }}:</strong> {{ msg.text }}
      </div>
      <div v-if="loading" class="loading-message">思考中...</div>
    </div>

    <!-- 輸入區域 -->
    <div class="input-area">
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

export default {
  data() {
    return {
      userInput: '',
      messages: [],
      loading: false,
      gameStarted: false,
      currentTurn: 'host', // host, user, ai-player
      gameContext: '',
    }
  },
  computed: {
    canUserAsk() {
      return this.gameStarted && this.currentTurn === 'user'
    },
  },
  methods: {
    // 取得發言者CSS類別
    getMessageClass(sender) {
      switch (sender) {
        case 'host':
          return 'host-message'
        case 'user':
          return 'user-message'
        case 'ai-player':
          return 'ai-player-message'
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
        default:
          return sender
      }
    },

    // 開始遊戲 - 關主提出謎題
    async startGame() {
      if (this.gameStarted) return

      this.loading = true
      this.gameStarted = true
      this.messages = []

      try {
        // 關主提出謎題
        const response = await axios.post('/api/host', { isNewGame: true })

        // 添加關主謎題到對話
        this.messages.push({
          sender: 'host',
          text: response.data.reply,
        })

        // 更新遊戲狀態，輪到用戶提問
        this.updateGameContext()
        this.currentTurn = 'user'
      } catch (error) {
        console.error('生成謎題失敗', error)
        this.messages.push({
          sender: 'host',
          text: '抱歉，無法生成謎題。請稍後再試。',
        })
        this.gameStarted = false
      } finally {
        this.loading = false
      }
    },

    // 用戶發送問題
    async sendMessage() {
      if (!this.userInput.trim() || this.loading || !this.canUserAsk) return

      // 添加用戶訊息到對話
      const userMessage = { sender: 'user', text: this.userInput.trim() }
      this.messages.push(userMessage)

      // 清空輸入框並設置加載狀態
      const userQuestion = this.userInput
      this.userInput = ''
      this.loading = true

      try {
        // 關主回答用戶問題
        this.updateGameContext()
        const hostResponse = await axios.post('/api/host', {
          input: userQuestion,
          isNewGame: false,
        })

        // 添加關主回答
        this.messages.push({
          sender: 'host',
          text: hostResponse.data.reply,
        })

        // 現在輪到AI玩家提問
        this.currentTurn = 'ai-player'

        // 延遲，讓用戶有時間閱讀關主回答
        setTimeout(async () => {
          // AI玩家提問
          this.updateGameContext()
          const aiPlayerResponse = await axios.post('/api/ai-player', {
            context: this.gameContext,
          })

          // 添加AI玩家問題
          this.messages.push({
            sender: 'ai-player',
            text: aiPlayerResponse.data.question,
          })

          // 關主回答AI玩家問題
          this.updateGameContext()
          const hostResponseToAI = await axios.post('/api/host', {
            input: aiPlayerResponse.data.question,
            isNewGame: false,
          })

          // 添加關主回答
          this.messages.push({
            sender: 'host',
            text: hostResponseToAI.data.reply,
          })

          // 輪到用戶回合
          this.currentTurn = 'user'
          this.loading = false

          // 滾動到底部
          this.scrollToBottom()
        }, 1000)
      } catch (error) {
        console.error('遊戲流程出錯', error)
        this.messages.push({
          sender: 'host',
          text: '抱歉，遊戲流程出錯了。請稍後再試或重新開始。',
        })
        this.loading = false
        this.currentTurn = 'user'
      }

      // 滾動到底部
      this.scrollToBottom()
    },

    // 更新遊戲上下文，用於AI提問
    updateGameContext() {
      this.gameContext = this.messages
        .map((msg) => `${this.getSenderName(msg.sender)}: ${msg.text}`)
        .join('\n')
    },

    // 滾動到對話底部
    scrollToBottom() {
      setTimeout(() => {
        if (this.$refs.chatContainer) {
          this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight
        }
      }, 100)
    },

    // 重置遊戲
    resetGame() {
      this.messages = []
      this.gameStarted = false
      this.currentTurn = 'host'
      this.gameContext = ''
    },
  },
  mounted() {
    // 監聽視窗大小變化，保持滾動到底部
    window.addEventListener('resize', this.scrollToBottom)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.scrollToBottom)
  },
}
</script>

<style>
.chat-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.mode-selection {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  gap: 10px;
}

.mode-button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
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
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 8px;
  max-width: 80%;
}

.user-message {
  background-color: #e3f2fd;
  margin-left: auto;
  text-align: right;
}

.ai-player-message {
  background-color: #f0e5ff;
  margin-right: auto;
  border-left: 3px solid #9c27b0;
}

.host-message {
  background-color: #fff3e0;
  margin-right: auto;
  border-left: 3px solid #ff9800;
  font-weight: 500;
}

.loading-message {
  font-style: italic;
  color: #888;
  text-align: center;
  margin-top: 10px;
}

.input-area {
  display: flex;
  gap: 10px;
}

.input-field {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.send-button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.send-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>
