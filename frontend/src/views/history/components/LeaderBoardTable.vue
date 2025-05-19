<template>
  <div class="leaderboard-container">
    <h2>全球排行榜</h2>

    <div v-if="loading" class="loading">
      <span class="loader"></span> 正在加載排行榜...
    </div>

    <table v-else class="leaderboard-table">
      <thead>
      <tr>
        <th>排名</th>
        <th>用戶</th>
        <th>總分數</th>
        <th>已玩遊戲</th>
        <th>平均分數</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(player, index) in leaderboard" :key="index"
          :class="{ 'current-user': player.userId === currentUserId }">
        <td class="rank-cell">
          <span class="rank">{{ index + 1 }}</span>
        </td>
        <td>{{ player.username || `用戶 #${player.userId}` }}</td>
        <td>{{ player.totalScore }}</td>
        <td>{{ player.gamesPlayed }}</td>
        <td>{{ calculateAverage(player.totalScore, player.gamesPlayed) }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useGameRecordStore } from '@/stores/gameRecordStore';
import { useUserStore } from '@/stores/user';

const gameRecordStore = useGameRecordStore();
const userStore = useUserStore();

const loading = computed(() => gameRecordStore.loading);
const leaderboard = computed(() => gameRecordStore.leaderboard);
const currentUserId = computed(() => userStore.userInfo?.id);

onMounted(async () => {
  try {
    await gameRecordStore.fetchLeaderboard();
  } catch (error) {
    console.error('無法獲取排行榜:', error);
  }
});

const calculateAverage = (totalScore, gamesPlayed) => {
  if (!gamesPlayed) return '0';
  const avg = totalScore / gamesPlayed;
  return avg.toFixed(1);
};
</script>

<style scoped>
.leaderboard-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.leaderboard-container h2 {
  text-align: center;
  color: #333;
  margin-bottom: 24px;
}

.leaderboard-table {
  width: 100%;
  border-collapse: collapse;
}

.leaderboard-table th, .leaderboard-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.leaderboard-table th {
  background-color: #f5f5f5;
  font-weight: 600;
}

.rank-cell {
  width: 80px;
}

.rank {
  display: inline-block;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #eee;
  color: #333;
  text-align: center;
  line-height: 30px;
  font-weight: bold;
}

tr:nth-child(1) .rank {
  background-color: #FFD700;
  color: white;
}

tr:nth-child(2) .rank {
  background-color: #C0C0C0;
  color: white;
}

tr:nth-child(3) .rank {
  background-color: #CD7F32;
  color: white;
}

.current-user {
  background-color: #e3f2fd;
}

.loading {
  text-align: center;
  padding: 40px;
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
