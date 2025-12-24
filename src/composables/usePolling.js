// src/composables/usePolling.js
// 轮询/计时器统一封装：避免组件内重复 setInterval/clearInterval，并防止异步重入。

import { onMounted, onUnmounted } from 'vue'

export const usePolling = (task, intervalMs, options = {}) => {
  const { immediate = true } = options

  let timerId = null
  let running = false

  const tick = async () => {
    if (running) return
    try {
      running = true
      await task?.()
    } finally {
      running = false
    }
  }

  const start = () => {
    if (timerId !== null) return
    if (immediate) void tick()
    timerId = setInterval(() => void tick(), intervalMs)
  }

  const stop = () => {
    if (timerId === null) return
    clearInterval(timerId)
    timerId = null
  }

  onMounted(start)
  onUnmounted(stop)

  return { start, stop, tick }
}

