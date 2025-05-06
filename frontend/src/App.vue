<template>
  <div class="app-container">
    <!-- 使用 RouterView 作為主要內容顯示區域 -->
    <RouterView/>
    <Chatgame/>
  </div>

</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import Chatgame from '@/components/Chatgame.vue';
</script>

<style lang="scss">

</style>
