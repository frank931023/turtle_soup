<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from "@/stores/user.js";
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import bgUrl from '@/assets/login-background.png'
import GoogleLoginButton from "@/views/login/components/LoginGoogle.vue"
import LoginGithub from '@/views/login/components/LoginGithub.vue'

const showEntry = ref(false);
const router = useRouter()
const userStore = useUserStore()

const form = ref({
  username: '',
  password: '',
  agree: false,
})

const rules = {
  username: [
    {required: true, message: '用戶名不能為空', trigger: 'blur'},
  ],
  password: [
    {required: true, message: '密碼不能為空', trigger: 'blur'},
    {min: 6, max: 14, message: '密碼長度需介於6-14之間', trigger: 'blur'},
  ],
  agree: [
    {
      validator: (rule, value, callback) => {
        // 校驗邏輯
        if(value) {
          callback()
        } else{
          callback("請勾選服務條款")
        }
      }

    }
  ]
}
// 指向form元素
const formRef = ref(null)
const doLogin = () => {
  const {username, password} = form.value
  // 呼叫form元素的校驗方法
  formRef.value.validate( async (valid) => {
    console.log(valid);

    // 如果true 才登入
    if(valid) {
      // 用pinia封装過的user store 獲取用戶資料 以及登入
      await userStore.getUserInfo({username, password})

      ElMessage({type: 'success', message: '登入成功'})
      router.replace({path: "/"})
    }
  })
}

const goToRegister = () => {
  router.push('/register')
}

onMounted(() => {
  setTimeout(() => {
    showEntry.value = true;
  }, 100); // 小延遲，讓動畫更順
});
</script>


<template>
  <div>
    <header class="main-header">
      <div class="container m-top-20">
        <h1 class="logo">
          <RouterLink to="/">請喝湯</RouterLink>
        </h1>
        <div class="entry-group">

          <button class="enter-button" @click="router.push('/')">
            進入大廳
          </button>

        </div>
      </div>
    </header>
    <section
      class="login-section"
      :style="{
    backgroundImage: `url(${bgUrl})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundColor: '#111'
  }"
    >
      <div class="overlay">
      <div class="wrapper">
        <nav>
          <a href="javascript:;">帳號登入</a>
        </nav>
        <div class="account-box">
          <div class="form">
            <el-form :model="form" :rules="rules" label-position="right" label-width="60px"
                     status-icon ref="formRef" >
              <el-form-item  label="帳號" prop="username">
                <el-input v-model="form.username" />
              </el-form-item>
              <el-form-item label="密碼" prop="password" >
                <el-input v-model="form.password" type="password" />
              </el-form-item>
              <el-form-item label-width="22px" prop="agree">
                <el-checkbox  size="large" v-model="form.agree">
                  我已經同意服務條款
                </el-checkbox>
              </el-form-item>
              <el-row :gutter="12">
                <el-col :span="12">
                  <el-button size="large" class="subBtn" @click="doLogin" type="primary" plain block>登入</el-button>
                </el-col>
                <el-col :span="12">
                  <el-button size="large" class="subBtn registerBtn" @click="goToRegister" type="success" plain block>註冊</el-button>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div class="social-login">
          <div class="divider">
            <span>或使用以下方式登入</span>
          </div>
          <div class="social-buttons">

            <GoogleLoginButton/>
            <br>
            <LoginGithub/>

          </div>
        </div>
        </div>
      </div>
      </div>

    </section>

    <footer class="login-footer">
      <div class="container">
        <p class="footer-links">
          <a href="javascript:;">關於我們</a>
          <span>|</span>
          <a href="javascript:;">使用條款</a>
          <span>|</span>
          <a href="javascript:;">聯絡我們</a>
        </p>
        <p class="copyright">© 中央大學，All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped lang='scss'>
/* 變數 */
:root {
  --primary-color: #666;
  --hover-color: #444;
  --text-color: #333;
  --background-color: #222;
  --box-background: #fff;
  --footer-text-color: #999;
}

/* 整個背景深色 */
body {
  background: #222;
}

/* 頂部 header */
.main-header {
  background: #e8e8e8;
  border-bottom: 1px solid #f3f3f3;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .logo {
      font-size: 24px;
      font-weight: bold;
      margin-left: 10px;

      a {
        color: var(--text-color);
        text-decoration: none;
      }
    }

    .entry-group {
      display: flex;
      gap: 20px;
      align-items: center;
      margin-left: auto;
    }

    .entry {
      font-size: 16px;
      color: var(--text-color);
      text-decoration: none;
      display: flex;
      align-items: center;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.6s ease;

      i {
        font-size: 14px;
        margin-left: 4px;
      }

      &.show {
        opacity: 1;
        transform: translateY(0);
      }

      &:hover {
        text-decoration: none;
        transform: scale(1.05) translateY(-2px); /* 放大 + 微微上移 */
        transition: all 0.3s ease;
      }
    }
  }
}

/* 登入區 section */
.login-section {
  //background: var(--background-color);
  min-height: calc(100vh - 150px); /* 扣掉 header footer */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;

  .wrapper {
    width: 400px;
    background-color: rgba(255, 255, 255, 0.8); // 半透明黑遮罩
    padding: 30px 40px;
    text-align: center;
    border-radius: 6px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4); // 更深一點的陰影


    nav {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 30px;
      color: var(--text-color);

      a {
        text-decoration: none;
        color: inherit;
      }
    }

    .account-box {
      .form {
        .el-form {
          .el-form-item {
            margin-bottom: 20px;

            .el-input input {
              height: 42px;
              background: #f5f5f5;
              border-radius: 4px;
              border: 1px solid #ccc;
            }
          }

          .el-checkbox {
            color: var(--text-color);
            margin-top: 10px;
          }

          .el-button {
            width: 100%;
            height: 44px;
            background: #ddd;
            border: none;
            color: var(--text-color);
            font-weight: bold;
            font-size: 16px;
            margin-top: 20px;
            transition: background-color 0.3s;

            &:hover {
              background: #bbb;
            }
          }
        }
      }
    }
  }
}

/* Footer */
.login-footer {
  background: #dfdfdf;
  padding: 30px 0 20px;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;

    p {
      margin: 10px 0;
      color: var(--footer-text-color);
      font-size: 14px;

      a {
        color: var(--footer-text-color);
        margin: 0 6px;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}


.social-buttons {
  display: flex;
  flex-direction: column;
  justify-content: space-between;  // 左右對齊
  gap: 0; // 若有空隙不需要可設為0

  .el-button,
  .google-login-button,
  .github-login-button {
    width: 100%;             // 填滿父層寬度
    height: 40px;
    font-size: 14px;
    font-weight: bold;
    border-radius: 3px;
  }

}


.divider {
  display: flex;
  align-items: center;
  text-align: center;
  color: var(--text-color);
  font-size: 14px;
  margin: 20px 0;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #ddd;
  }

  span {
    padding: 0 12px;
    white-space: nowrap;
  }
}


.subBtn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  font-weight: bold;
}

.registerBtn {
  background: #fff;
  color: #28a745;
  border: 1px solid #28a745;

  &:hover {
    background: #28a745;
    color: #fff;
  }
}


.enter-button {
  position: relative;
  font: inherit;
  background-color: #f0f0f0;
  border: 0;
  color: #242424;
  border-radius: 999px;
  font-size: 1.4rem;
  margin-bottom: 10px;
  padding: 0.25em 0.75em;
  font-weight: 600;
  text-shadow: 0 0.0625em 0 #fff;
  box-shadow: inset 0 0.0625em 0 0 #f4f4f4, 0 0.0625em 0 0 #efefef,
    0 0.125em 0 0 #ececec, 0 0.25em 0 0 #e0e0e0, 0 0.3125em 0 0 #dedede,
    0 0.375em 0 0 #dcdcdc, 0 0.425em 0 0 #cacaca, 0 0.425em 0.5em 0 #cecece;
  transition: 0.25s ease;
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  &:active,
  &:hover {
    transform: translateY(0.225em);
    box-shadow: inset 0 0.03em 0 0 #f4f4f4, 0 0.03em 0 0 #efefef,
      0 0.0625em 0 0 #ececec, 0 0.125em 0 0 #e0e0e0, 0 0.125em 0 0 #dedede,
      0 0.2em 0 0 #dcdcdc, 0 0.225em 0 0 #cacaca,
      0 0.225em 0.375em 0 #cecece;

    &:after {
      height: calc(100% + 0.225em);
    }
  }

  &:after {
    position: absolute;
    content: "";
    display: block;
    width: 100%;
    height: calc(100% + 0.375em);
    top: 0;
    left: 0;
    background-color: transparent;
    transition: height 0.25s ease;
  }
}
</style>
