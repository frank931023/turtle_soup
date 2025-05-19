import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAudioStore = defineStore('audio', () => {
  const audio = ref(null)
  const isPlaying = ref(false)

  // 初始化音頻
  const initAudio = (audioElement) => {
    audio.value = audioElement
    // 從本地存儲獲取聲音狀態
    const soundEnabled = localStorage.getItem('soundEnabled') === 'true'
    isPlaying.value = soundEnabled

    if (soundEnabled && audio.value) {
      audio.value.play()
    }
  }

  // 播放音樂
  const play = () => {
    if (audio.value) {
      audio.value.play()
      isPlaying.value = true
    }
  }

  // 暫停音樂
  const pause = () => {
    if (audio.value) {
      audio.value.pause()
      isPlaying.value = false
    }
  }

  // 設置音量
  const setVolume = (value) => {
    if (audio.value) {
      audio.value.volume = value
    }
  }

  return {
    audio,
    isPlaying,
    initAudio,
    play,
    pause,
    setVolume
  }
})
