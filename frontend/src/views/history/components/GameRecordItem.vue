<template>
  <div class="game-record-item" :class="{ 'completed': record.isCompleted }">
    <div class="game-record-header">
      <h3>Question #{{ record.questionId }}</h3>
      <span class="score">{{ record.score }} points</span>
    </div>

    <div class="game-record-details">
      <div class="detail-row">
        <span class="label">完成狀態:</span>
        <span class="value">{{ record.isCompleted ? '已完成' : '未完成' }}</span>
      </div>

      <div class="detail-row">
        <span class="label">花費時間:</span>
        <span class="value">{{ formatTime(record.timeSpent) }}</span>
      </div>

      <div class="detail-row">
        <span class="label">日期:</span>
        <span class="value">{{ formatDate(record.createdAt) }}</span>
      </div>
    </div>

    <div class="game-record-answer" v-if="showAnswer">
      <h4>你的答案:</h4>
      <p>{{ record.userAnswer }}</p>
    </div>

    <div class="game-record-actions">
      <button class="btn-view" @click="$emit('view', record.id)">查看詳情</button>
      <button class="btn-edit" @click="$emit('edit', record.id)" v-if="!record.isCompleted">
        更新
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  record: {
    type: Object,
    required: true
  },
  showAnswer: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['view', 'edit']);

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}分 ${remainingSeconds}秒`;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-TW') + ' ' + date.toLocaleTimeString('zh-TW');
};
</script>

<style scoped>
.game-record-item {
  background-color: #f8f8f8;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.game-record-item.completed {
  border-left: 4px solid #4CAF50;
}

.game-record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.game-record-header h3 {
  margin: 0;
  font-size: 18px;
}

.score {
  font-weight: bold;
  color: #ff6f00;
  font-size: 18px;
}

.game-record-details {
  margin-bottom: 16px;
}

.detail-row {
  display: flex;
  margin-bottom: 8px;
}

.label {
  font-weight: 600;
  width: 100px;
  color: #555;
}

.game-record-answer {
  background-color: #f0f0f0;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.game-record-answer h4 {
  margin-top: 0;
  margin-bottom: 8px;
  font-size: 16px;
}

.game-record-actions {
  display: flex;
  gap: 12px;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

.btn-view {
  background-color: #2196F3;
  color: white;
}

.btn-edit {
  background-color: #FF9800;
  color: white;
}

button:hover {
  opacity: 0.9;
}
</style>
