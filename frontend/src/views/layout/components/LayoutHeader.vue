<script setup>
import router from "@/router";
import { useUserStore } from "@/stores/user.js";

const userStore = useUserStore();

const handleConfirm = () => {
  userStore.cleanUserInfo();
  router.push("/login");
};
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

    <ul class="app-header-nav">
      <li class="home">
        <RouterLink to="/">首頁</RouterLink>
        <RouterLink to="/">多人遊戲</RouterLink>
        <RouterLink to="/add-story">新增故事</RouterLink>
      </li>

    </ul>

    <!-- 右側：選單 + 喇叭 -->
    <div class="right-group">
      <ul class="nav">
        <template v-if="userStore.userInfo.token">
          <li>
            <a href="javascript:;"><i class="iconfont icon-user"></i>{{ userStore.userInfo.user.username }}</a>
          </li>
          <li>
            <el-popconfirm
              title="確認退出嗎?"
              confirm-button-text="確認"
              cancel-button-text="取消"
              @confirm="handleConfirm"
            >
              <template #reference>
                <a href="javascript:;">退出登入</a>
              </template>
            </el-popconfirm>
          </li>
          <li><router-link to="/account">玩家中心</router-link></li>
        </template>
        <template v-else>
          <li><router-link to="/login">登入</router-link></li>
          <li><router-link to=/about>關於我們</router-link></li>
        </template>
      </ul>
      <img src="@/assets/sound.png" alt="sound" class="sound-icon" />
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

  box-shadow:
    inset -6px -6px 0 #999;
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
        font-size: 28px;
        font-weight: bold;
        color: #333;
        margin: 0;
      }

      .subtitle {
        font-size: 16px;
        color: #777;
      }
    }
  }

  .app-header-nav{
    display: flex;
    align-items: center;

    li {
      margin-left: 20px;
      transition: all 0.3s ease;
      gap: 30px;

      a,
      .router-link-active {
        font-size: 26px;
        color: #333;
        font-weight: 500;
        text-decoration: none;
        display: inline-block;
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
  }

  .right-group{
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
        transition: all 0.3s ease;

        a,
        .router-link-active {
          font-size: 16px;
          color: #333;
          font-weight: 500;
          text-decoration: none;
          display: inline-block;
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
    }

    .sound-icon {
      width: 28px;
      height: 28px;
      cursor: pointer;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.2) rotate(10deg);
      }
    }
  }
}




</style>
