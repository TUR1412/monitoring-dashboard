// src/stores/runtime.js
// 全局运行时编排：统一“刷新/轮询/实时模式”的开关与节奏，避免组件各自 setInterval。

import { defineStore } from 'pinia'
import { safeStorage } from '@/utils/storage'
import { demoSleep } from '@/utils/sleep'

const STORAGE_KEY = 'monitoring-dashboard:runtime'

const clampInterval = (value) => {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return 5000
  // 1s ~ 60s：避免过度刷新造成 UI 抖动与电量消耗
  return Math.min(60000, Math.max(1000, Math.round(parsed)))
}

const readPersisted = () => {
  const raw = safeStorage.get(STORAGE_KEY, null)
  if (!raw || typeof raw !== 'object') return null
  return raw
}

let timerId = null

export const useRuntimeStore = defineStore('runtime', {
  state: () => {
    const persisted = readPersisted() || {}
    return {
      autoRefreshEnabled: persisted.autoRefreshEnabled ?? true,
      refreshIntervalMs: clampInterval(persisted.refreshIntervalMs ?? 5000),
      lastRefreshAt: persisted.lastRefreshAt ?? null,
      refreshing: false
    }
  },
  getters: {
    isRunning: () => timerId !== null
  },
  actions: {
    hydrate() {
      const persisted = readPersisted()
      if (!persisted) return
      if (typeof persisted.autoRefreshEnabled === 'boolean') {
        this.autoRefreshEnabled = persisted.autoRefreshEnabled
      }
      if (persisted.refreshIntervalMs !== undefined) {
        this.refreshIntervalMs = clampInterval(persisted.refreshIntervalMs)
      }
      if (persisted.lastRefreshAt !== undefined) {
        this.lastRefreshAt = persisted.lastRefreshAt
      }
    },

    persist() {
      safeStorage.set(STORAGE_KEY, {
        autoRefreshEnabled: this.autoRefreshEnabled,
        refreshIntervalMs: this.refreshIntervalMs,
        lastRefreshAt: this.lastRefreshAt
      })
    },

    setRefreshIntervalMs(next) {
      this.refreshIntervalMs = clampInterval(next)
      this.persist()
      if (timerId !== null) {
        this.restartAutoRefresh()
      }
    },

    enableAutoRefresh() {
      this.autoRefreshEnabled = true
      this.persist()
      this.startAutoRefresh()
    },

    disableAutoRefresh() {
      this.autoRefreshEnabled = false
      this.persist()
      this.stopAutoRefresh()
    },

    toggleAutoRefresh() {
      if (this.autoRefreshEnabled) {
        this.disableAutoRefresh()
        return
      }
      this.enableAutoRefresh()
    },

    startAutoRefresh() {
      if (timerId !== null) return
      if (!this.autoRefreshEnabled) return

      void this.refreshNow()
      timerId = setInterval(() => {
        void this.refreshNow()
      }, this.refreshIntervalMs)
    },

    stopAutoRefresh() {
      if (timerId === null) return
      clearInterval(timerId)
      timerId = null
    },

    restartAutoRefresh() {
      this.stopAutoRefresh()
      this.startAutoRefresh()
    },

    async refreshNow() {
      if (this.refreshing) return
      this.refreshing = true
      try {
        // 可控演示延迟：默认 0ms（不会人为拖慢交互）
        await demoSleep()

        const { useTelemetryStore } = await import('@/stores/telemetry')
        const { useAlertsStore } = await import('@/stores/alerts')

        const telemetryStore = useTelemetryStore()
        const alertsStore = useAlertsStore()

        telemetryStore.refreshAll?.()
        alertsStore.fetchAlerts?.()

        this.lastRefreshAt = Date.now()
        this.persist()
      } finally {
        this.refreshing = false
      }
    }
  }
})
