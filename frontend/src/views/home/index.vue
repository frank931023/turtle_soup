<template>
  <div class="turtle-soup-app">
    <!-- Main content -->
    <main class="main-content">
      <div class="puzzle-introduction">
        <img src="@/assets/turtle-soup.png" alt="Turtle Soup Illustration" class="turtle-img" />

        <p class="intro-text">
          你知道海龜湯嗎？它又叫做水平思考。題目首先給你故事結局，也就是「<strong>湯麵</strong>」，你必須使用跳躍性、超凡的創造力提出猜想，讓這個故事自圓其說，找到「湯底」。
        </p>

        <p class="rules-text">
          海龜湯沒有標準答案，你可以不斷提問來驗證你的猜想，但AI只會回答是/不是/不相關，你有8次提問機會，耗盡後會公布答案，助你好運！
        </p>

        <div class="warning">
          <span class="warning-icon">⚠ </span>
          <span class="warning-text"><strong>注意：部分故事包含恐怖/血腥元素，膽小慎入。</strong></span>
        </div>
      </div>

      <!-- Puzzle options -->
      <div class="puzzle-options">
        <button class="puzzle-option" @click="navigateToPuzzle('海龜湯的故事')">
          海龜湯的故事
        </button>

        <button class="puzzle-option" @click="navigateToPuzzle('死刑犯與惡魔')">
          死刑犯與惡魔
        </button>

        <button class="puzzle-option" @click="navigateToPuzzle('四歲的媽媽')">
          四歲的媽媽
        </button>

        <button class="puzzle-option" @click="navigateToPuzzle('交換照片')">
          交換照片
        </button>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  methods: {
    navigateToPuzzle(puzzleName) {
      // Vue Router 3 & 4 都支援這種寫法
      console.log(`選擇了謎題: ${puzzleName}`);
      // 真正使用 Vue Router 時可以這樣跳轉
      // this.$router.push({ name: 'puzzle', params: { id: puzzleName } });
    }
  }
}
</script>

<style lang="scss" scoped>
/* 完全不變，因為 Vue 3 仍支援 scoped styles */
.turtle-soup-app {
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  max-width: 100%;
  min-height: 100vh;
  background-color: white;
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
  gap: 10px;
}

.puzzle-option {
  background-color: white;
  border: none;
  border-radius: 8px;
  padding: 15px 20px;
  text-align: left;
  font-size: 16px;
  color: #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.puzzle-option:hover {
  background-color: #f0f0f0;
  transform: translateX(5px);
  padding-right: 40px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.puzzle-option::before {
  content: "→";
  position: absolute;
  right: -20px;
  opacity: 0;
  transition: all 0.3s ease;
}
.puzzle-option:hover::before {
  right: 15px;
  opacity: 1;
}

.puzzle-option:active {
  transform: translateX(2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.puzzle-option:nth-child(1):hover {
  border-left: 4px solid #4CAF50;
}

.puzzle-option:nth-child(2):hover {
  border-left: 4px solid #FF5722;
}

.puzzle-option:nth-child(3):hover {
  border-left: 4px solid #2196F3;
}

.puzzle-option:nth-child(4):hover {
  border-left: 4px solid #9C27B0;
}
</style>
