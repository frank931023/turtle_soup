<template>
  <div class="story-editor-container">
    <h1>編輯故事</h1>

    <div v-if="loading" class="loading">載入中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else class="editor-form">
      <div class="form-group">
        <label for="questionName">故事標題</label>
        <input
          type="text"
          id="questionName"
          v-model="storyData.questionName"
          placeholder="輸入故事標題"
        />
      </div>

      <div class="form-group">
        <label for="description">故事簡介</label>
        <textarea
          id="description"
          v-model="storyData.description"
          placeholder="輸入故事簡介"
          rows="2"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="story">故事內容</label>
        <textarea
          id="story"
          v-model="storyData.story"
          placeholder="輸入故事內容"
          rows="5"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="soup">湯底 (解答)</label>
        <textarea
          id="soup"
          v-model="storyData.soup"
          placeholder="輸入湯底/解答"
          rows="3"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="imageURL">圖片網址</label>
        <input type="text" id="imageURL" v-model="storyData.imageURL" placeholder="輸入圖片網址" />
        <div class="image-preview" v-if="storyData.imageURL">
          <img :src="storyData.imageURL" alt="故事圖片預覽" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group half-width">
          <label for="isPending">狀態</label>
          <select id="isPending" v-model="storyData.isPending">
            <option :value="true">待審核</option>
            <option :value="false">已審核</option>
          </select>
        </div>
        <div class="form-group half-width">
          <label for="isDeleted">是否刪除</label>
          <select id="isDeleted" v-model="storyData.isDeleted">
            <option :value="false">正常</option>
            <option :value="true">已刪除</option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group half-width">
          <label for="thumbsUp">讚數</label>
          <input
            type="number"
            id="thumbsUp"
            v-model.number="storyData.thumbsUp"
            placeholder="點讚數"
            min="0"
          />
        </div>
        <div class="form-group half-width">
          <label for="level">難度等級</label>
          <select id="level" v-model.number="storyData.level">
            <option :value="1">簡單</option>
            <option :value="2">中等</option>
            <option :value="3">困難</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label for="categories">故事分類</label>
        <div class="categories-selector">
          <div v-for="category in categoryOptions" :key="category.value" class="category-checkbox">
            <input
              type="checkbox"
              :id="'category-' + category.value"
              :value="category.value"
              v-model="storyData.categories"
            />
            <label :for="'category-' + category.value">{{ category.label }}</label>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button @click="goBack" class="cancel-btn">取消</button>
        <button @click="saveStory" class="save-btn" :disabled="saving">
          {{ saving ? '儲存中...' : '儲存變更' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getStoryByIdAPI, updateStoryAPI } from '@/apis/story'

const route = useRoute()
const router = useRouter()
const storyId = ref(route.params.id)

// 分類選項
const categoryOptions = [
  { label: '死亡', value: '死亡' },
  { label: '誤會', value: '誤會' },
  { label: '失憶', value: '失憶' },
  { label: '巧合', value: '巧合' },
  { label: '身份', value: '身份' },
  { label: '時間', value: '時間' },
  { label: '報復', value: '報復' },
  { label: '心理', value: '心理' },
  { label: '語言', value: '語言' },
  { label: '奇幻', value: '奇幻' },
]

const loading = ref(true)
const saving = ref(false)
const error = ref(null)

// 初始故事資料
const storyData = reactive({
  questionName: '',
  description: '',
  story: '',
  soup: '',
  imageURL: '',
  thumbsUp: 0,
  level: 1,
  categories: [],
  isPending: false,
  isDeleted: false,
})

// 獲取故事詳情
const fetchStoryDetails = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await getStoryByIdAPI(storyId.value)
    if (response && response.success && response.data) {
      console.log('API返回的原始数据:', response.data)

      // 處理分類數據 - 確保它是陣列形式
      let categoryData = response.data.category || []
      // 如果是字符串（例如:"死亡,誤會"），將其分割為陣列
      if (typeof categoryData === 'string') {
        categoryData = categoryData
          .split(',')
          .map((cat) => cat.trim())
          .filter((cat) => cat)
      }
      // 如果是單個值（不是陣列），將其轉為陣列
      else if (categoryData && !Array.isArray(categoryData)) {
        categoryData = [categoryData]
      }

      console.log('處理後的分類數據:', categoryData)

      // 將資料填入表單
      Object.assign(storyData, {
        questionName: response.data.questionName || '',
        description: response.data.description || '',
        story: response.data.story || '',
        soup: response.data.soup || '',
        imageURL: response.data.imageURL || '',
        thumbsUp: response.data.thumbsUp || 0,
        level: response.data.level || 1,
        categories: categoryData,
        isPending: response.data.isPending || false,
        isDeleted: response.data.isDeleted || false,
      })
      console.log('成功獲取故事詳情:', storyData)
    } else {
      error.value = '無法獲取故事詳情，請稍後再試。'
      console.error('獲取故事詳情失敗:', response)
    }
  } catch (err) {
    error.value = '獲取故事詳情時發生錯誤，請稍後再試。'
    console.error('獲取故事詳情錯誤:', err)
  } finally {
    loading.value = false
  }
}

// 儲存故事更改
const saveStory = async () => {
  saving.value = true

  try {
    // 準備提交數據 - 確保API接受正確格式
    const dataToSubmit = { ...storyData }

    // 確保分類資料被正確格式化 - 如果API期望的是單個字符串而不是數組
    if (Array.isArray(dataToSubmit.categories)) {
      // 根據API需要可以調整格式 (保留原數組或轉為字串)
      dataToSubmit.category = dataToSubmit.categories
    }

    console.log('準備提交的數據:', dataToSubmit)

    const response = await updateStoryAPI(storyId.value, dataToSubmit)
    if (response && response.success) {
      alert('故事更新成功！')
      router.push('/story-manage') // 返回故事管理頁
    } else {
      alert('更新失敗: ' + (response?.message || '未知錯誤'))
      console.error('更新故事失敗:', response)
    }
  } catch (err) {
    alert('更新故事時發生錯誤，請稍後再試。')
    console.error('更新故事錯誤:', err)
  } finally {
    saving.value = false
  }
}

// 返回上一頁
const goBack = () => {
  router.back()
}

// 初始加載
onMounted(() => {
  if (storyId.value) {
    fetchStoryDetails()
  } else {
    error.value = '未提供故事ID，無法編輯。'
    loading.value = false
  }
})
</script>

<style scoped>
.story-editor-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px 20px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.loading,
.error {
  text-align: center;
  padding: 30px;
  font-style: italic;
  color: #666;
}

.error {
  color: #d32f2f;
  background-color: #ffebee;
  padding: 15px;
  border-radius: 8px;
  margin: 20px 0;
}

.editor-form {
  background-color: #f9f9f9;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #333;
}

input,
textarea,
select {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  transition: border 0.3s;
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: #4c6eb1;
  box-shadow: 0 0 0 2px rgba(76, 110, 177, 0.2);
}

textarea {
  resize: vertical;
  min-height: 120px;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.half-width {
  flex: 1;
  margin-bottom: 0;
}

.image-preview {
  margin-top: 10px;
  padding: 10px;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  text-align: center;
}

.image-preview img {
  max-width: 100%;
  max-block-size: 500px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
}

button {
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.cancel-btn {
  background-color: #e0e0e0;
  color: #333;
}

.cancel-btn:hover {
  background-color: #d0d0d0;
}

.save-btn {
  background-color: #4c6eb1;
  color: white;
}

.save-btn:hover {
  background-color: #3b5998;
}

.save-btn:disabled {
  background-color: #9ab1db;
  cursor: not-allowed;
}

.categories-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 5px;
}

.category-checkbox {
  display: flex;
  align-items: center;
  background-color: #f0f4f8;
  padding: 6px 12px;
  border-radius: 30px;
  border: 1px solid #e0e0e0;
  transition: all 0.2s;
}

.category-checkbox:hover {
  background-color: #e8eaf6;
}

.category-checkbox input {
  width: auto;
  margin-right: 6px;
}

.category-checkbox label {
  margin: 0;
  font-weight: normal;
  cursor: pointer;
}
</style>
