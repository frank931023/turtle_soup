<template>
  <div class="password-reset-page">
    <VaCard class="password-card">
      <VaCardContent>
        <!-- 页面标题区域 -->
        <div class="page-header">
          <div class="header-content">
            <h1 class="title">
              <VaIcon name="password reset" color="primary" />
              重設密碼
            </h1>
            <p class="subtitle">請輸入舊密碼與新密碼</p>
          </div>
        </div>

        <!-- 密码表单区域 -->
        <el-form
          :model="form"
          :rules="rules"
          ref="formRef"
          label-position="top"
          class="password-form"
        >
          <!-- 表单内容区域 -->
          <div class="form-content">
            <el-form-item label="舊密碼" prop="oldPassword">
              <el-input
                v-model="form.oldPassword"
                type="password"
                placeholder="請輸入舊密碼"
                show-password
              >
                <template #prefix>
                  <VaIcon color="secondary" />
                </template>
              </el-input>
            </el-form-item>

            <div class="password-section">
              <el-form-item label="新密碼" prop="newPassword">
                <el-input
                  v-model="form.newPassword"
                  type="password"
                  placeholder="請輸入新密碼"
                  show-password
                >
                  <template #prefix>
                    <VaIcon color="primary" />
                  </template>
                </el-input>
              </el-form-item>

              <el-form-item label="確認新密碼" prop="confirmPassword">
                <el-input
                  v-model="form.confirmPassword"
                  type="password"
                  placeholder="請再次輸入新密碼"
                  show-password
                >
                  <template #prefix>
                    <VaIcon color="success" />
                  </template>
                </el-input>
              </el-form-item>
            </div>

            <!-- 密码提示 -->
            <div class="password-tips">
              <VaIcon name="info" color="info" />
              <span>密碼必須至少包含 6 個字符</span>
            </div>
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
              @click="submitReset"
            >
              更新密碼
            </VaButton>
          </div>
        </el-form>
      </VaCardContent>
    </VaCard>
  </div>
</template>

<style lang="scss" scoped>
.password-reset-page {
  width: 100%;
}

.password-card {
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

.password-form {
  max-width: 500px;
  margin: 0 auto;

  .form-content {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
  }
}

.password-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed #ddd;
}

.password-tips {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #f0f7ff;
  border-radius: 8px;
  color: #666;
  font-size: 14px;
  margin-top: 16px;
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
  .form-actions {
    flex-direction: column;
    gap: 12px;

    .va-button {
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

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user.js'
import { resetPasswordAPI } from '@/apis/profile.js'

const formRef = ref(null)
const submitting = ref(false)

const form = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const rules = {
  oldPassword: [{ required: true, message: '請輸入舊密碼', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '請輸入新密碼', trigger: 'blur' },
    { min: 6, message: '密碼長度至少為 6 字符', trigger: 'blur' },
  ],
  confirmPassword: [
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('請再次輸入新密碼'))
        } else if (value !== form.newPassword) {
          callback(new Error('兩次輸入的新密碼不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

const userStore = useUserStore()

const submitReset = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid, fields) => {
    if (valid) {
      submitting.value = true
      try {
        await resetPasswordAPI({
          oldPassword: form.oldPassword,
          newPassword: form.newPassword
        }, userStore.token)
        ElMessage.success('密碼已成功更新')
        resetForm()
      } finally {
        submitting.value = false
      }
    } else {
      ElMessage.warning('請完成所有必填欄位')
    }
  })
}

const resetForm = () => {
  if (formRef.value) formRef.value.resetFields()
  Object.assign(form, {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
}
</script>
