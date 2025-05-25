<template>
  <div>
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
          你擁有{{ questionCount }}次提問機會，如"他之前有喝過海龜湯嗎？"，回答只有 是/不是/不相關。
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
  storyData: {
    type: Object,
    required: true,
  },
  questionCount: {
    type: Number,
    required: true,
  },
})

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

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
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
:deep(.game-container.scrolled) .puzzle-title-bar {
  display: block;
  transform: translateY(0);
}
</style>
