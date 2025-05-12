<script setup>
import { useRoute, useRouter } from 'vue-router'

import { useUserStore }  from '@/stores/user.js'
import { ElMessage } from 'element-plus'
const route = useRoute()
const router = useRouter()
const token = route.query.token
const userStore = useUserStore()
if (token) {
  const payload = JSON.parse(atob(token.split('.')[1]))  // 解出 username
  userStore.getGithubUserInfo({
    token,
    user: {
      username: payload.username,
      role: payload.role,
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
