<template>
  <section class="profile-info">
    <!-- 個人資料卡片 -->
    <VaCard class="profile-card">
      <VaCardContent>
        <!-- 頭像部分 -->
        <div class="profile-header">
          <div class="avatar-wrapper">
            <img
              class="avatar"
              :src="user.avatarUrl || 'https://png.pngtree.com/png-clipart/20230817/original/pngtree-anonymous-user-unidentified-contact-avatar-picture-image_7998127.png'"
              :alt="user.username"
            />
            <div class="score-badge">
              <VaIcon name="star" color="warning" />
              {{ user.totalScore }}
            </div>
          </div>
          <div class="user-info">
            <h2 class="username">{{ user.username }}</h2>
            <el-tag
              :type="user.role === 'admin' ? 'danger' : 'success'"
              class="role-tag"
            >
              {{ user.role }}
            </el-tag>
          </div>
        </div>

        <!-- 個人資料列表 -->
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">
              <VaIcon name="person" color="primary" />
              姓名
            </div>
            <div class="info-value">{{ user.name || '尚未設定' }}</div>
          </div>

          <div class="info-item">
            <div class="info-label">
              <VaIcon name="email" color="primary" />
              Email
            </div>
            <div class="info-value">{{ user.email || '尚未設定' }}</div>
          </div>

          <div class="info-item">
            <div class="info-label">
              <VaIcon name="wc" color="primary" />
              性別
            </div>
            <div class="info-value">{{ formatGender(user.sex) }}</div>
          </div>

          <div class="info-item">
            <div class="info-label">
              <VaIcon name="date_range" color="primary" />
              加入時間
            </div>
            <div class="info-value">{{ formatDate(user.createdAt) }}</div>
          </div>
        </div>
      </VaCardContent>
    </VaCard>

    <!-- 遊戲紀錄卡片 -->
    <VaCard class="game-history-card">
      <VaCardContent>
        <div class="card-header">
          <h3>
            <VaIcon name="sports_esports" color="primary" />
            遊戲紀錄
          </h3>
          <VaButton
            size="small"
            icon="refresh"
            @click="refreshGameHistory"
          >
            刷新
          </VaButton>
        </div>

        <div class="game-records" v-if="user.gameRecords?.length">
          <div
            v-for="(record, index) in user.gameRecords"
            :key="index"
            class="game-record-item"
          >
            <div class="record-info">
              <span class="game-type">{{ record.gameType }}</span>
              <span class="game-score">
                <VaIcon name="star" color="warning" size="small" />
                {{ record.score }}
              </span>
            </div>
            <span class="game-date">{{ formatDate(record.playedAt) }}</span>
          </div>
        </div>
        <div v-else class="empty-records">
          <VaIcon name="sports_esports" size="large" color="secondary" />
          <p>還沒有遊戲紀錄</p>
        </div>
      </VaCardContent>
    </VaCard>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user.js'
import { getProfileAPI } from '@/apis/profile.js'
import { ElMessage } from 'element-plus'
import {
  VaCard,
  VaCardContent,
  VaIcon,
  VaButton
} from 'vuestic-ui'

const userStore = useUserStore()
const user = ref({
  username: '',
  avatarUrl: '',
  totalScore: 0,
  gameRecords: [],
  name: '',
  email: '',
  sex: '',
  role: '',
  createdAt: null
})

const formatDate = (date) => {
  if (!date) return '尚未記錄'
  return new Date(date).toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatGender = (sex) => {
  const genderMap = {
    male: '男',
    female: '女',
    other: '其他'
  }
  return genderMap[sex] || '尚未設定'
}

const refreshGameHistory = async () => {
  try {
    const res = await getProfileAPI(userStore.token)
    user.value.gameRecords = res.user.gameRecords || []
    ElMessage.success('遊戲紀錄已更新')
  } catch (err) {
    ElMessage.error('更新失敗')
  }
}

onMounted(async () => {
  try {
    const res = await getProfileAPI(userStore.token)
    user.value = {
      username: res.user.username,
      avatarUrl: res.user.avatarUrl,
      totalScore: res.user.score,
      gameRecords: res.user.gameRecords || [],
      name: res.user.name,
      sex: res.user.sex,
      email: res.user.email,
      role: res.user.role,
      createdAt: res.user.createdAt
    }
  } catch (err) {
    console.error('取得個人資料失敗', err)
    ElMessage.error('取得個人資料失敗')
  }
})
</script>

<style lang="scss" scoped>
.profile-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile-card,
.game-history-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
}

.avatar-wrapper {
  position: relative;

  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid #f0f0f0;
    background: #f5f5f5;
  }

  .score-badge {
    position: absolute;
    bottom: 0;
    right: 0;
    background: #fff;
    padding: 4px 8px;
    border-radius: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    display: flex;
    align-items: center;
    gap: 4px;
    font-weight: bold;
    color: #ff9f43;
  }
}

.user-info {
  .username {
    font-size: 24px;
    font-weight: 600;
    margin: 0 0 8px 0;
  }

  .role-tag {
    font-size: 0.9rem;
  }
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.info-item {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;

  .info-label {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 8px;
  }

  .info-value {
    font-size: 1.1rem;
    color: #2c3e50;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h3 {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    font-size: 1.2rem;
  }
}

.game-records {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.game-record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #f0f0f0;
    transform: translateX(4px);
  }

  .record-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .game-type {
    font-weight: 500;
  }

  .game-score {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #ff9f43;
  }

  .game-date {
    color: #666;
    font-size: 0.9rem;
  }
}

.empty-records {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 40px;
  color: #999;

  p {
    margin: 0;
  }
}

@media (max-width: 640px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .game-record-item {
    flex-direction: column;
    gap: 8px;
    text-align: center;

    .record-info {
      flex-direction: column;
      gap: 4px;
    }
  }
}
</style>
