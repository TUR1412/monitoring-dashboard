// src/stores/performance.js
import { defineStore } from 'pinia'

export const usePerformanceStore = defineStore('performance', {
  state: () => ({
    currentMetrics: null,
    chartLabels: [],
    responseTimeData: [],
    errorRateData: [],
    resourceUsageData: []
  }),
  actions: {
    async fetchPerformanceData() {
      try {
        // 模拟异步操作
        await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟1秒延迟

        // 模拟数据
        const data = {
          currentMetrics: {
            responseTime: 120,
            errorRate: 2.5,
            resourceUsage: 75
          },
          chartLabels: ['一月', '二月', '三月', '四月', '五月'],
          responseTimeData: [100, 110, 120, 130, 125],
          errorRateData: [1.5, 2.0, 2.5, 2.3, 2.1],
          resourceUsageData: [70, 72, 75, 78, 76]
        }

        // 更新状态
        this.currentMetrics = data.currentMetrics
        this.chartLabels = data.chartLabels
        this.responseTimeData = data.responseTimeData
        this.errorRateData = data.errorRateData
        this.resourceUsageData = data.resourceUsageData
      } catch (error) {
        throw error
      }
    }
  }
})
