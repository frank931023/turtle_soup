<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from "@/stores/user.js";
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

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
const handleSocialLogin = (provider) => {
  try {
    console.log(`Logging in with ${provider}`)
    // TODO: 實作社交媒體登入邏輯
    ElMessage({
      type: 'info',
      message: `${provider} 登入功能開發中...`
    })
  } catch (error) {
    ElMessage({
      type: 'error',
      message: '登入失敗，請稍後再試'
    })
  }
}

onMounted(() => {
  setTimeout(() => {
    showEntry.value = true;
  }, 100); // 小延遲，讓動畫更順
});
</script>


<template>
  <div>
    <header class="login-header">
      <div class="container m-top-20">
        <h1 class="logo">
          <RouterLink to="/">請喝湯</RouterLink>
        </h1>
        <RouterLink class="entry" :class="{ show: showEntry }" to="/">
          進入大廳
          <i class="iconfont icon-angle-right"></i>
          <i class="iconfont icon-angle-right"></i>
        </RouterLink>
      </div>
    </header>
    <section class="login-section">
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
              <el-button size="large" class="subBtn" @click="doLogin">點擊登入</el-button>
            </el-form>
          </div>
          <div class="social-login">
          <div class="divider">
            <span>或使用以下方式登入</span>
          </div>
          <div class="social-buttons">
            <el-button 
              class="facebook-btn" 
              @click="handleSocialLogin('Facebook')"
            >
              <i class="fab fa-facebook-f"></i>
              Facebook 登入
            </el-button>
            <el-button 
              class="google-btn" 
              @click="handleSocialLogin('Google')"
            >
              <i class="fab fa-google"></i>
              Google 登入
            </el-button>
          </div>
        </div>
        </div>
      </div>
    </section>

    <footer class="login-footer">
      <div class="container">
        <p>
          <a href="javascript:;">關於我們</a>

        </p>
        <p>CopyRight &copy; 中央大學</p>
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
  --primary-font: 'Noto Sans TC', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --heading-font: 'Poppins', 'Noto Sans TC', sans-serif;
}

/* 整個背景深色 */
body {
  background: var(--background-color);
  font-family: var(--primary-font);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 頂部 header */
.login-header {
  background: #fff;
  border-bottom: 1px solid #ddd;
  font-family: var(--heading-font);
  letter-spacing: 1px;

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
  background: var(--background-color); /* Your background color */
  min-height: calc(100vh - 150px); /* Keeps the original height, adjusting for header/footer */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  position: relative;
  z-index: 0; /* Ensures the background takes full space */

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('@/assets/background.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0.6;// 調整透明度
    z-index: 0;
  }

  .wrapper {
    background-image: url('@/assets/background.png'); // 使用原本的背景圖
    background-size: cover;
    background-position: center;
    opacity: 0.8;// 調整透明度
    position: relative;
    z-index: 1;
    width: 400px;
    border-radius: 6px;
    padding: 30px 40px;
    text-align: center;

    nav {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--heading-font);
      letter-spacing: 0.5px;
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 30px;
      background: rgba(255, 255, 255, 0.6); // 只讓導航區域半透明
      backdrop-filter: blur(5px);
      border-radius: 4px;
      padding: 10px 20px;

      a {
        color: var(--text-color);
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 10px;
      }
    }

    .account-box {
      
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      padding: 20px;
      .form {
        background: rgba(255, 255, 255, 0.95); // 表單區域加上微透明白色背景
        border-radius: 4px;
        padding: 20px;
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
            font-family: var(--primary-font);
            letter-spacing: 1px;
            width: 100%;
            height: 44px;
            background: #4CAF50; // 改用更醒目的綠色
            border: none;
            color: white;
            font-weight: bold;
            font-size: 16px;
            margin-top: 20px;
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
            border-radius: 4px;
            cursor: pointer;
            
            // 添加滑鼠懸停效果
            &:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
              background: #45a049;
              
              &::after {
                opacity: 1;
              }
            }
  
            // 添加點擊效果
            &:active {
              transform: translateY(1px);
              box-shadow: 0 2px 6px rgba(76, 175, 80, 0.2);
            }
            
            // 添加漸層光效果
            &::after {
              content: "";
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: linear-gradient(rgba(255,255,255,0.2), rgba(255,255,255,0));
              opacity: 0;
              transition: opacity 0.3s ease;
            }
  
            // 禁用狀態
            &:disabled {
              background: #cccccc;
              cursor: not-allowed;
              transform: none;
              box-shadow: none;
              
              &:hover {
                transform: none;
                box-shadow: none;
              }
            }
          }
          }
        }
      }
    }
  }


.social-login {
  margin-top: 20px;
  
  .divider {
    display: flex;
    align-items: center;
    margin: 20px 0;
    
    &::before,
    &::after {
      content: "";
      flex: 1;
      border-bottom: 1px solid #ddd;
    }
    
    span {
      padding: 0 10px;
      color: #666;
      font-size: 14px;
    }
  }
  
  .social-buttons {
  display: flex;
  gap: 10px;
  margin-top: 15px;
    
  .el-button {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 40px;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    
    i {
      font-size: 18px;
      transition: transform 0.3s ease;
    }

    // 懸停效果
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

      i {
        transform: scale(1.1);
      }

      &::after {
        opacity: 1;
      }
    }

    // 點擊效果
    &:active {
      transform: translateY(1px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }
    
  .facebook-btn {
    background-color: #1877f2;
    color: white;
    
    &:hover {
      background-color: #1664d9;
    }

    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(rgba(255,255,255,0.2), rgba(255,255,255,0));
      opacity: 0;
      transition: opacity 0.3s ease;
    }
  }
    
  .google-btn {
    background-color: #fff;
    color: #444;
    border: 1px solid #ddd;
    
    &:hover {
      background-color: #f8f8f8;
      border-color: #ccc;
    }

    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(rgba(0,0,0,0.05), rgba(0,0,0,0));
      opacity: 0;
      transition: opacity 0.3s ease;
    }
  }
}
}

/* Footer */
.login-footer {
  background: #fff;
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
</style>
