<template>
  <div class="story-selector">
    <!-- Modal backdrop -->
    <div v-if="showModal" class="modal-backdrop" @click="closeModal"></div>

    <!-- Modal box -->
    <div v-if="showModal" class="modal-box">
      <!-- Step 1: Play alone or with others -->
      <div v-if="currentStep === 1" class="modal-content">
        <h2 class="modal-title">你選擇了「你媽死了」故事</h2>
        <p class="modal-question">你想要和別人一起玩嗎？</p>

        <div class="option-buttons">
          <button class="option-button" @click="selectPlayAlone">不要，我是孤兒只能自己玩</button>

          <button class="option-button" @click="selectPlayWithOthers">要，我要跟別人玩</button>
        </div>

        <div class="modal-footer">
          <button class="return-button" @click="closeModal">我後悔了，還是回去投胎好了</button>
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
      currentStep: 1,
      playAlone: true,
      withRealPlayers: false,
      npcCount: 2,
      npcDescriptions: {
        0: '我連NPC都社恐',
        1: '一個就夠我頭痛了',
        2: '剛好湊個三人行不行',
        3: 'NPC組團來害我',
        4: '這不是我玩NPC，是他們玩我',
      },
    }
  },
  methods: {
    openModal() {
      this.showModal = true
      this.currentStep = 1
    },
    closeModal() {
      this.showModal = false
      this.currentStep = 1
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
      }

      console.log('Starting game with parameters:', gameParams)

      // Emit event to parent component
      this.$emit('start-game', gameParams)

      // Close modal
      this.closeModal()

      // Navigate to game page (you might need to replace this with your actual routing)
      this.$router.push({
        name: 'game',
        params: { id: this.storyId },
        query: {
          npcCount: this.npcCount,
          playAlone: this.playAlone,
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
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
}

.modal-question {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: #555;
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
}

.npc-count {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 8px;
}

.npc-description {
  font-style: italic;
  color: #7f8c8d;
  margin-bottom: 20px;
}
</style>
