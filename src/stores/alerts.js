// src/stores/alerts.js
// 告警中心（演示数据）：闭环操作 + 本地持久化。

import { defineStore } from 'pinia'
import { safeStorage } from '@/utils/storage'

const STORAGE_KEY = 'monitoring-dashboard:alerts'

const seedAlerts = () => ([
  {
    id: 'a-001',
    level: 'critical',
    title: 'CPU 使用率异常',
    message: 'CPU 使用率持续高于阈值。',
    timestamp: Date.now() - 30 * 60 * 1000,
    source: '系统监控',
    acknowledged: false,
    muted: false,
    archived: false
  },
  {
    id: 'a-002',
    level: 'error',
    title: '数据库连接失败',
    message: '无法连接到数据库。',
    timestamp: Date.now() - 60 * 60 * 1000,
    source: '数据库服务',
    acknowledged: false,
    muted: false,
    archived: false
  },
  {
    id: 'a-003',
    level: 'info',
    title: '系统维护通知',
    message: '系统维护将在今晚 12 点开始。',
    timestamp: Date.now() - 25 * 60 * 60 * 1000,
    source: '系统通知',
    acknowledged: true,
    muted: false,
    archived: false
  }
])

export const useAlertsStore = defineStore('alerts', {
  state: () => ({
    alerts: safeStorage.get(STORAGE_KEY, seedAlerts())
  }),
  getters: {
    activeAlerts: (state) => (state.alerts || []).filter((a) => !a.archived),
    unacknowledgedCount: (state) => (state.alerts || []).filter((a) => !a.acknowledged && !a.archived).length
  },
  actions: {
    hydrate() {
      const alerts = safeStorage.get(STORAGE_KEY, null)
      this.alerts = Array.isArray(alerts) ? alerts : seedAlerts()
      this.persist()
    },

    persist() {
      safeStorage.set(STORAGE_KEY, this.alerts)
    },

    fetchAlerts() {
      // 演示数据已在 state 中初始化；预留真实 API 接入点
      this.hydrate()
    },

    acknowledgeAlert(alertId) {
      const index = this.alerts.findIndex((a) => a.id === alertId)
      if (index === -1) return
      this.alerts = [
        ...this.alerts.slice(0, index),
        { ...this.alerts[index], acknowledged: true, updatedAt: Date.now() },
        ...this.alerts.slice(index + 1)
      ]
      this.persist()
    },

    muteAlert(alertId) {
      const index = this.alerts.findIndex((a) => a.id === alertId)
      if (index === -1) return
      const current = this.alerts[index]
      this.alerts = [
        ...this.alerts.slice(0, index),
        { ...current, muted: !current.muted, updatedAt: Date.now() },
        ...this.alerts.slice(index + 1)
      ]
      this.persist()
    },

    archiveAlert(alertId) {
      const index = this.alerts.findIndex((a) => a.id === alertId)
      if (index === -1) return
      this.alerts = [
        ...this.alerts.slice(0, index),
        { ...this.alerts[index], archived: true, updatedAt: Date.now() },
        ...this.alerts.slice(index + 1)
      ]
      this.persist()
    },

    archiveAlerts(alertIds) {
      const ids = new Set(alertIds || [])
      this.alerts = this.alerts.map((alert) =>
        ids.has(alert.id) ? { ...alert, archived: true, updatedAt: Date.now() } : alert
      )
      this.persist()
    },

    restoreAlert(alertId) {
      const index = this.alerts.findIndex((a) => a.id === alertId)
      if (index === -1) return
      this.alerts = [
        ...this.alerts.slice(0, index),
        { ...this.alerts[index], archived: false, updatedAt: Date.now() },
        ...this.alerts.slice(index + 1)
      ]
      this.persist()
    }
  }
})

