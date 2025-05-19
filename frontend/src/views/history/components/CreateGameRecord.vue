<template>
  <div class="create-record-container">
    <h3>創建遊戲記錄</h3>

    <form @submit.prevent="submitForm" class="record-form">
      <div class="form-group">
        <label for="questionId">問題ID</label>
        <input
          type="number"
          id="questionId"
          v-model="formData.questionId"
          required
        />
      </div>

      <div class="form-group">
        <label for="score">分數</label>
        <input
          type="number"
          id="score"
          v-model="formData.score"
          required
        />
      </div>

      <div class="form-group">
        <label for="userAnswer">你的答案</label>
        <textarea
          id="userAnswer"
          v-model="formData.userAnswer"
          rows="4"
          required
        ></textarea>
      </div>

      <div class="form-group">
        <label for="timeSpent">花費時間（秒）</label>
        <input
          type="number"
          id="timeSpent"
          v-model="formData.timeSpent"
          required
        />
      </div>

      <div class="form-group checkbox">
        <input
          type="checkbox"
          id="isCompleted"
          v-model="formData.isCompleted"
        />
        <label for="isCompleted">已完成</label>
      </div>

      <div class="form-actions">
        <button
          type="submit"
          class="btn-submit"
          :disabled="loading"
        >
          <span v-if="loading">保存中...</span>
          <span v-else>保存記錄</span>
        </button>
        <button
          type="button"
          class="btn-cancel"
          @click="$emit('cancel')"
          :disabled="loading"
        >
          取消
        </button>
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useGameRecordStore } from '@/stores/gameRecordStore';
import { useUserStore } from '@/stores/userStore';

const gameRecordStore = useGameRecordStore();
const userStore = useUserStore();
const emit = defineEmits(['success', 'cancel']);

const loading = computed(() => gameRecordStore.loading);
const error = computed(() => gameRecordStore.error);

const formData = ref({
  questionId: '',
  score: 0,
  userAnswer: '',
  timeSpent: 0,
  isCompleted: false
});

const submitForm = async () => {
  try {
    // 把用戶ID加入表單數據，因為我們在後端需要用戶ID，但前端可能沒有auth中間件
    const userId = userStore.userInfo?.id;

    if (!userId) {
      throw new Error('未登入或無法獲取用戶ID');
    }

    await gameRecordStore.createGameRecord({
      ...formData.value,
      userId // 顯式添加userId到請求中
    });

    emit('success');

    // 重置表單
    formData.value = {
      questionId: '',
      score: 0,
      userAnswer: '',
      timeSpent: 0,
      isCompleted: false
    };
  } catch (error) {
    console.error('無法創建記錄:', error);
  }
};
</script>

<style scoped>
.create-record-container {
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
}

.create-record-container h3 {
  margin-top: 0;
  margin-bottom: 24px;
  color: #333;
}

.record-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 6px;
  font-weight: 600;
  color: #555;
}

.form-group input,
.form-group textarea {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.form-group.checkbox {
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  font-size: 16px;
}

.btn-submit {
  background-color: #4CAF50;
  color: white;
  flex: 1;
}

.btn-cancel {
  background-color: #f5f5f5;
  color: #333;
}

button:hover {
  opacity: 0.9;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  color: #d32f2f;
  background-color: #ffebee;
  padding: 10px;
  border-radius: 4px;
  font-size: 14px;
}
</style>
