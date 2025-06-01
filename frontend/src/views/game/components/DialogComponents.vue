<template>
  <div>
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
          <router-link to="/home" class="home-btn">返回首頁</router-link>
        </div>
      </div>
    </div>

    <!-- 提示框：對話次數用完 -->
    <div v-if="showFailedDialog && !isSolved" class="failed-dialog">
      <div class="failed-content">
        <h2>❌ 問題次數已用完 ❌</h2>
        <p class="puzzle-name">「{{ storyData.questionName }}」</p>
        <p>你已經使用了所有 {{ questionCount }} 次提問機會，但尚未解開謎題。</p>
        <div class="action-buttons">
          <button @click="resetGame" class="restart-btn">再試一次</button>
          <router-link to="/home" class="home-btn">返回首頁</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  isSolved: {
    type: Boolean,
    required: true,
  },
  showFailedDialog: {
    type: Boolean,
    required: true,
  },
  storyData: {
    type: Object,
    required: true,
  },
  usedQuestions: {
    type: Number,
    required: true,
  },
  questionCount: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['reset-game'])

// 重置遊戲
const resetGame = () => {
  emit('reset-game')
}
</script>

<style scoped>
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
</style>
