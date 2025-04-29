<script setup>
import router from "@/router/index.js";

// 使用pinia讀取月護資訊
import {useUserStore} from '@/stores/user.js'
const userStore = useUserStore()


const handleConfirm = () => {
  // 確認後刪除用戶訊息跳轉到首頁或其他一級路由
  userStore.cleanUserInfo()
  router.push('/login');

}
</script>

<template>
  <nav class="app-topnav">
    <div class="container">
      <ul>
        <template v-if="userStore.userInfo.token">
          <li><a href="javascript:;"><i class="iconfont icon-user"></i>{{userStore.userInfo.user.username}}</a></li>
          <li>
            <el-popconfirm title="確認退出嗎?" confirm-button-text="確認" cancel-button-text="取消" @confirm="handleConfirm">
              <template #reference>
                <a href="javascript:;">退出登入</a>
              </template>
            </el-popconfirm>
          </li>
          <li><router-link to="/account">玩家中心</router-link></li>
        </template>
        <template v-else>
          <li><router-link to="/login">請先登入</router-link></li>
          <li><a href="javascript:;">關於我們</a></li>
        </template>
      </ul>
    </div>
  </nav>
</template>


<style scoped lang="scss">
@use "sass:color";
.app-topnav {
  background: #333;
  border-bottom: 1px solid color.adjust(#333, $lightness: -10%);
  padding: 2px 0;

  .container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }

  ul {
    display: flex;
    align-items: center;

    li {
      position: relative;

      a {
        padding: 10px 18px;
        color: #cdcdcd;
        font-size: 14px;
        display: flex;
        align-items: center;
        transition: color 0.3s ease, background 0.3s ease;
        border-radius: 4px;

        i {
          font-size: 16px;
          margin-right: 5px;
        }

        &:hover {
          color: color.adjust($textColor, $lightness: -10%);
          background: rgba(255, 255, 255, 0.1);
        }
      }

      &:not(:last-child) {
        a {
          border-right: 2px solid color.adjust(#666, $lightness: -10%);
        }
      }
    }
  }
}

</style>
