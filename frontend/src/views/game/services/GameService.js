// 遊戲邏輯服務
import { hostAnswerAPI, npcQuestionAPI } from '@/apis/agent.js'
import { useGameRecordStore } from '@/stores/gameRecordStore'

export const GameService = {
  // 發送問題並獲取回答
  async sendQuestion(storyId, question, onResponseCallback) {
    try {
      console.log('發送問題到後端:', question)
      // 使用 AI 關主回答問題
      const response = await hostAnswerAPI({
        storyId,
        input: question,
      })
      console.log('後端回覆:', response)

      // 調用回調函數處理響應
      if (onResponseCallback) {
        onResponseCallback(response)
      }

      return response
    } catch (error) {
      console.error('獲取答案失敗:', error)
      throw error
    }
  },

  // 讓 NPC 提問
  async askNpcQuestion(storyId, npcIndex, clueHistory, onResponseCallback, onAnswerCallback) {
    try {
      // 獲取 NPC 問題
      const response = await npcQuestionAPI({
        storyId,
        npcIndex,
        clueHistory,
      })

      // 調用問題回調，并獲取 hostLoadingIndex
      let hostLoadingIndex
      if (onResponseCallback) {
        hostLoadingIndex = onResponseCallback(response)
      }

      // 獲取關主回答
      const answerResponse = await hostAnswerAPI({
        storyId,
        input: response.question,
      })

      // 調用答案回調，傳入 hostLoadingIndex
      if (onAnswerCallback) {
        onAnswerCallback(answerResponse, response.question, hostLoadingIndex)
      }

      return { question: response, answer: answerResponse }
    } catch (error) {
      console.error('NPC 提問失敗:', error)
      throw error
    }
  },

  // 提交遊戲記錄和增加分數
  async submitGameRecord(storyId, clues, timeSpent = 300.5) {
    try {
      const gameRecordStore = useGameRecordStore()

      // 創建遊戲記錄
      const recordData = {
        questionId: storyId,
        score: 10,
        userAnswer: '測試，gemini說對就對',
        isCompleted: true,
        timeSpent: timeSpent,
        clueHistory: clues,
      }

      const recordResponse = await gameRecordStore.createGameRecord(recordData)
      console.log('遊戲記錄已成功提交:', recordResponse)
      return recordResponse
    } catch (error) {
      console.error('提交遊戲記錄失敗:', error)
      throw error
    }
  },

  // WebSocket 相關方法 (為未來擴展準備)
  initWebSocket(gameId) {
    console.log('初始化WebSocket連接，gameId:', gameId)
    // TODO: 實現WebSocket連接初始化
    // const socket = new WebSocket('ws://your-websocket-server/game/' + gameId);
    // return socket;
    return null
  },

  // 發送WebSocket消息
  sendWebSocketMessage(socket, messageType, data) {
    if (!socket) return false

    try {
      const message = {
        type: messageType,
        data: data,
        timestamp: new Date().getTime(),
      }
      socket.send(JSON.stringify(message))
      return true
    } catch (error) {
      console.error('發送WebSocket消息失敗:', error)
      return false
    }
  },

  // 關閉WebSocket連接
  closeWebSocket(socket) {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.close()
    }
  },
}

export default GameService
