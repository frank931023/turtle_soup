<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { motion } from 'motion-v'
import router from '@/router'
import { useUserStore } from '@/stores/user.js'
import soundOnIcon from '@/assets/sound.png'
import soundOffIcon from '@/assets/sound-off.png' // 确保您有这个图片
import { useAudioStore } from '@/stores/audio'


const audioStore = useAudioStore()
const userStore = useUserStore()
const openSection = ref(null)
const dropdownVisible = ref(false)
const isSoundOn = computed(() => audioStore.isPlaying)

function toggle(section) {
  if (openSection.value !== section) {
    openSection.value = section
  }
}


const soundIcon = computed(() => {
  return isSoundOn.value ? soundOnIcon : soundOffIcon
})

const toggleSound = () => {
  if (isSoundOn.value) {
    audioStore.pause()
  } else {
    audioStore.play()
  }
  localStorage.setItem('soundEnabled', !isSoundOn.value)
}


function navigateTo(path, section) {
  toggle(section)
  router.push(path)
}

function handleLogout() {
  userStore.cleanUserInfo()
  router.push('/login')
}

// 點擊外部關閉下拉選單
const dropdownRef = ref(null)
function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    dropdownVisible.value = false
  }
}
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  const savedSoundState = localStorage.getItem('soundEnabled')
  if (savedSoundState !== null) {
    isSoundOn.value = savedSoundState === 'true'
  }

})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <header class="header">
    <!-- 左側 LOGO 與標題 -->
    <div class="left">
      <router-link to="/"><img src="@/assets/soup.png" alt="logo" class="logo" /></router-link>
      <div class="title-group">
        <h1 class="title">請喝湯</h1>
        <span class="subtitle">一個人的AI海龜湯</span>
      </div>
    </div>

    <!-- 中間導航選單 -->
    <ul class="animated-nav">
      <li>
        <motion.div
          class="nav-item"
          :initial="{ width: '130px', backgroundColor: '#e0e0e0' }"
          :animate="openSection === 'home' ? { width: '200px', backgroundColor: '#a0c4ff' } : { width: '130px', backgroundColor: '#e0e0e0' }"
          transition="{ duration: 0.3 }"
          @click="() => navigateTo('/', 'home')"
        >
          <motion.div class="nav-text">首頁</motion.div>
        </motion.div>
      </li>
      <li>
        <motion.div
          class="nav-item"
          :initial="{ width: '130px', backgroundColor: '#e0e0e0' }"
          :animate="openSection === 'multi' ? { width: '200px', backgroundColor: '#bde0fe' } : { width: '130px', backgroundColor: '#e0e0e0' }"
          transition="{ duration: 0.3 }"
          @click="() => navigateTo('/', 'multi')"
        >
          <motion.div class="nav-text">多人遊戲</motion.div>
        </motion.div>
      </li>
      <li>
        <motion.div
          class="nav-item"
          :initial="{ width: '130px', backgroundColor: '#e0e0e0' }"
          :animate="openSection === 'add' ? { width: '200px', backgroundColor: '#ffc6ff' } : { width: '130px', backgroundColor: '#e0e0e0' }"
          transition="{ duration: 0.3 }"
          @click="() => navigateTo('/add-story', 'add')"
        >
          <motion.div class="nav-text">新增故事</motion.div>
        </motion.div>
      </li>
    </ul>

    <!-- 右側：帳號資訊 + 喇叭 -->
    <div class="right-group">
      <ul class="nav">
        <template v-if="userStore.userInfo.token">
          <li class="user-dropdown" ref="dropdownRef">
            <div
              class="btn account-btn"
              @click="dropdownVisible = !dropdownVisible"
            >
              <span class="text">{{ userStore.userInfo.user.username }}</span>
              <img
                class="avatar"
                :src="userStore.userInfo.user.avatarUrl || 'https://png.pngtree.com/png-clipart/20230817/original/pngtree-anonymous-user-unidentified-contact-avatar-picture-image_7998127.png'"
                alt="avatar"
              />
            </div>

            <motion.div
              v-if="dropdownVisible"
              layout
              class="dropdown-menu"
              :initial="{ opacity: 0, scale: 0.8, y: -20 }"
              :animate="{ opacity: 1, scale: 1, y: 0 }"
              :exit="{ opacity: 0, scale: 0.8, y: -20 }"
              :transition="{ type: 'spring', stiffness: 500, damping: 30, bounce: 0.4 }"
            >
              <template v-if="userStore.userInfo.user.role === 'admin'">
                <router-link to="/admin/users" class="dropdown-item">用戶管理</router-link>
                <router-link to="/admin/questions" class="dropdown-item">題目管理</router-link>
              </template>
              <router-link to="/account" class="dropdown-item">玩家中心</router-link>
              <router-link to="/history" class="dropdown-item">遊戲歷史</router-link>
              <a href="javascript:;" class="dropdown-item" @click="handleLogout">登出</a>
            </motion.div>
          </li>
        </template>

        <template v-else>
          <li><router-link to="/login">登入</router-link></li>
          <li><router-link to="/about">關於我們</router-link></li>
        </template>
      </ul>

      <!-- 喇叭 icon 加入動畫效果 -->
      <div
        class="sound-toggle"
        @click="toggleSound"
        :title="isSoundOn ? '關閉音效' : '開啟音效'"
      >
        <Transition name="fade" mode="out-in">
          <img
            :key="isSoundOn"
            :src="soundIcon"
            :alt="isSoundOn ? 'Sound on' : 'Sound off'"
            class="sound-icon"
          />
        </Transition>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background: #fff;
  box-shadow: inset -6px -6px 0 #999;

  .left {
    display: flex;
    align-items: center;

    .logo {
      width: 48px;
      height: 48px;
    }

    .title-group {
      margin-left: 16px;

      .title {
        font-size: 32px;
        font-weight: bold;
        color: #333;
        margin: 0;
      }

      .subtitle {
        font-size: 18px;
        color: #777;
      }
    }
  }

  .animated-nav {
    display: flex;
    gap: 32px;
    align-items: center;
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      cursor: pointer;
    }

    .nav-item {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 64px;
      border-radius: 32px;
      transition: all 0.3s ease;

      .nav-text {
        font-size: 24px;
        font-weight: 600;
        color: #333;
        padding: 0 16px;
      }
    }
  }

  .right-group {
    display: flex;
    align-items: center;

    .nav {
      display: flex;
      align-items: center;
      list-style: none;
      margin: 0 24px 0 0;
      padding: 0;

      li {
        margin-left: 20px;

        a {
          font-size: 18px;
          color: #333;
          font-weight: 500;
          text-decoration: none;
          padding: 8px 12px;
          border-radius: 6px;
          transition: all 0.4s ease;

          &:hover {
            transform: scale(1.12) translateY(-2px) rotate(-1deg);
            background: linear-gradient(135deg, #f0f0f0, #ddd);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            color: #111;
          }

          i {
            margin-right: 6px;
          }
        }
      }

      .user-dropdown {
        position: relative;
        display: flex;
        align-items: center;

        .user-trigger {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 10px;
          background-color: #f9f9f9;
          border-radius: 20px;
          cursor: pointer;
          transition: background-color 0.3s;

          &:hover {
            background-color: #e0e0e0;
          }

          .avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            object-fit: cover;
          }

          .username {
            font-size: 16px;
            font-weight: 600;
            color: #333;
            white-space: nowrap;
          }
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 8px;
          background: #fff;
          border: 1px solid #ccc;
          border-radius: 8px;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
          min-width: 160px;
          z-index: 1000;
          padding: 4px;


          .dropdown-item {
            padding: 10px 16px;
            font-size: 15px;
            color: #333;
            text-decoration: none;
            display: block;
            border-radius: 6px;
            transition: all 0.25s ease-in-out;
            transform-origin: left;

            &:hover {
              letter-spacing: 0.125rem;
              transition: all 0.5s cubic-bezier(0.65, -0.25, 0.25, 1.95);
              background-color: #fff;
              color: #202121;
              transform: scale(1.05);
            }
          }
        }
      }
    }

    .sound-icon {
      width: 28px;
      height: 28px;
      margin-left: 12px;
      cursor: pointer;
    }
  }
}
.dropdown-wrapper {
  position: relative;
  z-index: 999; // 保證選單浮在上面
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

  .btn.account-btn {
    font-size: 18px;
    font-weight: 600;
    background-color: #666666;
    padding: 2px 10px;
    display: flex;
    align-items: center;
    border-radius: 99px;
    position: relative;
    transition: all 0.5s cubic-bezier(0.77, 0, 0.175, 1);
    cursor: pointer;

    .avatar {
      width: 48px;
      height: 48px;
      margin-bottom: 10px;
      border-radius: 50%;
      object-fit: cover;
      margin-left: 4px;
      position: relative;
      top: 5px;
      z-index: 10;
    }

  .text {
    color: #fff;
    line-height: 1;
    position: relative;
    z-index: 5;
    margin-right: 20px;
    margin-left: 20px;

  }

  svg {
    display: inline-block;
    position: relative;
    z-index: 5;
    width: 20px;
    height: 20px;
    transform: rotate(0deg) translateX(0);
    transform-origin: left;
    transition: all 0.5s cubic-bezier(0.77, 0, 0.175, 1);
  }

  &::before {
    content: '';
    background-color: #999999;
    width: 32px;
    height: 32px;
    display: block;
    position: absolute;
    z-index: 1;
    border-radius: 99px;
    top: 50%;
    right: 16px;
    transform: translateY(-50%);
    transition: all 0.5s cubic-bezier(0.77, 0, 0.175, 1);
  }

  &:hover {
    svg {
      transform: rotate(45deg) translateX(-8px);
    }

    &::before {
      width: 100%;
      height: 100%;
      right: 0;
    }
  }
}

.sound-toggle {
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
}

.sound-icon {
  width: 28px;
  height: 28px;
  transition: all 0.3s ease;
  background: white !important;
}

// 添加过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
