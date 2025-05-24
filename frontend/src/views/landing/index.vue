<template>
  <div class="container">
    <div class="title-container" v-if="!showDetails">
      <img src="@/assets/title.jpg" alt="海龜湯" class="title-img">
    </div>
    <div v-if="!showDetails" class="button-container">
      <button class="learn-more-btn pulse" @click="toggleDetails">了解更多</button>
      <div class="blood-container">
        <div class="blood-drop blood-1"></div>
        <div class="blood-drop blood-2"></div>
        <div class="blood-drop blood-3"></div>
      </div>
    </div>

    <div v-if="showDetails" class="content-wrapper">
      <div class="text-container fade-in">
        <h1 class="title">海龜湯遊戲</h1>
        <p class="text">
          你知道海龜湯嗎？它又叫做水平思考。題目首先給你故事結局，也就是「湯麵」，你必須使用跳躍性、超凡的創造力提出猜想，讓這個故事自圓其說，找到「湯底」。
        </p>
        <p class="text">
          海龜湯沒有標準答案，你可以不斷提問來驗證你的猜想，但 AI 只會回答 是/不是/不相關，你有 8 次提問機會，耗盡後會公布答案，助你好運！
        </p>
        <div class="warning">
          ⚠️ 注意：部分故事包含恐怖／血腥元素，膽小慎入。
        </div>
        <button class="close-btn" @click="toggleDetails">關閉</button>
      </div>
    </div>
    <div class="start-button-container" v-if="!showDetails">
    <button class="start-button" @click="startGame">
      <span class="button-text">START THE GAME</span>
      <img class="handprint" src="@/assets/handprint.png" alt="blood handprint" />
    </button>
  </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const showDetails = ref(false);
const router = useRouter();
const showHandprint = ref(false);

const toggleDetails = () => {
  showDetails.value = !showDetails.value;
};

const startGame = () => {
  showHandprint.value = true;

  // 1秒後跳轉到 HomePage
  setTimeout(() => {
    router.push('/home'); // 使用路由跳轉到 home 頁面
  }, 300); // 300毫秒後跳轉
};

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Creepster&display=swap');
@import url('https://fonts.googleapis.com/css2?family=ZCOOL+KuaiLe&display=swap');
.container {
  background-image: url('@/assets/landingback.png'); /* 背景圖片 */
  background-size: cover;
  background-position: 30% 40%;
  background-blend-mode: overlay;
  color: white;
  padding: 5% 7%;
  font-family: "Noto Sans TC", sans-serif;
  width: 100%;
  min-height: 100vh;
  position: relative;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start; /* 將內容靠左 */
}

.title-container {
  position: absolute;
  top: 35%;
  left: 6%;
  z-index: 20;
}

.title-img {
  max-width: 250px;
  height: auto;
}


.button-container {
  position: absolute;
  bottom: 30%;
  left: 11%;
  filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.5));
}


.character-img {
  height: 120px; /* 調整圖片尺寸 */
  width: auto;
  object-fit: contain;
}

.learn-more-btn {
  background-color: #9a0000; /* 深紅色按鈕 */
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  position: relative;
  z-index: 10;
}

.learn-more-btn:hover {
  background-color: #700000;
  transform: translateY(-2px);
}

/* 按鈕脈動效果 */
.pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(245, 158, 11, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(245, 158, 11, 0);
  }
}

/* 文字容器淡入效果 */
.fade-in {
  animation: fadeIn 0.6s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.close-btn {
  background-color: #4b5563;
  color: white;
  border: none;
  padding: 8px 16px;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 1.5rem;
  display: block;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background-color: #374151;
  transform: translateY(-1px);
}

.content-wrapper {
  max-width: 450px;
  text-align: left;
}

.text-container {
  background-color: rgba(55, 65, 81, 0.8); /* 灰色半透明背景 */
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.title {
  color: #f59e0b; /* 金黃色 */
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.text {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.warning {
  background-color: rgba(127, 29, 29, 0.8);
  color: #fcd34d;
  border: 2px solid #fca5a5;
  padding: 1rem;
  border-radius: 8px;
  font-weight: bold;
  margin-top: 1.5rem;
}
.blood-container {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  height: 60px;
  pointer-events: none;
  z-index: 5;
}

/* 血滴樣式 */
.blood-drop {
  position: absolute;
  top: -5px;
  background-image: url('@/assets/blood.png'); /* 血滴圖片 */
  background-size: contain;
  background-repeat: no-repeat;
  width: 30px;
  height: 60px;
  filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.7));
}

.blood-1 {
  left: 5%;
  animation: dripping 5s infinite ease-in;
}

.blood-2 {
  left: 40%;
  animation: dripping 5.5s infinite ease-in 0.7s;
}

.blood-3 {
  left: 70%;
  animation: dripping 6s infinite ease-in 1.5s;
}

.start-button-container {
  position: absolute;
  bottom: 8%; /* 距離底部的距離 */
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 15;
}

.start-button {
  background-color: #000000;
  border: 3px solid #5b1f17; /* 深紅邊框 */
  color: #e8dcc6; /* 米白文字 */
  font-size: 1.6rem; /* 增大字體 */
  font-weight: bold;
  padding: 1rem 2.5rem; /* 增大內邊距 */
  border-radius: 14px; /* 稍微增加圓角 */
  cursor: pointer;
  position: relative;
  overflow: visible; /* 允許內容超出按鈕 */
  font-family: 'Arial Black', sans-serif;
  letter-spacing: 1px;
  transition: transform 0.2s ease;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.5); /* 增強陰影效果 */
  min-width: 260px; /* 確保最小寬度 */
}

.start-button:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6); /* 懸停時增強陰影 */
}

.button-text {
  position: relative;
  z-index: 20; /* 確保文字在手印上方 */
}

.handprint {
  position: absolute;
  bottom: 5px;
  right: 5px;
  height: 80%; /* 調整手印大小以配合更大的按鈕 */
  width: auto;
  opacity: 0.7;
  pointer-events: none;
  transform: rotate(10deg);
  z-index: 10;
}

@media screen and (max-width: 768px) {
  .start-button {
    font-size: 1.4rem;
    padding: 0.9rem 2.2rem;
    min-width: 240px;
  }
}

@media screen and (max-width: 480px) {
  .start-button-container {
    bottom: 5%;
  }

  .start-button {
    font-size: 1.2rem;
    padding: 0.8rem 2rem;
    min-width: 220px;
  }
}

@media screen and (max-width: 360px) {
  .start-button {
    font-size: 1.1rem;
    padding: 0.7rem 1.8rem;
    min-width: 200px;
  }
}

@keyframes dripping {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  50% {
    transform: translateY(20px);
    opacity: 0.5;
  }
  100% {
    transform: translateY(40px);
    opacity: 0;
  }
}
@media screen and (max-width: 1024px) {
  .title-img {
    max-width: 200px;
  }

  .title {
    font-size: 2.2rem;
  }

  .text {
    font-size: 1rem;
  }

  .content-wrapper {
    max-width: 400px;
  }

  .learn-more-btn {
    font-size: 1.1rem;
    padding: 10px 20px;
  }
}
@media screen and (max-width: 768px) {
  .title-img {
    max-width: 150px;
  }

  .title {
    font-size: 1.8rem;
  }

  .text {
    font-size: 0.9rem;
  }

  .content-wrapper {
    max-width: 350px;
  }

  .learn-more-btn {
    font-size: 1rem;
    padding: 8px 16px;
  }
}

@media screen and (max-width: 768px) {
  .container {
    padding: 5% 5%;
  }

  .title-container {
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
  }

  .title-img {
    max-width: 180px;
  }

  .button-container {
    bottom: 20%;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
  }
  .content-wrapper {
    max-width: 90%;
    margin: 0 auto;
  }

  .title {
    font-size: 2rem;
  }

  .blood-drop {
    width: 25px;
    height: 50px;
  }
}
@media screen and (max-width: 480px) {
  .container {
    padding: 10% 5%;
    justify-content: center;
  }

  .title-container {
    top: 15%;
  }

  .title-img {
    max-width: 150px;
  }

  .button-container {
    bottom: 15%;
  }

  .learn-more-btn {
    font-size: 1rem;
    padding: 8px 16px;
  }
  .content-wrapper {
    max-width: 100%;
  }

  .text-container {
    padding: 15px;
  }

  .title {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }

  .text {
    font-size: 0.95rem;
    line-height: 1.5;
  }

  .warning {
    font-size: 0.9rem;
    padding: 0.8rem;
  }

  .close-btn {
    padding: 6px 12px;
    font-size: 0.9rem;
  }
  .blood-drop {
    width: 20px;
    height: 40px;
  }
}

/* 小型手機 */
@media screen and (max-width: 360px) {
  .title-container {
    top: 10%;
  }

  .title-img {
    max-width: 130px;
  }

  .button-container {
    bottom: 10%;
  }

  .learn-more-btn {
    font-size: 0.9rem;
    padding: 7px 14px;
  }
  .title {
    font-size: 1.6rem;
  }

  .text {
    font-size: 0.9rem;
  }
}
</style>
