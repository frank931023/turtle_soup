<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAudioStore } from '@/stores/audio'

const audioStore = useAudioStore()
const audioRef = ref(null)

// 監聽全局的聲音狀態改變
const handleSoundToggle = (event) => {
  const { enabled } = event.detail
  if (enabled) {
    audioStore.play()
  } else {
    audioStore.pause()
  }
}

onMounted(() => {
  // 初始化音頻
  if (audioRef.value) {
    audioStore.initAudio(audioRef.value)
    audioStore.setVolume(0.5) // 設置默認音量
  }

  // 監聽聲音切換事件
  window.addEventListener('sound-toggle', handleSoundToggle)
})

onUnmounted(() => {
  window.removeEventListener('sound-toggle', handleSoundToggle)
})
</script>

<template>
  <audio
    ref="audioRef"
    loop
    preload="auto"
    src="/music/bgm.mp3"
  />
</template>
