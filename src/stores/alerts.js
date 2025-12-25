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

const pick = (items) => items[Math.floor(Math.random() * items.length)]

const buildDemoAlert = () => {
  const now = Date.now()
  const candidates = [
    {
      level: 'warning',
      title: '网络抖动检测',
      message: '网络延迟出现短时上升，建议关注链路质量。',
      source: '网络监控'
    },
    {
      level: 'error',
      title: '服务响应异常',
      message: '部分请求响应时间超出阈值。',
      source: '应用监控'
    },
    {
      level: 'info',
      title: '自动巡检完成',
      message: '巡检任务已完成，未发现阻断级问题。',
      source: '系统监控'
    }
  ]
  const payload = pick(candidates)
  return {
    id: `a-${now}`,
    ...payload,
    timestamp: now,
    acknowledged: false,
    muted: false,
    archived: false
  }
}

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
      if (Array.isArray(alerts)) {
        this.alerts = alerts
        return
      }
      this.alerts = seedAlerts()
      this.persist()
    },

    persist() {
      safeStorage.set(STORAGE_KEY, this.alerts)
    },

    fetchAlerts() {
      // 演示刷新：以较低概率生成一条新告警，模拟“实时告警流”。
      if (!Array.isArray(this.alerts)) {
        this.hydrate()
      }

      const shouldEmit = Math.random() < 0.12
      if (!shouldEmit) return

      const next = buildDemoAlert()
      this.alerts = [next, ...(this.alerts || [])].slice(0, 120)
      this.persist()
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

