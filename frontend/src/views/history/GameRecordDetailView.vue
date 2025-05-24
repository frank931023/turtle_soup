<template>
  <div class="record-detail-view">
    <div class="container">
      <div class="header">
        <router-link to="/history" class="back-link">
          <span class="back-icon">←</span> 返回遊戲記錄
        </router-link>
        <h1>遊戲記錄詳情</h1>
      </div>

      <div v-if="loading" class="loading">
        <span class="loader"></span> 正在加載記錄...
      </div>

      <div v-else-if="error" class="error-message">
        <p>{{ error }}</p>
        <button @click="fetchRecord" class="btn-retry">重試</button>
      </div>

      <div v-else-if="!record" class="not-found">
        <h2>找不到該遊戲記錄</h2>
        <p>可能記錄已刪除或ID不正確</p>
        <router-link to="/gameRecords" class="btn-primary">查看所有記錄</router-link>
      </div>

      <div v-else class="record-detail-card">
        <div class="record-header">
          <div class="record-title">
            <h2>問題 #{{ record.questionId }}</h2>
            <span class="badge" :class="record.isCompleted ? 'completed' : 'incomplete'">
              {{ record.isCompleted ? '已完成' : '未完成' }}
            </span>
          </div>
          <div class="record-score">
            <span class="score-value">{{ record.score }}</span>
            <span class="score-label">分數</span>
          </div>
        </div>

        <div class="record-info">
          <div class="info-item">
            <span class="label">創建時間:</span>
            <span class="value">{{ formatDate(record.createdAt) }}</span>
          </div>
          <div class="info-item">
            <span class="label">花費時間:</span>
            <span class="value">{{ formatTime(record.timeSpent) }}</span>
          </div>
          <div class="info-item">
            <span class="label">問題ID:</span>
            <span class="value">{{ record.questionId }}</span>
          </div>
          <div class="info-item">
            <span class="label">記錄ID:</span>
            <span class="value">{{ record.id }}</span>
          </div>
        </div>

        <div class="answer-section">
          <h3>您的答案</h3>
          <div class="answer-content">
            {{ record.userAnswer }}
          </div>
        </div>

        <div class="actions">

          <button @click="goToQuestion" class="btn-view-question">
            查看問題
          </button>
        </div>
      </div>
    </div>

    <!-- 編輯模態框 -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h3>更新遊戲記錄</h3>
          <button @click="closeEditModal" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="updateRecord" class="edit-form">
            <div class="form-group">
              <label for="score">分數</label>
              <input
                type="number"
                id="score"
                v-model="editForm.score"
                required
              />
            </div>

            <div class="form-group">
              <label for="timeSpent">花費時間（秒）</label>
              <input
                type="number"
                id="timeSpent"
                v-model="editForm.timeSpent"
                required
              />
            </div>

            <div class="form-group checkbox">
              <input
                type="checkbox"
                id="isCompleted"
                v-model="editForm.isCompleted"
              />
              <label for="isCompleted">已完成</label>
            </div>

            <div class="form-actions">
              <button
                type="submit"
                class="btn-submit"
                :disabled="updating"
              >
                {{ updating ? '更新中...' : '更新' }}
              </button>
              <button
                type="button"
                class="btn-cancel"
                @click="closeEditModal"
                :disabled="updating"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGameRecordStore } from '@/stores/gameRecordStore.js';

const route = useRoute();
const router = useRouter();
const gameRecordStore = useGameRecordStore();

const recordId = computed(() => route.params.id);
const record = computed(() => gameRecordStore.currentRecord);
const loading = computed(() => gameRecordStore.loading);
const error = computed(() => gameRecordStore.error);

// 編輯相關狀態
const showEditModal = ref(false);
const editForm = ref({
  score: 0,
  timeSpent: 0,
  isCompleted: false
});
const updating = ref(false);

// 獲取記錄詳情
const fetchRecord = async () => {
  try {
    await gameRecordStore.fetchGameRecord(recordId.value);
  } catch (err) {
    console.error('獲取遊戲記錄失敗:', err);
  }
};

// 監視路由參數變化，重新獲取記錄
watch(recordId, (newId, oldId) => {
  if (newId !== oldId) {
    fetchRecord();
  }
}, { immediate: true });

onMounted(() => {
  fetchRecord();
});

// 初始化編輯表單
const initEditForm = () => {
  if (record.value) {
    editForm.value = {
      score: record.value.score,
      timeSpent: record.value.timeSpent,
      isCompleted: record.value.isCompleted
    };
  }
};

// 打開編輯模態框
const openEditModal = () => {
  initEditForm();
  showEditModal.value = true;
};

// 關閉編輯模態框
const closeEditModal = () => {
  showEditModal.value = false;
};

// 更新遊戲記錄
const updateRecord = async () => {
  updating.value = true;
  try {
    await gameRecordStore.updateGameRecord(recordId.value, editForm.value);
    closeEditModal();
  } catch (err) {
    console.error('更新遊戲記錄失敗:', err);
  } finally {
    updating.value = false;
  }
};

// 跳轉到問題頁面
const goToQuestion = () => {
  if (record.value && record.value.questionId) {
    router.push(`/game?id=/${record.value.questionId}`);
  }
};

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

// 格式化時間（秒）
const formatTime = (seconds) => {
  if (!seconds && seconds !== 0) return '';

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}分 ${remainingSeconds}秒`;
};
</script>

<style scoped>
.record-detail-view {
  padding: 20px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
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

.back-icon {
  margin-right: 8px;
  font-size: 18px;
}

.back-link:hover {
  text-decoration: underline;
}

h1 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 24px;
}

.loading, .error-message, .not-found {
  text-align: center;
  padding: 40px;
  background-color: #f8f8f8;
  border-radius: 8px;
  margin-top: 20px;
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

.error-message {
  color: #d32f2f;
}

.btn-retry {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  margin-top: 16px;
  cursor: pointer;
}

.record-detail-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.record-header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.record-title {
  display: flex;
  align-items: center;
}

.record-title h2 {
  margin: 0;
  margin-right: 12px;
}

.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.completed {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.incomplete {
  background-color: #ffebee;
  color: #c62828;
}

.record-score {
  text-align: center;
}

.score-value {
  font-size: 24px;
  font-weight: bold;
  color: #ff6f00;
  display: block;
}

.score-label {
  font-size: 14px;
  color: #666;
}

.record-info {
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.info-item {
  display: flex;
  margin-bottom: 12px;
}

.info-item .label {
  width: 100px;
  font-weight: 600;
  color: #555;
}

.answer-section {
  padding: 20px;
}

.answer-section h3 {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 18px;
  color: #333;
}

.answer-content {
  background-color: #f9f9f9;
  padding: 16px;
  border-radius: 4px;
  white-space: pre-wrap;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.actions {
  padding: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid #eee;
}

.btn-primary, .btn-edit, .btn-view-question {
  padding: 10px 16px;
  border-radius: 4px;
  border: none;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary {
  background-color: #0097a7;
  color: white;
  text-decoration: none;
}

.btn-edit {
  background-color: #ff9800;
  color: white;
}

.btn-view-question {
  background-color: #2196f3;
  color: white;
}

/* 編輯模態框樣式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 20px;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.checkbox {
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.form-group label {
  margin-bottom: 8px;
  font-weight: 600;
  color: #555;
}

.form-group input[type="number"],
.form-group input[type="text"] {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.btn-submit, .btn-cancel {
  padding: 10px 16px;
  border-radius: 4px;
  border: none;
  font-weight: 600;
  cursor: pointer;
}

.btn-submit {
  background-color: #4caf50;
  color: white;
  flex: 1;
}

.btn-cancel {
  background-color: #f5f5f5;
  color: #333;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* 響應式調整 */
@media (max-width: 600px) {
  .record-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .record-score {
    align-self: flex-end;
  }

  .info-item {
    flex-direction: column;
  }

  .info-item .label {
    width: 100%;
    margin-bottom: 4px;
  }
}
</style>
