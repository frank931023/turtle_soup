<template>
  <div class="users-page">
    <header class="main-header">
      <div class="container">
        <h1 class="logo">
          <RouterLink to="/">請喝湯</RouterLink>
        </h1>
        <RouterLink class="enter-button" to="/home">
          進入大廳
          <i class="iconfont icon-angle-right"></i>
          <i class="iconfont icon-angle-right"></i>
        </RouterLink>
      </div>
    </header>

    <div class="page-container">
      <h1 class="page-title">用戶資料</h1>

      <VaCard class="users-card">
        <VaCardContent>
          <!-- 工具欄 -->
          <div class="toolbar">
            <!-- 左側：篩選與搜尋 -->
            <div class="toolbar-left">
              <VaButtonToggle
                v-model="selectedRole"
                color="background-element"
                border-color="background-element"
                :options="roleOptions"
              />
              <VaInput
                v-model="searchKeyword"
                placeholder="Search"
                class="search-input"
              >
                <template #prependInner>
                  <VaIcon name="search" color="secondary" size="small" />
                </template>
              </VaInput>
            </div>

            <!-- 右側：新增使用者按鈕 -->
            <VaButton @click="openAddUserModal" class="add-user-btn">
              <VaIcon />
              新增用戶
            </VaButton>
          </div>

          <!-- 使用者列表表格 -->
          <el-table
            :data="pagedUsers"
            stripe
            class="users-table"
            row-class-name="animated-row"
            v-loading="loading"
          >
            <!-- 頭像列-->
            <el-table-column label="" width="80">
              <template #default="{ row }">
                <div class="user-avatar">
                  <img
                    v-if="row.avatarUrl"
                    :src="row.avatarUrl"
                    :alt="row.name"
                    class="avatar-image"
                  />
                  <div v-else class="avatar-placeholder">
                    <img
                      src="https://png.pngtree.com/png-clipart/20230817/original/pngtree-anonymous-user-unidentified-contact-avatar-picture-image_7998127.png"
                      alt="default avatar"
                      class="avatar-image"
                    />
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="Name" prop="name" />
            <el-table-column label="Email" prop="email" />
            <el-table-column label="Username" prop="username" />
            <el-table-column label="Role">
              <template #default="{ row }">
                <transition name="fade-tag" mode="out-in">
                  <el-tag
                    :key="row.role"
                    :type="row.role === 'admin' ? 'danger' : 'success'"
                    class="role-tag"
                  >
                    {{ row.role }}
                  </el-tag>
                </transition>
              </template>
            </el-table-column>
            <el-table-column label="Score">
              <template #default="{ row }">
                {{ formatScore(row.score) }}
              </template>
            </el-table-column>
            <el-table-column label="Created At">
              <template #default="{ row }">
                {{ formatDate(row.createdAt) }}
              </template>
            </el-table-column>
            <el-table-column label="Actions" width="120">
              <template #default="{ row }">
                <div class="action-buttons">
                  <el-button
                    type="primary"
                    size="small"
                    class="action-btn"
                    @click="editUser(row)"
                  >
                    <svg
                      class="action-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                    </svg>
                  </el-button>
                  <el-button
                    type="danger"
                    size="small"
                    class="action-btn"
                    @click="confirmDelete(row)"
                  >
                    <svg
                      class="action-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分頁 -->
          <div class="pagination-wrapper">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="total"
              :page-size="PAGE_SIZE"
              v-model:current-page="currentPage"
              :loading="loading"
            />
          </div>
        </VaCardContent>
      </VaCard>
    </div>

    <!-- 編輯用戶彈窗 -->
    <VaModal
      v-model="showEditUserModal"
      size="medium"
      mobile-fullscreen
      close-button
      hide-default-actions
      class="user-edit-modal"
    >
      <template #header>
        <h3 class="modal-title">{{ userToEdit ? 'Edit User' : 'Add User' }}</h3>
      </template>

      <div class="modal-content-wrapper">
        <EditUserForm
          ref="editFormRef"
          :user="userToEdit"
          :save-button-label="userToEdit ? 'Save' : 'Add'"
          @close="closeEditUserModal"
          @save="handleUserSave"
        />
      </div>
    </VaModal>

    <!-- 刪除確認彈窗 -->
    <VaModal
      v-model="showDeleteConfirm"
      size="small"
      mobile-fullscreen
      ok-text="Delete"
      cancel-text="Cancel"
      @ok="handleDelete"
      class="delete-confirm-modal"
    >
      <p class="delete-confirm-message">
        Are you sure you want to delete this user?
      </p>
    </VaModal>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import {
  getUserListAPI,
  getUserAPI,
  createUserAPI,
  updateUserAPI,
  deleteUserAPI
} from '@/apis/users'
import {
  VaInput,
  VaButtonToggle,
  VaButton,
  VaIcon,
  VaCard,
  VaCardContent,
  VaModal
} from 'vuestic-ui'
import { ElMessage } from 'element-plus'
import EditUserForm from './widgets/EditUserForm.vue'

// Constants
const PAGE_SIZE = 10
const roleOptions = [
  { label: 'User', value: 'user' },
  { label: 'Admin', value: 'admin' }
]

// State
const selectedRole = ref('user')
const searchKeyword = ref('')
const currentPage = ref(1)
const showEditUserModal = ref(false)
const showDeleteConfirm = ref(false)
const userToEdit = ref(null)
const userToDelete = ref(null)
const editFormRef = ref(null)
const users = ref([])
const total = ref(0)
const loading = ref(false)

// 获取用户列表
const fetchUsers = async () => {
  try {
    loading.value = true
    const res = await getUserListAPI({
      page: currentPage.value,
      pageSize: PAGE_SIZE,
      role: selectedRole.value,
      search: searchKeyword.value
    })

    if (res.message === '获取用户列表成功') {
      users.value = res.result.users
      total.value = res.result.pagination.total
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
    ElMessage.error(error.response?.data?.message || '获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 监听筛选条件变化
watch([selectedRole, searchKeyword], () => {
  currentPage.value = 1
  fetchUsers()
})

// 监听页码变化
watch(currentPage, () => {
  fetchUsers()
})

// 初始化
onMounted(() => {
  fetchUsers()
})

// Methods
const formatDate = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatScore = (score) => {
  return new Intl.NumberFormat().format(score)
}

const openAddUserModal = () => {
  userToEdit.value = null
  showEditUserModal.value = true
}

const editUser = async (user) => {
  try {
    const res = await getUserAPI(user.id)
    if (res.message === '获取用户信息成功') {
      userToEdit.value = res.result.user
      showEditUserModal.value = true
    }
  } catch (error) {
    console.error('获取用户详情失败:', error)
    ElMessage.error(error.response?.data?.message || '获取用户详情失败')
  }
}

const closeEditUserModal = () => {
  userToEdit.value = null
  showEditUserModal.value = false
}

const handleUserSave = async (userData) => {
  try {
    if (userToEdit.value) {
      const res = await updateUserAPI(userToEdit.value.id, userData)
      if (res.message === '更新用户成功') {
        ElMessage.success('用户更新成功')
        await fetchUsers()
        closeEditUserModal()
      }
    } else {
      const res = await createUserAPI(userData)
      if (res.message === '创建用户成功') {
        ElMessage.success('用户创建成功')
        await fetchUsers()
        closeEditUserModal()
      }
    }
  } catch (error) {
    console.error('保存用户失败:', error)
    ElMessage.error(error.response?.data?.message || '保存用户失败')
  }
}

const confirmDelete = (user) => {
  userToDelete.value = user
  showDeleteConfirm.value = true
}

const handleDelete = async () => {
  if (userToDelete.value) {
    try {
      const res = await deleteUserAPI(userToDelete.value.id)
      if (res.message === '删除用户成功') {
        ElMessage.success('用户删除成功')
        await fetchUsers()
      }
    } catch (error) {
      console.error('删除用户失败:', error)
      ElMessage.error(error.response?.data?.message || '删除用户失败')
    }
  }
  showDeleteConfirm.value = false
  userToDelete.value = null
}

// Computed
const pagedUsers = computed(() => users.value)
</script>

<style lang="scss">
// Reset
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

// Variables
:root {
  --header-height: 64px;
  --content-padding: 32px;
  --card-border-radius: 8px;
  --primary-color: #1867c0;
  --secondary-color: #5c6bc0;
  --success-color: #4caf50;
  --danger-color: #ff5252;
  --text-primary: #2c3e50;
  --background-color: #f6f7f9;
}

// Layout
.users-page {
  min-height: 100vh;
  background-color: var(--background-color);
}

.main-header {
  background: #e8e8e8;
  border-bottom: 1px solid #f3f3f3;
  height: var(--header-height);

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--content-padding);
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    font-size: 24px;
    font-weight: bold;

    a {
      color: var(--text-primary);
      text-decoration: none;
    }
  }
}

.page-container {
  padding: var(--content-padding);
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 24px;
  color: var(--text-primary);
}

// Components
.users-card {
  border-radius: var(--card-border-radius);
  background: #fff;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;

  &-left {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }
}

.search-input {
  min-width: 220px;
}

.users-table {
  margin-top: 20px;
  width: 100%;
}

.role-tag {
  min-width: 80px;
  text-align: center;
}

// Action buttons styling
.action-buttons {
  display: flex;
  gap: 8px;

  .action-btn {
    padding: 6px !important;
    height: 32px;
    width: 32px;
    border-radius: 8px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;

    // Remove default element-plus button border
    border: none !important;

    // SVG icon styling
    .action-icon {
      width: 16px;
      height: 16px;
      transition: transform 0.2s ease;
    }

    // Edit button specific styling
    &.el-button--primary {
      background-color: #e8f0fe !important;
      color: #1867c0 !important;

      &:hover {
        background-color: #d0e1fd !important;
        box-shadow: 0 2px 8px rgba(24, 103, 192, 0.15);

        .action-icon {
          transform: scale(1.1);
        }
      }
    }

    // Delete button specific styling
    &.el-button--danger {
      background-color: #fee8e8 !important;
      color: #ff4d4f !important;

      &:hover {
        background-color: #fdd0d0 !important;
        box-shadow: 0 2px 8px rgba(255, 77, 79, 0.15);

        .action-icon {
          transform: scale(1.1);
        }
      }
    }

    &:active {

      .action-icon {
        transform: scale(1);
      }
    }
  }
}

// Hover effects for entire row
.el-table__row {
  .action-buttons {
    opacity: 0.7;
    transition: opacity 0.2s ease;
  }

  &:hover .action-buttons {
    opacity: 1;
  }
}

// Hover effects for entire row
.el-table__row {
  .action-buttons {
    opacity: 0.7;
    transition: opacity 0.2s ease;
  }

  &:hover .action-buttons {
    opacity: 1;
  }
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

// Modal styles
.user-edit-modal {
  .va-modal__container {
    overflow: hidden;
  }

  .va-modal__content {
    padding: 0;
  }
}

.modal-content-wrapper {
  padding: 24px;
  height: 100%;
  overflow-y: auto;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.delete-confirm-message {
  padding: 16px;
  text-align: center;
  color: var(--text-primary);
}

// Animations
.animated-row {
  animation: fadeInRow 0.5s ease-in;
}

@keyframes fadeInRow {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-tag-enter-active,
.fade-tag-leave-active {
  transition: all 0.3s ease;
}

.fade-tag-enter-from,
.fade-tag-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

// Responsive
@media (max-width: 768px) {
  .page-container {
    padding: 16px;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;

    &-left {
      flex-direction: column;
      align-items: stretch;
    }
  }

  .search-input {
    width: 100%;
  }

  .add-user-btn {
    width: 100%;
  }
}

// Button styles
.enter-button {
  margin-bottom: 5px;
  position: relative;
  font: inherit;
  background-color: #f0f0f0;
  border: 0;
  color: #242424;
  border-radius: 999px;
  font-size: 1.4rem;
  padding: 0.25em 0.75em;
  font-weight: 600;
  text-decoration: none;
  text-shadow: 0 0.0625em 0 #fff;
  box-shadow:
    inset 0 0.0625em 0 0 #f4f4f4,
    0 0.0625em 0 0 #efefef,
    0 0.125em 0 0 #ececec,
    0 0.25em 0 0 #e0e0e0,
    0 0.3125em 0 0 #dedede,
    0 0.375em 0 0 #dcdcdc,
    0 0.425em 0 0 #cacaca,
    0 0.425em 0.5em 0 #cecece;
  transition: 0.25s ease;
  cursor: pointer;

  &:hover,
  &:active {
    transform: translateY(0.225em);
    box-shadow:
      inset 0 0.03em 0 0 #f4f4f4,
      0 0.03em 0 0 #efefef,
      0 0.0625em 0 0 #ececec,
      0 0.125em 0 0 #e0e0e0,
      0 0.125em 0 0 #dedede,
      0 0.2em 0 0 #dcdcdc,
      0 0.225em 0 0 #cacaca,
      0 0.225em 0.375em 0 #cecece;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(100% + 0.375em);
    background-color: transparent;
    transition: height 0.25s ease;
  }
}

// 在已有的样式中添加
.user-avatar {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #f5f5f5;
  margin: 0 auto;

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
    background-color: #f0f0f0;
  }
}

// 可选：添加头像悬停效果
.user-avatar {
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
}

// 确保表格单元格垂直居中
.el-table {
  .el-table__cell {
    vertical-align: middle;
  }
}
</style>
