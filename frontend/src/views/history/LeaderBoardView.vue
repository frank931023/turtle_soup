<template>
  <div class="leaderboard-view">
    <div class="header">
      <router-link to="/history" class="back-link">
        <span class="back-icon">←</span> 返回遊戲記錄
      </router-link>
      <h1>全球排行榜</h1>
    </div>

    <leaderboard-table />
  </div>
</template>

<script setup>
import LeaderboardTable from './components/LeaderboardTable.vue';
</script>

<style scoped>
.leaderboard-view {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.leaderboard-view h1 {
  text-align: center;
  margin-bottom: 40px;
  color: #333;
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
