<script setup>
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user.js'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const router = useRouter()

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

onMounted(() => {
  if (window.google && window.google.accounts?.id) {
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleGoogleCallback,
    })

    window.google.accounts.id.renderButton(
      document.getElementById('google-login-btn'),
      {
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        width: 323,
        shape: 'rectangular',
        logo_alignment: 'left',
      }
    )
  } else {
    console.warn('Google Identity Services SDK 未載入')
  }
})

window.handleGoogleCallback = async function (response) {
  const id_token = response.credential
  await userStore.getGoogleUserInfo({ id_token })
  ElMessage({type: 'success', message: 'Google登入成功'})
  router.replace('/home')
}
</script>

<template>
  <div id="google-login-btn" class="google-login-button"></div></template>
<style scoped>
.google-login-button {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 44px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.google-login-button:hover {
  transform: scale(1.02);
}
</style>
