<template>
  <div class="add-story-container">
    <div class="page-header">
      <h1>新增故事</h1>
      <p class="subtitle">創建一個新的海龜湯故事</p>
    </div>

    <div class="form-container">
      <el-form
        :model="storyForm"
        :rules="rules"
        ref="storyFormRef"
        label-position="top"
        class="story-form"
      >
        <el-form-item label="故事名稱" prop="questionName">
          <el-input v-model="storyForm.questionName" placeholder="請輸入故事名稱" />
        </el-form-item>

        <el-form-item label="故事描述" prop="description">
          <el-input
            v-model="storyForm.description"
            type="textarea"
            :rows="4"
            placeholder="請輸入故事描述"
          />
        </el-form-item>

        <div class="form-row">
          <el-form-item label="圖片網址" prop="imageURL" class="form-column">
            <el-input v-model="storyForm.imageURL" placeholder="請輸入圖片網址(選填)" />
          </el-form-item>

          <el-form-item label="故事難度" prop="level" class="form-column">
            <el-select v-model="storyForm.level" placeholder="請選擇難度">
              <el-option :value="1" label="簡單" />
              <el-option :value="2" label="普通" />
              <el-option :value="3" label="困難" />
            </el-select>
          </el-form-item>
        </div>

        <el-form-item label="故事內容" prop="story">
          <el-input
            v-model="storyForm.story"
            type="textarea"
            :rows="6"
            placeholder="請輸入完整的故事內容"
          />
        </el-form-item>

        <el-form-item label="湯底(解答)" prop="soup">
          <el-input
            v-model="storyForm.soup"
            type="textarea"
            :rows="3"
            placeholder="請輸入故事謎底"
          />
        </el-form-item>

        <el-form-item label="故事分類" prop="category">
          <div class="tag-container">
            <el-checkbox-group v-model="storyForm.category">
              <el-checkbox label="死亡" border>死亡</el-checkbox>
              <el-checkbox label="誤會" border>誤會</el-checkbox>
              <el-checkbox label="失憶" border>失憶</el-checkbox>
              <el-checkbox label="巧合" border>巧合</el-checkbox>
              <el-checkbox label="身份" border>身份</el-checkbox>
              <el-checkbox label="時間" border>時間</el-checkbox>
              <el-checkbox label="報復" border>報復</el-checkbox>
              <el-checkbox label="心理" border>心理</el-checkbox>
              <el-checkbox label="語言" border>語言</el-checkbox>
              <el-checkbox label="奇幻" border>奇幻</el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>

        <div class="form-actions">
          <el-button @click="resetForm">重置</el-button>
          <el-button type="primary" @click="submitForm" :loading="submitting">提交</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { createStoryAPI } from '@/apis/story.js'

const router = useRouter()
const storyFormRef = ref(null)
const submitting = ref(false)

// 表單數據
const storyForm = reactive({
  questionName: '',
  description: '',
  imageURL: '',
  story: '',
  soup: '',
  thumbsUp: 0,
  level: 1,
  category: [],
  isPending: true,
})

// 表單驗證規則
const rules = {
  questionName: [
    { required: true, message: '請輸入故事名稱', trigger: 'blur' },
    { min: 2, max: 50, message: '長度應為2到50個字符', trigger: 'blur' },
  ],
  description: [
    { required: true, message: '請輸入故事描述', trigger: 'blur' },
    { min: 10, max: 500, message: '長度應為10到500個字符', trigger: 'blur' },
  ],
  level: [{ required: true, message: '請選擇難度等級', trigger: 'change' }],
  story: [{ required: true, message: '請輸入故事內容', trigger: 'blur' }],
  soup: [{ required: true, message: '請輸入湯底(解答)', trigger: 'blur' }],
  category: [{ type: 'array', required: true, message: '請至少選擇一個分類', trigger: 'change' }],
}

// 提交表單
const submitForm = async () => {
  if (!storyFormRef.value) return

  await storyFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      submitting.value = true
      try {
        const response = await createStoryAPI(storyForm)
        ElMessage({
          type: 'success',
          message: '故事提交成功，等待審核!',
        })
        resetForm()
        router.push('/')
      } catch (error) {
        console.error('提交故事失敗:', error)
        ElMessage({
          type: 'error',
          message: '提交失敗，請稍後再試!',
        })
      } finally {
        submitting.value = false
      }
    } else {
      console.log('表單驗證失敗', fields)
      ElMessage({
        type: 'warning',
        message: '請完成所有必填欄位!',
      })
    }
  })
}

// 重置表單
const resetForm = () => {
  if (storyFormRef.value) {
    storyFormRef.value.resetFields()
  }

  // 重置所有表單值
  Object.assign(storyForm, {
    questionName: '',
    description: '',
    imageURL: '',
    story: '',
    soup: '',
    thumbsUp: 0,
    level: 1,
    category: [],
    isPending: true,
  })
}
</script>

<style scoped lang="scss">
.add-story-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;

  .page-header {
    text-align: center;
    margin-bottom: 30px;

    h1 {
      font-size: 32px;
      color: #333;
      margin-bottom: 8px;
    }

    .subtitle {
      font-size: 16px;
      color: #666;
    }
  }

  .form-container {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
    padding: 30px;

    .story-form {
      .form-row {
        display: flex;
        gap: 20px;

        .form-column {
          flex: 1;
        }
      }

      .tag-container {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 30px;
        gap: 15px;
      }
    }
  }
}

// 响應式布局
@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 0 !important;
  }
}
</style>
