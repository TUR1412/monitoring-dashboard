// src/stores/auth.js
// 认证与会话：登录态、token、本地持久化（演示版）。

import { defineStore } from 'pinia'
import { safeStorage } from '@/utils/storage'

const STORAGE_KEYS = {
  user: 'monitoring-dashboard:user',
  authToken: 'monitoring-dashboard:authToken'
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: safeStorage.get(STORAGE_KEYS.user, null),
    token: safeStorage.get(STORAGE_KEYS.authToken, null)
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.user && state.token)
  },
  actions: {
    hydrate() {
      this.user = safeStorage.get(STORAGE_KEYS.user, null)
      this.token = safeStorage.get(STORAGE_KEYS.authToken, null)
    },

    async login(username, password) {
      // 模拟 API 请求延迟（避免过长阻塞交互）
      await new Promise((resolve) => setTimeout(resolve, 350))

      if (username === 'admin' && password === 'password') {
        this.user = { name: '管理员用户', role: 'ADMIN' }
        this.token = 'mock-token'
        safeStorage.set(STORAGE_KEYS.user, this.user)
        safeStorage.set(STORAGE_KEYS.authToken, this.token)
        return
      }

      throw new Error('用户名或密码错误')
    },

    logout() {
      this.user = null
      this.token = null
      safeStorage.remove(STORAGE_KEYS.user)
      safeStorage.remove(STORAGE_KEYS.authToken)
    }
  }
})

