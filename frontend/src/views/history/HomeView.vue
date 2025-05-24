<template>
  <header class="main-header">
    <div class="container">
      <h1 class="logo">
        <RouterLink to="/">請喝湯</RouterLink>
      </h1>
      <RouterLink class="enter-button" to="/home">
        進入大廳
        <i class="iconfont icon-angle-right"></i>
        <i class="iconfont icon-angle-right"></i>
      </RouterLink>
    </div>
  </header>
  <div class="home">
    <div class="hero-section">
      <h1>龜湯遊戲記錄</h1>
      <p>追蹤您的進度、與其他玩家競爭並提升您的技能！</p>

      <div class="action-buttons">
        <router-link to="/stats" class="btn btn-primary" >
          查看遊戲統計
        </router-link>
        <router-link to="/leaderboard" class="btn btn-accent">
          排行榜
        </router-link>
      </div>
    </div>

    <div class="user-greeting">
      <h2>您好，{{ username }}!</h2>
      <p>最近更新時間: {{ formattedDate }}</p>
    </div>

    <div class="recent-games">
      <h2>最近遊戲</h2>

      <div v-if="loading" class="loading">
        <span class="loader"></span> 正在加載記錄...
      </div>

      <template v-else>
        <game-record-item
          v-for="record in recentRecords"
          :key="record.id"
          :record="record"
          @view="viewRecord"
        />

        <div v-if="recentRecords.length === 0" class="no-records-message">
          <p>您還沒有玩過任何遊戲。</p>
          <router-link to="/" class="btn btn-primary">開始遊戲</router-link>
        </div>

        <router-link to="/records" class="view-all-link" v-if="recentRecords.length > 0">
          查看全部記錄 →
        </router-link>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useGameRecordStore } from '@/stores/gameRecordStore';
import { useUserStore } from '@/stores/user';
import UserStatsCard from './components/UserStatsCard.vue';
import GameRecordItem from './components/GameRecordItem.vue';

const gameRecordStore = useGameRecordStore();
const userStore = useUserStore();
const router = useRouter();

const loading = computed(() => gameRecordStore.loading);

// 嘗試從 userInfo 獲取用戶名
const username = computed(() => {
  const userInfo = userStore.userInfo;
  return userInfo?.username || userInfo?.name || '';
});

// 獲取當前日期和時間
const formattedDate = ref(new Date().toLocaleString('zh-TW'));

// 獲取3條最近的遊戲記錄
const recentRecords = computed(() => {
  return gameRecordStore.userRecords
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);
});

onMounted(async () => {
  try {
    await gameRecordStore.fetchUserRecords();
    await gameRecordStore.fetchUserStats();
  } catch (error) {
    console.error('獲取數據失敗:', error);
  }
});

// 查看記錄詳情
const viewRecord = (id) => {
  router.push(`/records/${id}`);
};
</script>

<style scoped>
.home {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.hero-section {
  text-align: center;
  padding: 60px 20px;
  margin-bottom: 40px;
  background-image: linear-gradient(120deg, #e0f7fa, #b2ebf2);
  border-radius: 12px;
  color: #006064;
}

.hero-section h1 {
  font-size: 2.5rem;
  margin-bottom: 16px;
}

.hero-section p {
  font-size: 1.2rem;
  margin-bottom: 32px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.user-greeting {
  text-align: center;
  margin-bottom: 20px;
}

.user-greeting h2 {
  color: #333;
  margin-bottom: 8px;
}

.user-greeting p {
  color: #666;
  font-size: 0.9rem;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.btn {
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #0097a7;
  color: white;
}

.btn-secondary {
  background-color: white;
  color: #0097a7;
  border: 2px solid #0097a7;
}

.btn-accent {
  background-color: #ff6f00;
  color: white;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.recent-games {
  margin-top: 40px;
}

.recent-games h2 {
  margin-bottom: 20px;
  color: #333;
}

.view-all-link {
  display: inline-block;
  margin-top: 20px;
  color: #0097a7;
  font-weight: 600;
  text-decoration: none;
}

.no-records-message {
  text-align: center;
  padding: 40px;
  background-color: #f8f8f8;
  border-radius: 8px;
  margin-top: 20px;
}

.no-records-message p {
  margin-bottom: 20px;
  color: #666;
}

.welcome-section {
  margin-top: 40px;
  padding: 40px;
  text-align: center;
  background-color: #f8f8f8;
  border-radius: 8px;
}

.welcome-section h2 {
  margin-bottom: 20px;
  color: #333;
}

.welcome-section p {
  margin-bottom: 30px;
  color: #555;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.welcome-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.loading {
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
