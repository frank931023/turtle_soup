// 遊戲邏輯服務
import { hostAnswerAPI, npcQuestionAPI } from '@/apis/agent.js'
import { useGameRecordStore } from '@/stores/gameRecordStore'
import { useUserStore } from '@/stores/user' // 引入 userStore 來獲取用戶資訊
import { addScoreAPI } from '@/apis/users.js' // 引入 addScoreAPI

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

  // 提交遊戲記錄和增加分數 (更新後的詳細實現，包含用戶加分)
  async submitGameRecord(
    storyId,
    clues,
    messages,
    isSolved,
    gameStartTime,
    gameEndTime,
    calculateScore,
  ) {
    try {
      const gameRecordStore = useGameRecordStore()

      // 計算實際遊戲時間並四捨五入為整數
      gameEndTime = gameEndTime || Date.now()
      const timeSpentSeconds = (gameEndTime - gameStartTime) / 1000
      const timeSpent = Math.round(timeSpentSeconds)

      // 檢查是否有未記錄的最後答案（從 messages 中檢查）
      const lastUserMessage = messages.filter((msg) => msg.from === 'user').pop()

      // 檢查最後一條用戶訊息是否已經在 clues 中
      let hasLastQuestionInClues = false
      if (lastUserMessage) {
        hasLastQuestionInClues = clues.some((clue) => clue.question === lastUserMessage.text)
      }

      // 如果最後答案不在 clues 中且遊戲已解決，手動添加它
      if (lastUserMessage && !hasLastQuestionInClues && isSolved) {
        // 假設最後一個問題是正確的（因為它解決了謎題）
        clues.push({
          question: lastUserMessage.text,
          answer: '是',
          timestamp: new Date().toISOString(),
        })
        console.log('已添加最後的解題關鍵問題到記錄:', lastUserMessage.text)
      }

      // 找出所有正確回答的問題（那些得到"是"回應的問題）
      const correctAnswers = clues
        .filter((clue) => clue.answer === '是')
        .map((clue) => clue.question)

      // 格式化用戶的答案為所有正確回答問題的集合
      let userAnswerText = ''
      if (correctAnswers.length > 0) {
        userAnswerText = correctAnswers.join('\n')
      } else {
        userAnswerText = isSolved ? '成功解題，但沒有找到關鍵線索' : '未解出答案'
      }

      // 計算遊戲得分
      const earnedScore = calculateScore ? calculateScore() : 10

      // 只創建後端支持的數據字段
      const recordData = {
        questionId: storyId,
        score: earnedScore,
        userAnswer: userAnswerText,
        isCompleted: isSolved,
        timeSpent: timeSpent,
        clueHistory: clues,
      }

      console.log('提交遊戲記錄:', recordData)

      // 直接調用 API
      const response = await gameRecordStore.createGameRecord(recordData)
      console.log('遊戲記錄已成功提交:', response)

      // ===== 新增：更新用戶分數 =====
      // 獲取當前用戶信息
      const userStore = useUserStore()
      const currentUser = userStore.userInfo.user
      console.log(currentUser)

      // 如果存在用戶信息，則更新分數
      if (currentUser.id) {
        try {
          // 調用加分 API
          const scoreResponse = await addScoreAPI(currentUser.id, earnedScore)
          console.log('用戶分數已更新:', scoreResponse)

          // 更新本地用戶資料 (如果需要即時顯示更新後的分數)
          if (scoreResponse && scoreResponse.result) {
            userStore.setUserScore(scoreResponse.result.currentScore)
          }
        } catch (scoreError) {
          console.error('更新用戶分數失敗:', scoreError)
          // 遊戲記錄已成功提交，只是分數更新失敗，不影響整體流程
        }
      } else {
        console.warn('未找到用戶資訊，無法更新分數')
      }

      return response
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
  // sendWebSocketMessage(socket, messageType, data) {
  //   if (!socket) return false

  //   try {
  //     const message = {
  //       type: messageType,
  //       data: data,
  //       timestamp: new Date().getTime(),
  //     }
  //     socket.send(JSON.stringify(message))
  //     return true
  //   } catch (error) {
  //     console.error('發送WebSocket消息失敗:', error)
  //     return false
  //   }
  // },

  // 關閉WebSocket連接
  // closeWebSocket(socket) {
  //   if (socket && socket.readyState === WebSocket.OPEN) {
  //     socket.close()
  //   }
  // },
}

export default GameService
