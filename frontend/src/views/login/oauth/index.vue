<script setup>
import { useRoute, useRouter } from 'vue-router'

import { useUserStore }  from '@/stores/user.js'
import { ElMessage } from 'element-plus'
const route = useRoute()
const router = useRouter()
const token = route.query.token
const userStore = useUserStore()


// 前端抓到後端的token，進行解碼 避免utf8亂碼
function parseJwt(token) {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  )
  return JSON.parse(jsonPayload)
}
if (token) {
  const payload = parseJwt(token)  // 解出 username
  userStore.getGithubUserInfo({
    token,
    user: {
      id: payload.id,
      role: payload.role,
      name: payload.name,
      username: payload.username,
      score: payload.score,
      avatarUrl: payload.avatarUrl,
    }
  })
  ElMessage({type: 'success', message: 'Github登入成功'})
  router.replace('/')
}

</script>

<template>

</template>

<style scoped lang="scss">

</style>
