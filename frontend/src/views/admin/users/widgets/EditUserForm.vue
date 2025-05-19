<template>
  <div class="edit-user-form">
    <form @submit.prevent="handleSubmit" class="form-container">
      <!-- 头像区域 -->
      <div class="avatar-section">
        <div class="avatar-preview">
          <img
              v-if="formData.avatarUrl"
              :src="formData.avatarUrl"
              alt="User avatar"
              class="avatar-image"
          />
          <div v-else class="avatar-placeholder">
            <VaIcon name="person" size="large" />
          </div>
        </div>
        <!-- 改为URL输入 -->
        <div class="avatar-input">
          <VaInput
              v-model="formData.avatarUrl"
              label="頭像URL"
              placeholder="請輸入頭像圖片網址"
              class="form-field"
          >
            <template #append>
              <VaButton
                  v-if="formData.avatarUrl"
                  preset="primary"
                  color="danger"
                  size="small"
                  icon="delete"
                  @click="clearAvatar"
              />
            </template>
          </VaInput>
        </div>
      </div>

      <!-- 其他表单字段保持不变 -->
      <div class="form-grid">
        <VaInput
            v-model="formData.name"
            label="姓名"
            :rules="[validators.required]"
            class="form-field"
        />
        <VaInput
            v-model="formData.username"
            label="帳號"
            :rules="[validators.required]"
            class="form-field"
            :disabled="!!user"
        />
      </div>

      <div class="form-grid">
        <VaInput
            v-model="formData.email"
            label="Email"
            :rules="[validators.required, validators.email]"
            class="form-field"
        />
        <VaSelect
            v-model="formData.sex"
            label="性別"
            :options="sexSelectOptions"
            :rules="[validators.required]"
            value-by="value"
            class="form-field"
        />
      </div>

      <!-- 只有新建用户时才显示密码字段 -->
      <div class="form-grid" v-if="!user">
        <VaInput
            v-model="formData.password"
            label="密碼"
            type="password"
            :rules="[validators.required]"
            class="form-field"
        />
      </div>

      <div class="form-grid">
        <VaSelect
            v-model="formData.role"
            label="角色"
            :options="roleSelectOptions"
            :rules="[validators.required]"
            value-by="value"
            class="form-field"
        />
      </div>

      <!-- 按钮区域 -->
      <div class="form-actions">
        <VaButton
            preset="secondary"
            color="secondary"
            @click="$emit('close')"
        >
          取消
        </VaButton>
        <VaButton
            type="submit"
            :disabled="!isFormValid"
        >
          {{ saveButtonLabel }}
        </VaButton>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { VaIcon } from 'vuestic-ui'
import { ElMessage } from 'element-plus'

// Props 和 Emits 保持不变
const props = defineProps({
  user: {
    type: Object,
    default: null,
  },
  saveButtonLabel: {
    type: String,
    default: 'Save',
  },
})

const emit = defineEmits(['close', 'save'])

// 验证规则
const validators = {
  required: (value) => !!value || '此欄位為必填',
  email: (value) =>
      !value || /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value) || '請輸入有效的 Email 格式',
}

// 默认表单数据
const defaultFormData = {
  avatarUrl: '',
  name: '',
  role: 'user',
  username: '',
  email: '',
  sex: 'male',
  password: ''
}

const formData = ref({ ...defaultFormData })
const isFormValid = ref(true)

// 监听用户数据变化
watch(
    () => props.user,
    (newUser) => {
      if (newUser) {
        formData.value = {
          avatarUrl: newUser.avatarUrl || '',
          name: newUser.name || '',
          role: newUser.role || 'user',
          username: newUser.username || '',
          email: newUser.email || '',
          sex: newUser.sex || 'male',
        }
      } else {
        formData.value = { ...defaultFormData }
      }
    },
    { immediate: true }
)

const roleSelectOptions = [
  { text: 'Admin', value: 'admin' },
  { text: 'User', value: 'user' },
]

const sexSelectOptions = [
  { text: '男', value: 'male' },
  { text: '女', value: 'female' },
  { text: '其他', value: 'other' },
]

// 清除头像
const clearAvatar = () => {
  formData.value.avatarUrl = ''
}

// 提交表单
const handleSubmit = () => {
  // 验证必填字段
  const requiredFields = ['username', 'name', 'email', 'role', 'sex']
  if (!props.user) {
    requiredFields.push('password')
  }

  const missingFields = requiredFields.filter(field => !formData.value[field])
  if (missingFields.length > 0) {
    ElMessage.error('请填写所有必填字段')
    return
  }

  // 验证Email格式
  if (formData.value.email && !validators.email(formData.value.email)) {
    ElMessage.error('请输入有效的Email地址')
    return
  }

  emit('save', { ...formData.value })
}
</script>

<style lang="scss" scoped>
// 样式调整
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.avatar-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.avatar-input {
  width: 100%;
  max-width: 400px;
}

// 其他样式保持不变...
</style>


<style lang="scss" scoped>
.edit-user-form {
  width: 100%;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.avatar-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.avatar-actions {
  display: flex;
  gap: 8px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  width: 100%;
}

.form-field {
  width: 100%;
  margin: 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}

.hidden {
  display: none;
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;

    .va-button {
      width: 100%;
    }
  }
}
</style>
