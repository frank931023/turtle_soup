<template>
  <div class="app-container">
    <!-- 使用 RouterView 作為主要內容顯示區域 -->
    <RouterView/>
    <BGMusic />
  </div>


</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import BGMusic from '@/components/BGMusic.vue'

</script>

<style lang="scss">

</style>
