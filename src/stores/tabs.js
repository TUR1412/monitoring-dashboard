// src/stores/tabs.js
// 顶部标签页：基于路由的轻量 Tab 模型，支持持久化与恢复。

import { defineStore } from 'pinia'
import { safeStorage } from '@/utils/storage'

const STORAGE_KEYS = {
  openTabs: 'monitoring-dashboard:openTabs',
  activeTab: 'monitoring-dashboard:activeTab'
}

const isValidTab = (tab) => {
  if (!tab || typeof tab !== 'object') return false
  if (!tab.name || !tab.path) return false
  return true
}

export const useTabsStore = defineStore('tabs', {
  state: () => ({
    openTabs: safeStorage.get(STORAGE_KEYS.openTabs, []),
    activeTab: safeStorage.get(STORAGE_KEYS.activeTab, null)
  }),
  actions: {
    hydrate() {
      const openTabs = safeStorage.get(STORAGE_KEYS.openTabs, [])
      const activeTab = safeStorage.get(STORAGE_KEYS.activeTab, null)

      this.openTabs = Array.isArray(openTabs) ? openTabs.filter(isValidTab) : []
      this.activeTab = typeof activeTab === 'string' ? activeTab : null

      this.persist()
    },

    persist() {
      safeStorage.set(STORAGE_KEYS.openTabs, this.openTabs)
      safeStorage.set(STORAGE_KEYS.activeTab, this.activeTab)
    },

    initializeTabs() {
      this.hydrate()
    },

    addTab(route) {
      if (!route?.name || !route?.path) return
      const name = String(route.name)
      const title = route?.meta?.title
      const nextTab = { name, path: route.path, meta: { title } }

      const exists = this.openTabs.some((tab) => tab.name === name)
      this.openTabs = exists ? this.openTabs : [...this.openTabs, nextTab]
      this.activeTab = name
      this.persist()
    },

    removeTab(name) {
      const tabName = String(name)
      const currentIndex = this.openTabs.findIndex((tab) => tab.name === tabName)
      if (currentIndex === -1) return

      const nextTabs = this.openTabs.filter((tab) => tab.name !== tabName)
      this.openTabs = nextTabs

      if (this.activeTab === tabName) {
        const fallback = nextTabs[Math.max(0, currentIndex - 1)]
        this.activeTab = fallback?.name || null
      }

      this.persist()
    },

    setActiveTab(name) {
      const tabName = String(name)
      this.activeTab = tabName
      this.persist()
    },

    clearTabs() {
      this.openTabs = []
      this.activeTab = null
      this.persist()
    }
  }
})

