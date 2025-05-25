<template>
  <div>
    <!-- 添加點讚動畫元素 -->
    <div class="thumbs-up-animation" ref="thumbsUpElement">
      <img src="@/assets/thumbs-up.png" alt="點讚" />
      <span class="animation-text">找到關鍵線索！</span>
    </div>

    <!-- 添加錯誤動畫元素 -->
    <div class="wrong-animation" ref="wrongElement">
      <img src="@/assets/wrong.PNG" alt="錯誤" />
      <span class="animation-text">排除了一個可能性！</span>
    </div>

    <!-- 添加無關動畫元素 -->
    <div class="not-relevant-animation" ref="notRelevantElement">
      <img src="@/assets/notrelevant.PNG" alt="無關" />
      <span class="animation-text">這與謎底無關！</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const thumbsUpElement = ref(null)
const wrongElement = ref(null)
const notRelevantElement = ref(null)

// 定義方法並暴露給父組件
const showThumbsUpAnimation = () => {
  if (thumbsUpElement.value) {
    // 先移除任何現有的類
    thumbsUpElement.value.classList.remove('exit')

    // 添加顯示類
    thumbsUpElement.value.classList.add('show')

    // 2秒後開始退出動畫
    setTimeout(() => {
      thumbsUpElement.value.classList.remove('show')
      thumbsUpElement.value.classList.add('exit')

      // 確保動畫完成後重置
      setTimeout(() => {
        thumbsUpElement.value.classList.remove('exit')
      }, 1000)
    }, 2000)
  }
}

// 添加錯誤動畫函數
const showWrongAnimation = () => {
  if (wrongElement.value) {
    // 先移除任何現有的類
    wrongElement.value.classList.remove('exit')

    // 添加顯示類
    wrongElement.value.classList.add('show')

    // 2秒後開始退出動畫
    setTimeout(() => {
      wrongElement.value.classList.remove('show')
      wrongElement.value.classList.add('exit')

      // 確保動畫完成後重置
      setTimeout(() => {
        wrongElement.value.classList.remove('exit')
      }, 1000)
    }, 2000)
  }
}

// 不相關動畫函數
const showNotRelevantAnimation = () => {
  if (notRelevantElement.value) {
    // 先移除任何現有的類
    notRelevantElement.value.classList.remove('exit')

    // 添加顯示類
    notRelevantElement.value.classList.add('show')

    // 2秒後開始退出動畫
    setTimeout(() => {
      notRelevantElement.value.classList.remove('show')
      notRelevantElement.value.classList.add('exit')

      // 確保動畫完成後重置
      setTimeout(() => {
        notRelevantElement.value.classList.remove('exit')
      }, 1000)
    }, 2000)
  }
}

onUnmounted(() => {
  // 清除可能的動畫計時器
  const thumbsUp = thumbsUpElement.value
  if (thumbsUp && thumbsUp.classList.contains('show')) {
    thumbsUp.classList.remove('show')
  }

  // 清除錯誤動畫
  const wrong = wrongElement.value
  if (wrong && wrong.classList.contains('show')) {
    wrong.classList.remove('show')
  }

  // 清除無關動畫
  const notRelevant = notRelevantElement.value
  if (notRelevant && notRelevant.classList.contains('show')) {
    notRelevant.classList.remove('show')
  }
})

// 暴露給父組件需要的方法和引用
defineExpose({
  thumbsUpElement,
  wrongElement,
  notRelevantElement,
  showThumbsUpAnimation,
  showWrongAnimation,
  showNotRelevantAnimation,
})
</script>

<style scoped>
/* 修改點讚動畫樣式 */
.thumbs-up-animation {
  position: fixed;
  top: 40%; /* 稍微上移到頂部 */
  left: -300px; /* 初始位置在左側螢幕外 */
  transform: translateY(-50%); /* 垂直置中 */
  background: linear-gradient(90deg, #415274, #527496);
  color: white;
  padding: 15px 25px; /* 調整內邊距 */
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 16px; /* 增加間距 */
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3); /* 增強陰影 */
  z-index: 1000;
  opacity: 0;
  transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1); /* 更順暢的動畫 */
}

.thumbs-up-animation img {
  width: 80px; /* 放大圖片 */
  height: 80px; /* 放大圖片 */
  animation: pulse 1s infinite alternate;
  background: transparent; /* 確保背景透明 */
  object-fit: contain; /* 確保圖片保持原比例 */
}

.animation-text {
  font-size: 24px; /* 增大文字 */
  font-weight: bold;
  white-space: nowrap;
}

/* 更新顯示類 */
.thumbs-up-animation.show {
  left: 50%; /* 移至螢幕中央 */
  transform: translate(-50%, -50%); /* 水平和垂直居中 */
  opacity: 1;
}

/* 更新離開類 */
.thumbs-up-animation.exit {
  left: 120%; /* 向右側離開 */
  opacity: 0;
}

@keyframes pulse {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.2); /* 稍微增大脈動效果 */
  }
}

/* 錯誤動畫樣式 */
.wrong-animation {
  position: fixed;
  top: 40%;
  left: -300px;
  transform: translateY(-50%);
  background: linear-gradient(90deg, #8b0000, #b22222);
  color: white;
  padding: 15px 25px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  opacity: 0;
  transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.wrong-animation img {
  width: 80px;
  height: 80px;
  animation: pulse 1s infinite alternate;
  background: transparent;
  object-fit: contain;
}

.wrong-animation .animation-text {
  font-size: 24px;
  font-weight: bold;
  white-space: nowrap;
}

/* 無關動畫樣式 */
.not-relevant-animation {
  position: fixed;
  top: 40%;
  left: -300px;
  transform: translateY(-50%);
  background: linear-gradient(90deg, #9e9e9e, #757575);
  color: white;
  padding: 15px 25px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  opacity: 0;
  transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.not-relevant-animation img {
  width: 80px;
  height: 80px;
  animation: pulse 1s infinite alternate;
  background: transparent;
  object-fit: contain;
}

.not-relevant-animation .animation-text {
  font-size: 24px;
  font-weight: bold;
  white-space: nowrap;
}

/* 共用的動畫類 */
.wrong-animation.show,
.not-relevant-animation.show {
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 1;
}

.wrong-animation.exit,
.not-relevant-animation.exit {
  left: 120%;
  opacity: 0;
}
</style>
