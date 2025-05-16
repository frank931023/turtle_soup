<template>
  <div class="fullscreen-background"></div>
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
/* 全螢幕背景設置 */
:deep(body), :deep(html) {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}

/* 創建一個全屏背景層 */
.fullscreen-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url('@/assets/form-background.jpg'); /* 替換為您的圖片路徑 */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -10;
}

.add-story-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 30px 20px;
  min-height: calc(100vh - 60px);
  position: relative;
  z-index: 1;
  


  .page-header {
    text-align: center;
    margin-bottom: 40px;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -15px;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 3px;
      background: white; /* 改為白色下劃線 */
      border-radius: 3px;
    }

    h1 {
      font-size: 36px;
      color: white; /* 改為白色標題 */
      margin-bottom: 12px;
      font-weight: 600;
      text-shadow: 0 2px 4px rgba(0,0,0,0.2); /* 增強陰影使白色文字更可讀 */
    }

    .subtitle {
      font-size: 18px;
      color: rgba(255, 255, 255, 0.9); /* 稍微半透明的白色副標題 */
      font-weight: 300;
      text-shadow: 0 1px 3px rgba(0,0,0,0.15); /* 輕微陰影增加可讀性 */
    }
  }

  .form-container {
    background-color: rgba(255, 255, 255, 0.95); /* 增加不透明度以提高可讀性 */
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
    padding: 35px;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px); /* 背景模糊效果，增強現代感 */

    &:hover {
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.18);
      transform: translateY(-5px);
    }

    .story-form {
      :deep(.el-form-item__label) {
        font-weight: 600;
        color: #334155;
        padding-bottom: 8px;
        font-size: 16px;
      }

      :deep(.el-input__wrapper) {
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
        transition: all 0.3s;

        &:hover, &:focus-within {
          box-shadow: 0 3px 8px rgba(76, 110, 177, 0.15);
        }
      }

      :deep(.el-textarea__inner) {
        border-radius: 8px;
        padding: 12px;
      }

      :deep(.el-select) {
        width: 100%;
      }

      .form-row {
        display: flex;
        gap: 24px;
        margin-bottom: 5px;

        .form-column {
          flex: 1;
        }
      }

      .tag-container {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        padding-top: 10px;
        
        :deep(.el-checkbox) {
          margin-right: 0;
        }

        :deep(.el-checkbox.is-bordered) {
          border-radius: 8px;
          padding: 10px 15px;
          transition: all 0.2s;
          
          &:hover {
            border-color: #4C6EB1;
            background: rgba(76, 110, 177, 0.05);
          }
        }

        :deep(.el-checkbox.is-checked) {
          border-color: #4C6EB1;
          background: rgba(76, 110, 177, 0.1);
        }
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 40px;
        gap: 18px;

        button {
          padding: 12px 28px;
          font-size: 16px;
          border-radius: 8px;
          transition: all 0.3s;
        }

        :deep(.el-button--default) {
          border: 1px solid #ddd;
          
          &:hover {
            background: #f8f9fa;
            border-color: #ccc;
          }
        }

        :deep(.el-button--primary) {
          background: linear-gradient(135deg, #4C6EB1, #5fb0ff);
          border: none;
          box-shadow: 0 4px 10px rgba(76, 110, 177, 0.3);
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(76, 110, 177, 0.4);
          }
        }
      }
    }
  }
}

// 响應式布局
@media (max-width: 768px) {
  .add-story-container {
    padding: 20px 15px;
    
    .form-container {
      padding: 25px 20px;
      border-radius: 10px;
    }
    
    .form-row {
      flex-direction: column;
      gap: 0 !important;
    }
    
    .page-header {
      margin-bottom: 30px;
      
      h1 {
        font-size: 28px;
      }
    }
    
    .form-actions {
      button {
        padding: 10px 20px !important;
      }
    }
  }
}
</style>
