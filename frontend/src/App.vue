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

import { onMounted } from 'vue'
import { useAudioStore } from '@/stores/audio'

const audioStore = useAudioStore()

// 音樂播放
onMounted(() => {
  const tryPlay = () => {
    audioStore.play()
    document.removeEventListener('click', tryPlay)
  }
  document.addEventListener('click', tryPlay)
})

</script>

<style lang="scss">

</style>
