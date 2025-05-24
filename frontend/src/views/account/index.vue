<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="account-layout">
    <!-- 头部区域 -->
    <header class="main-header">
      <div class="container m-top-20">
        <h1 class="logo">
          <RouterLink to="/">請喝湯</RouterLink>
        </h1>
        <div class="entry-group">

          <button class="enter-button" @click="router.push('/home')">
            進入大廳
          </button>

        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <div class="page-container">
      <div class="account-content">
        <!-- 左侧导航 -->
        <VaCard class="sidebar-card">
          <VaCardContent>
            <nav class="nav-menu">
              <router-link
                to="/account"
                class="nav-item"
                :class="{ active: activeTab === 'profile' }"
              >
                <VaIcon name="person" />
                <span>帳號資料</span>
              </router-link>

              <router-link
                to="/account/profile-settings"
                class="nav-item"
                :class="{ active: activeTab === 'settings' }"
              >
                <VaIcon name="settings" />
                <span>設定帳號資料</span>
              </router-link>

              <router-link
                to="/account/change-password"
                class="nav-item"
                :class="{ active: activeTab === 'reset' }"
              >
                <VaIcon name="lock" />
                <span>重設密碼</span>
              </router-link>
            </nav>
          </VaCardContent>
        </VaCard>

        <!-- 右侧内容区 -->
        <VaCard class="content-card">
          <VaCardContent>
            <router-view v-slot="{ Component }">
              <Transition name="fade" mode="out-in">
                <component :is="Component" />
              </Transition>
            </router-view>
          </VaCardContent>
        </VaCard>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.account-layout {
  min-height: 100vh;
  background-color: var(--va-background);
}

.main-header {
  background: #ffffff;
  border-bottom: 1px solid #eaeaea;
  padding: 16px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;

  .logo-image {
    width: 48px;
    height: 48px;
    margin-right: 16px;
  }

  .brand {
    .brand-title {
      font-size: 24px;
      font-weight: bold;
      color: #333;
      margin: 0;
    }

    .brand-subtitle {
      font-size: 14px;
      color: #666;
    }
  }
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
}

.account-content {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
}

.sidebar-card {
  height: fit-content;
  border-radius: 12px;
  overflow: hidden;

  .nav-menu {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-radius: 8px;
    color: #666;
    text-decoration: none;
    transition: all 0.3s ease;

    .va-icon {
      margin-right: 12px;
      font-size: 20px;
    }

    span {
      font-size: 16px;
      font-weight: 500;
    }

    &:hover {
      background-color: #f5f7fa;
      color: var(--va-primary);
    }

    &.active {
      background-color: var(--va-primary);
      color: #ffffff;
    }
  }
}

.content-card {
  border-radius: 12px;
  min-height: 600px;
}

// 动画效果
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// 响应式设计
@media (max-width: 768px) {
  .account-content {
    grid-template-columns: 1fr;
  }

  .page-container {
    padding: 20px 16px;
  }

  .main-header .container {
    padding: 0 16px;
  }

  .logo-link {
    .brand-subtitle {
      display: none;
    }
  }
}

// 保持原有的 enter-button 样式，但略作调整
.enter-button {
  position: relative;
  font: inherit;
  background-color: #f0f0f0;
  border: 0;
  color: #242424;
  border-radius: 999px;
  font-size: 1.2rem;
  padding: 0.5em 1em;
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
  transition: all 0.25s ease;

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
}

// 添加淡入效果
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}


</style>


