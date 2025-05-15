<template>
  <div class="settings-page">
    <VaCard class="settings-card">
      <VaCardContent>
        <!-- 页面标题区域 -->
        <div class="page-header">
          <div class="header-content">
            <h1 class="title">
              <VaIcon name="settings" color="primary" />
              帳號設定
            </h1>
            <p class="subtitle">更新您的帳號資料</p>
          </div>
        </div>

        <!-- 表单区域 -->
        <el-form
          :model="profileForm"
          :rules="rules"
          ref="formRef"
          label-position="top"
          class="settings-form"
        >
          <!-- 头像预览和输入 -->
          <div class="avatar-section">
            <div class="avatar-preview">
              <img
                v-if="previewAvatarUrl"
                :src="previewAvatarUrl"
                alt="Avatar preview"
                class="avatar-image"
                @error="handleAvatarError"
              />
              <div v-else class="avatar-placeholder">
                <img
                  src="https://png.pngtree.com/png-clipart/20230817/original/pngtree-anonymous-user-unidentified-contact-avatar-picture-image_7998127.png"
                  alt="Avatar preview"
                  class="avatar-image"
                  @error="handleAvatarError"
                />
              </div>
            </div>
            <el-form-item label="頭像網址" prop="avatarUrl" class="avatar-input">
              <el-input
                v-model="profileForm.avatarUrl"
                placeholder="請輸入頭像圖片網址"
                @input="handleAvatarUrlChange"
              >
                <template #append>
                  <el-button
                    v-if="profileForm.avatarUrl"
                    @click="resetAvatar"
                    icon="Delete"
                  />
                </template>
              </el-input>
            </el-form-item>
            <!-- 如果URL与原始头像不同，显示还原按钮 -->
            <div v-if="isAvatarChanged" class="avatar-actions">
              <el-button
                size="small"
                @click="restoreOriginalAvatar"
                type="info"
                text
              >
                <VaIcon name="restore" />
                還原原始頭像
              </el-button>
            </div>
          </div>

          <!-- 基本信息表单 -->
          <div class="form-grid">
            <el-form-item label="姓名" prop="name">
              <el-input
                v-model="profileForm.name"
                placeholder="請輸入姓名"
              >
                <template #prefix>
                  <VaIcon name="person" color="primary" />
                </template>
              </el-input>
            </el-form-item>

            <el-form-item label="Email" prop="email">
              <el-input
                v-model="profileForm.email"
                placeholder="請輸入 Email"
              >
                <template #prefix>
                  <VaIcon name="email" color="primary" />
                </template>
              </el-input>
            </el-form-item>

            <el-form-item label="性別" prop="sex">
              <el-select
                v-model="profileForm.sex"
                placeholder="請選擇性別"
                class="w-full"
              >
                <el-option label="男性" value="male">
                  <VaIcon name="male" /> 男性
                </el-option>
                <el-option label="女性" value="female">
                  <VaIcon name="female" /> 女性
                </el-option>
                <el-option label="其他" value="other">
                  <VaIcon name="person" /> 其他
                </el-option>
              </el-select>
            </el-form-item>
          </div>

          <!-- 操作按钮 -->
          <div class="form-actions">
            <VaButton
              preset="secondary"
              icon="refresh"
              @click="resetForm"
            >
              重置
            </VaButton>
            <VaButton
              preset="primary"
              icon="save"
              :loading="submitting"
              @click="submitForm"
            >
              儲存變更
            </VaButton>
          </div>
        </el-form>
      </VaCardContent>
    </VaCard>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user.js'
import { getProfileAPI, setProfileAPI } from '@/apis/profile.js'
import {
  VaCard,
  VaCardContent,
  VaIcon,
  VaButton
} from 'vuestic-ui'

const userStore = useUserStore()
const formRef = ref(null)
const submitting = ref(false)

// 用于预览的头像URL和原始头像URL
const previewAvatarUrl = ref('')
const originalAvatarUrl = ref('')

// 表单数据
const profileForm = reactive({
  avatarUrl: '',
  name: '',
  email: '',
  sex: ''
})

// 表单验证规则
const rules = {
  avatarUrl: [],
  name: [{ required: true, message: '請輸入姓名', trigger: 'blur' }],
  email: [
    { required: true, message: '請輸入 Email', trigger: 'blur' },
    {
      type: 'email',
      message: '請輸入正確的 Email 格式',
      trigger: ['blur', 'change'],
    },
  ],
  sex: [{ required: true, message: '請選擇性別', trigger: 'change' }],
}

// 计算头像是否被修改
const isAvatarChanged = computed(() => {
  return profileForm.avatarUrl !== originalAvatarUrl.value
})

// 处理头像URL变化
const handleAvatarUrlChange = (url) => {
  if (url) {
    const img = new Image()
    img.onload = () => {
      previewAvatarUrl.value = url
    }
    img.onerror = () => {
      previewAvatarUrl.value = originalAvatarUrl.value
      ElMessage.warning('無效的圖片網址')
    }
    img.src = url
  } else {
    previewAvatarUrl.value = originalAvatarUrl.value
  }
}

// 处理头像加载错误
const handleAvatarError = () => {
  previewAvatarUrl.value = originalAvatarUrl.value
  ElMessage.warning('圖片載入失敗')
}

// 重置头像
const resetAvatar = () => {
  profileForm.avatarUrl = ''
  previewAvatarUrl.value = originalAvatarUrl.value
}

// 还原原始头像
const restoreOriginalAvatar = () => {
  profileForm.avatarUrl = originalAvatarUrl.value
  previewAvatarUrl.value = originalAvatarUrl.value
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid, fields) => {
    if (valid) {
      submitting.value = true
      try {
        await setProfileAPI(profileForm, userStore.token)
        // 更新 pinia store 的状态
        Object.assign(userStore.userInfo.user, {
          name: profileForm.name,
          avatarUrl: profileForm.avatarUrl,
          email: profileForm.email,
          sex: profileForm.sex
        })

        ElMessage.success('帳號資料已更新')
      } catch (error) {
        console.error('更新失敗:', error)
        ElMessage.error('提交失敗，請稍後再試!')
      } finally {
        submitting.value = false
      }
    } else {
      ElMessage.warning('請完成所有必填欄位!')
    }
  })
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }

  // 还原为原始数据
  Object.assign(profileForm, {
    avatarUrl: originalAvatarUrl.value,
    name: '',
    email: '',
    sex: '',
  })
  previewAvatarUrl.value = originalAvatarUrl.value
}

// 页面加载时获取用户数据
onMounted(async () => {
  try {
    const res = await getProfileAPI(userStore.token)
    const userData = res.user

    // 设置原始头像URL和预览URL
    originalAvatarUrl.value = userData.avatarUrl || ''
    previewAvatarUrl.value = userData.avatarUrl || ''

    // 设置表单数据
    Object.assign(profileForm, {
      avatarUrl: userData.avatarUrl || '',
      name: userData.name || '',
      email: userData.email || '',
      sex: userData.sex || ''
    })
  } catch (error) {
    console.error('获取用户资料失败:', error)
    ElMessage.error('獲取用戶資料失敗')
  }
})
</script>

<style lang="scss" scoped>
.settings-page {
  width: 100%;
}

.settings-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  animation: fadeIn 0.3s ease;
}

.page-header {
  margin-bottom: 32px;
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 20px;

  .header-content {
    .title {
      font-size: 24px;
      font-weight: 600;
      color: #2c3e50;
      margin: 0 0 8px 0;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .subtitle {
      color: #666;
      margin: 0;
      font-size: 16px;
    }
  }
}

.settings-form {
  max-width: 800px;
  margin: 0 auto;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;

  .avatar-preview {
    position: relative;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    margin-bottom: 16px;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 4px solid #f0f0f0;
    transition: all 0.3s ease;

    &:hover {
      border-color: var(--va-primary);
    }

    .avatar-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: all 0.3s ease;
    }

    .avatar-placeholder {
      color: #999;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .avatar-input {
    width: 100%;
    max-width: 400px;
  }
}

.avatar-actions {
  margin-top: 8px;
  display: flex;
  justify-content: center;

  .el-button {
    display: flex;
    align-items: center;
    gap: 4px;

    &:hover {
      opacity: 0.8;
    }
  }
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

:deep(.el-form-item) {
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }

  .el-input__wrapper {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    padding: 8px 12px;

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
    }
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding-top: 24px;
  border-top: 1px solid #eaeaea;

  .va-button {
    padding: 12px 24px;
    font-size: 16px;
  }
}

// 响应式设计
@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .form-actions {
    flex-direction: column;
    gap: 12px;

    .va-button {
      width: 100%;
    }
  }

  .avatar-section {
    .avatar-input {
      width: 100%;
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
