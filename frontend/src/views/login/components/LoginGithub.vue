<template>
  <el-button class="github-login-button" @click="redirectToGithub">
    <i class="iconfont icon-github" style="margin-right: 8px;"></i>
    使用 GitHub 登入
  </el-button>
</template>

<script setup>
const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID
const redirectUri = import.meta.env.VITE_GITHUB_REDIRECT_URI

const redirectToGithub = () => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read:user`
  window.location.href = githubAuthUrl
}
</script>


<style lang="scss" scoped>
.github-login-button {
  background-color: #24292e;
  color: #fff;
  font-weight: bold;
  border: none;
  width: 100%;
  height: 44px;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.2s ease;
  &:hover {
    background-color: #444c56;
    transform: scale(1.02);
  }
}
</style>
