<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from "@/stores/user.js";
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import bgUrl from '@/assets/login-background.png'
import GoogleLoginButton from "@/views/login/components/LoginGoogle.vue"
import LoginGithub from '@/views/login/components/LoginGithub.vue'
import { checkUsernameExistsAPI } from "@/apis/register.js";

const showEntry = ref(false);
const router = useRouter()
const userStore = useUserStore()

const form = ref({
  username: '',
  password: '',
  confirmPassword: '',
  agree: false,
})

const rules = {
  username: [
    { required: true, message: '用戶名不能為空', trigger: 'blur' },
    {
      validator: async (rule, value, callback) => {
        if (!value) {
          return callback(new Error('用戶名不能為空'))
        }

        try {
          // 判斷是否被使用過了
          const res = await checkUsernameExistsAPI(value)
          // console.log(res)
          if (res.result.exists) {
            callback(new Error('此用戶名已被註冊'))
          } else {
            callback()
          }
        } catch (err) {
          callback(new Error('驗證失敗，請稍後再試'))
        }
      },
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: '密碼不能為空', trigger: 'blur' },
    { min: 6, max: 14, message: '密碼長度需介於6-14之間', trigger: 'blur' },
  ],
  confirmPassword: [
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('請再次輸入密碼'))
        } else if (value !== form.value.password) {
          callback(new Error('兩次輸入的密碼不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  agree: [
    {
      validator: (rule, value, callback) => {
        if (value) {
          callback()
        } else {
          callback('請勾選服務條款')
        }
      }
    }
  ]
}
// 指向form元素
const formRef = ref(null)
const doRegister = () => {
  const { username, password, confirmPassword } = form.value

  formRef.value.validate(async (valid) => {
    console.log(valid)

    if (valid) {
        // 呼叫 pinia 中的註冊方法，需根據實際方法名修改
        await userStore.getRegisterUser({ username, password })
        ElMessage({ type: 'success',message: '註冊成功' })
        router.replace({ path: '/home' })
    }
  })
}

const goToLogin = () => {
  router.push('/login')
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

          <button class="enter-button" @click="router.push('/home')">
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
                       status-icon ref="formRef">
                <el-form-item label="帳號" prop="username">
                  <el-input v-model="form.username" />
                </el-form-item>
                <el-form-item label="密碼" prop="password">
                  <el-input v-model="form.password" type="password" />
                </el-form-item>
                <el-form-item label="確認" prop="confirmPassword">
                  <el-input v-model="form.confirmPassword" type="password" />
                </el-form-item>
                <el-form-item label-width="22px" prop="agree">
                  <el-checkbox size="large" v-model="form.agree">
                    我已經同意服務條款
                  </el-checkbox>
                </el-form-item>
                <el-row :gutter="12">
                  <el-col :span="12">
                    <el-button size="large" class="subBtn" @click="doRegister" type="success" plain block>註冊</el-button>
                  </el-col>
                  <el-col :span="12">
                    <el-button size="large" class="subBtn registerBtn" @click="goToLogin" type="primary" plain block>返回登入</el-button>
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
.main-header {
  background: #e8e8e8;
  border-bottom: 1px solid #f3f3f3;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 10px 20px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .logo {
      font-size: 24px;
      font-weight: bold;
      margin-left: 10px;
      padding-top: 6px;

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

</style>
