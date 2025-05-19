<template>
  <div class="records-view">
    <div class="header">
      <router-link to="/history" class="back-link">
        <span class="back-icon">←</span> 返回遊戲記錄
      </router-link>
      <h1>遊戲紀錄</h1>
    </div>

    <div v-if="!isLoggedIn" class="login-prompt">
      <p>請登入以查看您的遊戲記錄。</p>
    </div>

    <game-records-list v-else />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useUserStore } from '@/stores/user';
import GameRecordsList from './components/GameRecordList.vue';

const userStore = useUserStore();
// 修改以適應 userInfo.user.id 的結構
const isLoggedIn = computed(() => !!userStore.userInfo?.user?.id);
</script>

<style scoped>
.records-view {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.header h1 {
  margin: 0;
  color: #333;
}

.login-prompt {
  background-color: #f8f8f8;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  color: #666;
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
