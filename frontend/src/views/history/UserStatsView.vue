<template>
  <div class="user-stats-view">
    <div class="header">
      <router-link to="/history" class="back-link">
        <span class="back-icon">←</span> 返回遊戲記錄
      </router-link>
      <h1>遊戲統計</h1>
    </div>

    <div v-if="!isLoggedIn" class="login-prompt">
      <p>請登入以查看您的遊戲統計數據。</p>
      <router-link to="/login" class="btn-login">
        登入
      </router-link>
    </div>

    <div v-else class="stats-container">
      <user-stats-card />

      <div class="stats-charts">
        <div class="chart-container">
          <h3>遊玩歷史</h3>
          <div class="chart-placeholder">
            <!-- 這裡可以用實際的圖表庫如Chart.js替換 -->
            <div class="placeholder-chart"></div>
            <p>顯示您隨時間的遊戲記錄</p>
          </div>
        </div>

        <div class="chart-container">
          <h3>分數分布</h3>
          <div class="chart-placeholder">
            <!-- 這裡可以用實際的圖表庫如Chart.js替換 -->
            <div class="placeholder-chart pie"></div>
            <p>按類別顯示您的分數分布</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useUserStore } from '@/stores/user.js';
import UserStatsCard from './components/UserStatsCard.vue';

const userStore = useUserStore();
const isLoggedIn = computed(() => !!userStore.userInfo?.user?.id);
</script>

<style scoped>
.user-stats-view {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.user-stats-view h1 {
  text-align: center;
  margin-bottom: 40px;
  color: #333;
}

.stats-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.stats-charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.chart-container {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.chart-container h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

.chart-placeholder {
  background-color: #f8f8f8;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #666;
}

.placeholder-chart {
  width: 100%;
  height: 120px;
  background: linear-gradient(90deg, #e0f7fa, #b2ebf2, #80deea, #b2ebf2, #e0f7fa);
  background-size: 400% 400%;
  animation: gradient 5s ease infinite;
  border-radius: 8px;
  margin-bottom: 16px;
}

.placeholder-chart.pie {
  border-radius: 50%;
  width: 120px;
  height: 120px;
  background: conic-gradient(
    #4fc3f7 0% 25%,
    #29b6f6 25% 50%,
    #03a9f4 50% 70%,
    #039be5 70% 100%
  );
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.login-prompt {
  background-color: #f8f8f8;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  color: #666;
  margin-top: 20px;
}

.login-prompt p {
  margin-bottom: 20px;
}

.btn-login {
  background-color: #2196F3;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
}

.btn-login:hover {
  background-color: #1e88e5;
}


.header {
  margin-bottom: 30px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  color: #0097a7;
  text-decoration: none;
  font-weight: 600;
  margin-bottom: 10px;
}
.back-link:hover {
  text-decoration: underline;
}

.back-icon {
  margin-right: 8px;
  font-size: 18px;
}

h1 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 24px;
}
</style>
