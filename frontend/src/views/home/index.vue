<template>
  <div class="turtle-soup-app">
    <main class="main-content">
      <div class="puzzle-options">
        <div 
          class="puzzle-option-container" 
          v-for="(puzzle, index) in puzzles" 
          :key="index"
          @mouseenter="hoveredPuzzle = puzzle.name"
          @mouseleave="hoveredPuzzle = null"
        >
          <button 
            class="puzzle-option" 
            @click="navigateToPuzzle(puzzle.name)"
            :class="{ 'active': hoveredPuzzle === puzzle.name }"
          >
            {{ puzzle.name }}
          </button>
          
          <transition name="slide-fade">
            <div 
              class="puzzle-description" 
              v-if="hoveredPuzzle === puzzle.name"
            >
              <div class="description-content">
                {{ puzzle.description }}
              </div>
            </div>
          </transition>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      hoveredPuzzle: null,
      puzzles: [
        {
          name: '海龜湯的故事🐢',
          description: '這是一則關於海龜湯起源的謎題。在這個關卡中，你將探索這種特殊思考遊戲的來源和歷史。適合初學者作為第一個挑戰，幫助你理解水平思考的基本原則和解題思路。此謎題難度較低，讓你慢慢熟悉提問和推理的技巧。'
        },
        {
          name: '死刑犯與惡魔👿',
          description: '一名死刑犯在生命最後時刻遇到了惡魔提出的奇怪交易。這個謎題融合了心理懸疑和道德兩難，需要你運用邏輯和想像力解開表面荒謬現象背後的真相。謎題難度較高，包含黑暗元素和出人意料的轉折，需要大膽假設和縝密推理。適合有經驗的解謎者挑戰。'
        },
        {
          name: '四歲的媽媽👩‍🍼',
          description: '這個謎題呈現了一個看似不可能的情境：一個四歲的孩子如何成為母親？解開這個謎題需要你跳出常規思維方式，重新思考我們對於年齡、時間和家庭關係的理解。這個中等難度的謎題特別考驗你的創造性思維和對問題的另類解讀能力。準備好顛覆你的常識了嗎？'
        },
        {
          name: '交換照片📸',
          description: '兩個陌生人在一次偶然的照片交換後，發生了一系列令人毛骨悚然的事件。這個謎題融合了神秘元素和心理驚悚，解謎過程中你需要特別關注細節並思考人性的黑暗面。包含輕度恐怖元素，考驗你的觀察力和對人類行為的理解。謎題難度中高，需要敏銳的直覺和邏輯分析能力。'
        }
      ]
    }
  },
  methods: {
    navigateToPuzzle(puzzleName) {
      console.log(`選擇了謎題: ${puzzleName}`);
      // 真正使用 Vue Router 時可以這樣跳轉
      // this.$router.push({ name: 'puzzle', params: { id: puzzleName } });
    }
  }
}
</script>

<style scoped>
/* 保留原有樣式 */
@import url('https://fonts.googleapis.com/css2?family=Special+Elite&display=swap'); /* 英文打字機字體 */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC&display=swap'); /* 中文字體 */

.turtle-soup-app {
  font-family: 'Special Elite', 'Noto Sans TC', monospace;
  max-width: 70%;
  min-height: 100vh;
  background-color: #2a2a2a; 
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border-bottom: 1px solid #e0e0e0;
}

.logo-container {
  display: flex;
  align-items: center;
}

.soup-bowl {
  position: relative;
  margin-right: 8px;
}

.steam {
  position: absolute;
  top: -12px;
  left: 5px;
  color: #666;
  font-size: 14px;
}

.bowl-img {
  width: 32px;
  height: 32px;
}

.app-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.subtitle {
  font-size: 14px;
  font-weight: normal;
  color: #666;
}

.sound-icon img {
  width: 24px;
  height: 24px;
}

.main-content {
  padding: 20px;
  background-color: #f2f2f2;
  min-height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.puzzle-introduction {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.turtle-img {
  display: block;
  width: 200px;
  height: auto;
  margin: 0 auto 20px;
}

.intro-text, .rules-text {
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 15px;
  color: #333;
  text-align: center;
  padding: 0 20px;
}

.warning {
  justify-content: center;
  background-color: white;
  margin-top: 20px;
  color: #ff3b30;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.warning-icon {
  margin-right: 5px;
}

.puzzle-options {
  display: flex;
  flex-direction: column;
  gap: 50px; /* 增加間距方便觀察動畫效果 */
  width: 100%;
  max-width: 500px;
}

/* 修改為包含按鈕和描述的容器 */
.puzzle-option-container {
  position: relative;
  margin-bottom: 25px;
  width: 100%;
  transition: transform 0.3s ease;
}

.puzzle-option-container:hover {
  transform: scale(1.02);
}

/* 修改按鈕樣式：默認白色背景 */
.puzzle-option {
  background-color: white;
  border: none;
  border-radius: 10px 10px 0 0;
  padding: 16px 25px;
  text-align: center; /* 改為居中對齊 */
  font-size: 17px;
  font-weight: 600;
  color: #333;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center; /* 添加水平居中 */
  width: 100%;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.puzzle-option:hover {
  background-color: #1a1a1a;
  transform: none;
  padding-right: 25px; /* 與左側保持一致 */
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
}

.puzzle-option.expanded {
  transform: translateX(5px);
}

.puzzle-option:hover::before {
  right: 15px;
  opacity: 1;
}

.puzzle-option:active {
  background-color: #1a1a1a;
  color: #ffffff;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
}

.puzzle-option-container:nth-child(1) .puzzle-option:hover,
.puzzle-option-container:nth-child(1) .puzzle-option.active {
  background-color: rgba(76, 175, 80, 0.1); /* 淺綠色背景 */
  border-left: 4px solid #4CAF50;
  color: #4CAF50; /* 文字顏色也變成對應顏色 */
}

.puzzle-option-container:nth-child(2) .puzzle-option:hover,
.puzzle-option-container:nth-child(2) .puzzle-option.active {
  background-color: rgba(255, 87, 34, 0.1); /* 淺橙色背景 */
  border-left: 4px solid #FF5722;
  color: #FF5722;
}

.puzzle-option-container:nth-child(3) .puzzle-option:hover,
.puzzle-option-container:nth-child(3) .puzzle-option.active {
  background-color: rgba(33, 150, 243, 0.1); /* 淺藍色背景 */
  border-left: 4px solid #2196F3;
  color: #2196F3;
}

.puzzle-option-container:nth-child(4) .puzzle-option:hover,
.puzzle-option-container:nth-child(4) .puzzle-option.active {
  background-color: rgba(156, 39, 176, 0.1); /* 淺紫色背景 */
  border-left: 4px solid #9C27B0;
  color: #9C27B0;
}

/* 按鈕展開效果 */
.puzzle-option.expanded {
  border-radius: 8px 8px 0 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* 添加新的描述框樣式 */
.puzzle-description {
  position: relative;
  width: 100%;
  background-color: white; /* 默認白色背景，會被上面的規則覆蓋 */
  border-radius: 0 0 10px 10px; /* 與按鈕圓角匹配 */
  padding: 5px 25px 18px; /* 頂部減少，兩側與按鈕一致 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  z-index: 5;
  margin-top: 0; /* 消除間隙 */
  transform-origin: top center;
  border-top: none;
}

.puzzle-option-container:nth-child(1) .puzzle-description {
  background-color: rgba(76, 175, 80, 0.1);
  border-left: 4px solid #4CAF50;
  border-right: 1px solid rgba(76, 175, 80, 0.2);
  border-bottom: 1px solid rgba(76, 175, 80, 0.2);
}

.puzzle-option-container:nth-child(2) .puzzle-description {
  background-color: rgba(255, 87, 34, 0.1);
  border-left: 4px solid #FF5722;
  border-right: 1px solid rgba(255, 87, 34, 0.2);
  border-bottom: 1px solid rgba(255, 87, 34, 0.2);
}

.puzzle-option-container:nth-child(3) .puzzle-description {
  background-color: rgba(33, 150, 243, 0.1);
  border-left: 4px solid #2196F3;
  border-right: 1px solid rgba(33, 150, 243, 0.2);
  border-bottom: 1px solid rgba(33, 150, 243, 0.2);
}

.puzzle-option-container:nth-child(4) .puzzle-description {
  background-color: rgba(156, 39, 176, 0.1);
  border-left: 4px solid #9C27B0;
  border-right: 1px solid rgba(156, 39, 176, 0.2);
  border-bottom: 1px solid rgba(156, 39, 176, 0.2);
}

.description-content {
  font-size: 14px;
  line-height: 1.6;
  padding-top: 8px;
  position: relative;
}

.puzzle-option-container:nth-child(1) .description-content {
  color: #4CAF50;
}

.puzzle-option-container:nth-child(2) .description-content {
  color: #FF5722;
}

.puzzle-option-container:nth-child(3) .description-content {
  color: #2196F3;
}

.puzzle-option-container:nth-child(4) .description-content {
  color: #9C27B0;
}

.slide-fade-enter-active {
  animation: smoothExpand 0.3s ease-out;
}

.slide-fade-leave-active {
  animation: smoothExpand 0.2s ease-in reverse;
}

@keyframes smoothExpand {
  0% {
    opacity: 0;
    transform: scaleY(0);
    max-height: 0;
  }
  100% {
    opacity: 1;
    transform: scaleY(1);
    max-height: 300px;
  }
}
</style>
