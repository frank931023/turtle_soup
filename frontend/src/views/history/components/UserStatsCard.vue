<template>
  <div class="user-stats-container">
    <h3>遊戲統計</h3>

    <div v-if="loading" class="loading">
      <span class="loader"></span> 正在加載統計...
    </div>

    <div v-else-if="!stats" class="no-stats">
      <p>沒有可用的統計數據。開始玩遊戲以查看您的統計數據！</p>
    </div>

    <div v-else class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">{{ stats.totalScore || 0 }}</div>
        <div class="stat-label">總分數</div>
      </div>

      <div class="stat-card">
        <div class="stat-value">{{ stats.gamesPlayed || 0 }}</div>
        <div class="stat-label">已玩遊戲</div>
      </div>

      <div class="stat-card">
        <div class="stat-value">{{ stats.completedGames || 0 }}</div>
        <div class="stat-label">已完成遊戲</div>
      </div>

      <div class="stat-card">
        <div class="stat-value">{{ formatTime(stats.avgTimeSpent || 0) }}</div>
        <div class="stat-label">平均時間</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
import { useGameRecordStore } from '@/stores/gameRecordStore';
import { useUserStore } from '@/stores/user';

const gameRecordStore = useGameRecordStore();
const userStore = useUserStore();

const loading = computed(() => gameRecordStore.loading);
const stats = computed(() => gameRecordStore.userStats);

onMounted(async () => {
  if (userStore.userInfo?.id) {
    try {
      await gameRecordStore.fetchUserStats();
    } catch (error) {
      console.error('無法獲取用戶統計:', error);
    }
  }
});

// 監聽用戶登入狀態
watch(() => userStore.userInfo?.id, async (newValue) => {
  if (newValue) {
    try {
      await gameRecordStore.fetchUserStats();
    } catch (error) {
      console.error('無法獲取用戶統計:', error);
    }
  }
});

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return `${minutes}分 ${remainingSeconds}秒`;
};
</script>

<style scoped>
.user-stats-container {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.user-stats-container h3 {
  text-align: center;
  color: #333;
  margin-top: 0;
  margin-bottom: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.stat-card {
  background-color: #f8f8f8;
  border-radius: 6px;
  padding: 16px;
  text-align: center;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #2196F3;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.loading, .no-stats {
  text-align: center;
  padding: 20px;
  color: #666;
}

.loader {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #2196F3;
  animation: spin 1s ease infinite;
  margin-right: 10px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
