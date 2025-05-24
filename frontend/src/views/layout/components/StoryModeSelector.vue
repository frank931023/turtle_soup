<template>
  <div class="story-selector">
    <!-- Modal backdrop -->
    <div v-if="showModal" class="modal-backdrop" @click="closeModal"></div>

    <!-- Modal box -->
    <div v-if="showModal" class="modal-box">
      <!-- Step 0: Select difficulty level and question count -->
      <div v-if="currentStep === 0" class="modal-content">
        <h2 class="modal-title">你選擇了「{{ storyName }}」故事</h2>
        <p class="modal-question">請選擇難度和問題數量</p>

        <div class="selector-group">
          <div class="selector-label">問題數量</div>
          <div class="question-slider-container">
            <input
              type="range"
              min="5"
              max="50"
              step="1"
              v-model="questionCount"
              class="question-slider"
            />
            <div class="question-count">{{ questionCount }} 題</div>
      <div class="question-description" v-html="getQuestionCountDescription()"></div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="confirm-button" @click="goToNextStep">確認遊戲設置</button>
          <button class="return-button" @click="closeModal">我後悔了，還是回去投胎好了</button>
        </div>
      </div>

      <!-- Step 1: Play alone or with others -->
      <div v-if="currentStep === 1" class="modal-content">
        <h2 class="modal-title">你選擇了「{{ storyName }}」故事</h2>
        <p class="modal-question">你想要和別人一起玩嗎？</p>

        <div class="option-buttons">
          <button class="option-button" @click="selectPlayAlone">不要，我是孤兒只能自己玩</button>

          <button class="option-button" @click="selectPlayWithOthers">要，我要跟別人玩</button>
        </div>

        <div class="modal-footer">
          <button class="return-button" @click="backToPreviousStep">返回上一步</button>
          <!-- <button class="return-button" @click="closeModal">我後悔了，還是回去投胎好了</button> -->
        </div>
      </div>

      <!-- Step 2: Choose real players or NPCs -->
      <div v-if="currentStep === 2" class="modal-content">
        <h2 class="modal-title">選擇玩家類型</h2>
        <p class="modal-question">要跟誰一起承擔這個故事？</p>

        <div class="option-buttons">
          <button class="option-button" @click="selectRealPlayers">
            跟其他真人一起承擔心理創傷
          </button>

          <button class="option-button" @click="selectNPCPlayers">跟NPC們共赴瘋狂之旅</button>
        </div>

        <div class="modal-footer">
          <button class="return-button" @click="currentStep = 1">返回上一步</button>
        </div>
      </div>

      <!-- Step 3: Error message for real players (not implemented) -->
      <div v-if="currentStep === 3" class="modal-content">
        <h2 class="modal-title">未實裝功能</h2>
        <p class="modal-message">我們還沒設計這邊啦，乖，回去。</p>

        <div class="modal-footer">
          <button class="return-button" @click="currentStep = 2">乖乖返回</button>
        </div>
      </div>

      <!-- Step 4: Select number of NPCs -->
      <div v-if="currentStep === 4" class="modal-content">
        <h2 class="modal-title">選擇NPC數量</h2>
        <p class="modal-question">你想要多少個NPC一起遊戲？</p>

        <div class="npc-slider-container">
          <input type="range" min="0" max="4" v-model="npcCount" class="npc-slider" />
          <div class="npc-count">{{ npcCount }} 人</div>
          <div class="npc-description">
            {{ npcDescriptions[npcCount] }}
          </div>
        </div>

        <div class="modal-footer">
          <button class="confirm-button" @click="startGame">NPC準備好了，讓我們腦補到底！</button>
          <button class="return-button" @click="currentStep = 2">我後悔了，還是回去投胎好了</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getStoryByIdAPI } from '@/apis/story.js'
// import { ElMessage } from 'element-plus'

export default {
  name: 'StoryModeSelector',
  props: {
    storyId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      showModal: false,
      currentStep: 0,
      playAlone: true,
      withRealPlayers: false,
      npcCount: 2,
      storyName: '載入中...',
      npcDescriptions: {
        0: '我連NPC都社恐',
        1: '一個就夠我頭痛了',
        2: '剛好湊個三人行不行',
        3: 'NPC組團來害我',
        4: '這不是我玩NPC，是他們玩我',
      },
      questionCount: 8,
    }
  },
  methods: {
    // 獲取故事詳情
    async fetchStoryDetails() {
      try {
        if (this.storyId) {
          const response = await getStoryByIdAPI(this.storyId)
          if (response && response.success && response.data) {
            this.storyName = response.data.questionName || '未知故事'
          } else {
            this.storyName = '未能載入故事名稱'
            console.error('獲取故事詳情失敗:', response)
          }
        }
      } catch (error) {
        this.storyName = '未能載入故事名稱'
        console.error('獲取故事詳情錯誤:', error)
      }
    },

    // 打開模態框
    async openModal() {
      this.showModal = true
      this.currentStep = 0

      // 獲取故事詳情
      await this.fetchStoryDetails()
    },
    closeModal() {
      this.showModal = false
      this.currentStep = 0
    },
    getQuestionCountDescription() {
      if (this.questionCount <= 15) {
        return '<span style="color: #2ecc71;">淺嚐湯面，初探謎底</span>';
      } else if (this.questionCount <= 30) {
        return '<span style="color: #f39c12;">深入湯碗，探索真相</span>';
      } else {
        return '<span style="color: #e74c3c;">徹底搜查，抽絲剝繭</span>';
      }
    },
    goToNextStep() {
      this.currentStep = 1
    },
    backToPreviousStep() {
      this.currentStep = 0
    },
    selectPlayAlone() {
      this.playAlone = true
      this.startGame()
    },
    selectPlayWithOthers() {
      this.playAlone = false
      this.currentStep = 2
    },
    selectRealPlayers() {
      this.withRealPlayers = true
      this.currentStep = 3 // Go to error message (not implemented)
    },
    selectNPCPlayers() {
      this.withRealPlayers = false
      this.currentStep = 4 // Go to NPC count selection
    },
    startGame() {
      // Prepare game parameters
      const gameParams = {
        storyId: this.storyId,
        playAlone: this.playAlone,
        withRealPlayers: this.withRealPlayers,
        npcCount: parseInt(this.npcCount),
        questionCount: parseInt(this.questionCount),
      }

      console.log('Starting game with parameters:', gameParams)

      // Emit event to parent component
      this.$emit('start-game', gameParams)

      // Close modal
      this.closeModal()

      // Navigate to game page
      this.$router.push({
        name: 'Game', // 修正路由名稱
        query: {
          id: this.storyId,
          npcCount: this.npcCount,
          playAlone: this.playAlone,
          questionCount: this.questionCount,
        },
      })
    },
  },
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.modal-box {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 500px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  padding: 24px;
  text-align: center;
}

.modal-title {
  font-size: 1.6rem;
  margin-bottom: 1rem;
  color: #44281d; /* 深褐色，海龜湯顏色 */
  font-family: 'Ma Shan Zheng', cursive, sans-serif; /* 添加中文風格字體 */
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  position: relative;
}


.modal-question {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: #594a39;
  font-weight: 500;
}

.modal-message {
  font-size: 1.2rem;
  margin: 2rem 0;
  color: #e74c3c;
}

.option-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.option-button {
  padding: 12px 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 1rem;
}

.option-button:hover {
  background-color: #2980b9;
}

.modal-footer {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.confirm-button {
  padding: 12px 16px;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.confirm-button:hover {
  background-color: #27ae60;
}

.return-button {
  padding: 12px 16px;
  background-color: #95a5a6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
}

.return-button:hover {
  background-color: #7f8c8d;
}

.npc-slider-container {
  margin: 24px 0;
}

.npc-slider {
  width: 100%;
  margin-bottom: 10px;
  -webkit-appearance: none;
  appearance: none;
  height: 8px;
  background: #ddd;
  border-radius: 4px;
  outline: none;
}

.npc-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 50px;
  height: 35px;
  background-image: url('@/assets/turtlepic.jpg');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease;
}
.npc-slider::-webkit-slider-thumb:hover {
  transform: scale(1.15);
}

.npc-slider::-moz-range-thumb {
  width: 50px;
  height: 35px;
  background-image: url('@/assets/turtlepic.jpg');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.npc-slider::-moz-range-thumb:hover {
  transform: scale(1.15);
}

.npc-count {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 8px;
  margin-top: 15px; /* Add this line to push the text down */
}

.npc-description {
  font-style: italic;
  color: #7f8c8d;
  margin-bottom: 20px;
}

.selector-group {
  margin-bottom: 24px;
  text-align: left;
}

.selector-label {
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 1.1rem;
  color: #333;
  position: relative;
}

.selector-label::after {
  content: "❓";
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-left: 1px;
  font-size: 0.9rem;
  vertical-align: top; /* Change from 'middle' to 'top' to move it higher */
  position: relative;
  top: 1px;
}

.difficulty-selector {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}

.difficulty-button {
  flex: 1;
  padding: 10px;
  border: 2px solid #ddd;
  background-color: white;
  color: #555;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: bold;
}

.difficulty-button:hover {
  background-color: #f5f5f5;
}

.difficulty-button.active {
  border-color: #3498db;
  background-color: #3498db;
  color: white;
}

.difficulty-description {
  font-style: italic;
  color: #7f8c8d;
  margin-top: 6px;
  min-height: 20px;
}

.question-slider-container {
  margin: 15px 0;
}

.question-slider {
  width: 100%;
  margin-bottom: 10px;
  -webkit-appearance: none;
  appearance: none;
  height: 8px;
  background: #ddd;
  border-radius: 4px;
  outline: none;
}

.question-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 50px; /* 增加寬度，讓海龜圖示更明顯 */
  height: 35px; /* 保持高度 */
  background-image: url('@/assets/turtlepic.jpg'); /* 使用PNG格式支持透明背景 */
  background-size: contain; /* 確保圖像完整顯示 */
  background-repeat: no-repeat;
  background-position: center;
  background-color: transparent; /* 背景透明 */
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease; /* 添加過渡效果 */
}

.question-slider::-webkit-slider-thumb:hover {
  transform: scale(1.15); /* 懸停時輕微放大 */
}

.question-slider::-moz-range-thumb {
  width: 50px;
  height: 35px;
  background-image: url('@/assets/turtlepic.jpg');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-color: transparent; /* 背景透明 */
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.question-slider::-moz-range-thumb:hover {
  transform: scale(1.15);
}

.question-count {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 8px 0;
}

.question-description {
  font-style: italic;
  color: #7f8c8d;
  margin-bottom: 15px;
}
</style>
