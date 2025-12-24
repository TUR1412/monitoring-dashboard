// src/stores/theme.js
// 主题偏好：light/dark、系统偏好识别、应用到 documentElement。

import { defineStore } from 'pinia'
import { safeStorage } from '@/utils/storage'

const STORAGE_KEY = 'monitoring-dashboard:theme'
const THEMES = ['light', 'dark']

const isValidTheme = (value) => THEMES.includes(value)

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: safeStorage.get(STORAGE_KEY, 'dark')
  }),
  getters: {
    isDark: (state) => state.theme === 'dark'
  },
  actions: {
    applyTheme() {
      if (typeof document === 'undefined') return
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(this.theme)
    },

    persistTheme() {
      safeStorage.set(STORAGE_KEY, this.theme)
    },

    initializeTheme() {
      const saved = safeStorage.get(STORAGE_KEY, null)
      if (isValidTheme(saved)) {
        this.theme = saved
      } else {
        const prefersDark = typeof window !== 'undefined'
          && window.matchMedia
          && window.matchMedia('(prefers-color-scheme: dark)').matches
        this.theme = prefersDark ? 'dark' : 'light'
        this.persistTheme()
      }
      this.applyTheme()
    },

    setTheme(nextTheme) {
      if (!isValidTheme(nextTheme)) return
      this.theme = nextTheme
      this.persistTheme()
      this.applyTheme()
    },

    toggleTheme() {
      this.setTheme(this.theme === 'dark' ? 'light' : 'dark')
    }
  }
})

