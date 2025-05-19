<template>
  <div class="game-records-list">
    <div class="list-header">
      <h2>遊戲記錄</h2>
      <div class="filters">
        <select v-model="completionFilter">
          <option value="all">全部記錄</option>
          <option value="completed">已完成</option>
          <option value="incomplete">未完成</option>
        </select>

        <select v-model="sortOption">
          <option value="newest">最新優先</option>
          <option value="oldest">最舊優先</option>
          <option value="highScore">高分優先</option>
          <option value="lowScore">低分優先</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <span class="loader"></span> 正在加載記錄...
    </div>

    <div v-else-if="filteredRecords.length === 0" class="no-records">
      <p>沒有找到遊戲記錄。</p>
    </div>

    <div v-else class="records-container">
      <game-record-item
        v-for="record in filteredRecords"
        :key="record.id"
        :record="record"
        @view="viewRecord"
        @edit="editRecord"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useGameRecordStore } from '@/stores/gameRecordStore';
import { useUserStore } from '@/stores/user';
import GameRecordItem from './GameRecordItem.vue';

const gameRecordStore = useGameRecordStore();
const userStore = useUserStore();
const router = useRouter();

const loading = computed(() => gameRecordStore.loading);
const completionFilter = ref('all');
const sortOption = ref('newest');

// 當組件掛載時加載遊戲記錄
onMounted(async () => {
  if (userStore.userInfo?.id) {
    try {
      await gameRecordStore.fetchUserRecords();
    } catch (error) {
      console.error('無法獲取遊戲記錄:', error);
    }
  }
});

// 監聽用戶登入狀態，當用戶登入後重新獲取記錄
watch(() => userStore.userInfo?.id, async (newValue) => {
  if (newValue) {
    try {
      await gameRecordStore.fetchUserRecords();
    } catch (error) {
      console.error('無法獲取遊戲記錄:', error);
    }
  }
});

// 過濾和排序記錄
const filteredRecords = computed(() => {
  let records = [...gameRecordStore.userRecords];

  // 應用完成狀態過濾
  if (completionFilter.value === 'completed') {
    records = records.filter(record => record.isCompleted);
  } else if (completionFilter.value === 'incomplete') {
    records = records.filter(record => !record.isCompleted);
  }

  // 應用排序
  switch (sortOption.value) {
    case 'newest':
      records.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case 'oldest':
      records.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      break;
    case 'highScore':
      records.sort((a, b) => b.score - a.score);
      break;
    case 'lowScore':
      records.sort((a, b) => a.score - b.score);
      break;
  }

  return records;
});

// 查看記錄詳情
const viewRecord = (id) => {
  router.push(`/records/${id}`);
};

// 編輯記錄
const editRecord = (id) => {
  router.push(`/records/${id}/edit`);
};
</script>

<style scoped>
.game-records-list {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.list-header h2 {
  margin: 0;
  color: #333;
}

.filters {
  display: flex;
  gap: 12px;
}

.filters select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}

.no-records {
  text-align: center;
  padding: 40px;
  background-color: #f8f8f8;
  border-radius: 8px;
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
