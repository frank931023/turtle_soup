<script setup>
import { ref, onMounted } from 'vue';

const showEntry = ref(false);

const form = ref({
  account: '',
  password: '',
  agree: false,
})

const rules = {
  account: [
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
  // 呼叫form元素的校驗方法
  formRef.value.validate((valid) => {
    console.log(valid);
  })
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
              <el-form-item  label="帳號" prop="account">
                <el-input v-model="form.account" />
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
}

/* 整個背景深色 */
body {
  background: var(--background-color);
}

/* 頂部 header */
.login-header {
  background: #fff;
  border-bottom: 1px solid #ddd;

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
  background: var(--background-color);
  min-height: calc(100vh - 150px); /* 扣掉 header footer */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;

  .wrapper {
    width: 400px;
    background: var(--box-background);
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    padding: 30px 40px;
    text-align: center;

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
