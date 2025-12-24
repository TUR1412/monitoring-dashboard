import { defineStore } from 'pinia'
import { safeStorage } from '@/utils/storage'
import { downloadText } from '@/utils/download'

const STORAGE_KEY = 'reports'

const seedReports = () => {
  const now = new Date()
  return [
    {
      id: 1,
      name: '周度运维摘要',
      type: 'summary',
      dateRange: '最近7天',
      generated: now.toISOString(),
      size: '1.2MB',
      status: 'ready'
    },
    {
      id: 2,
      name: '月度性能洞察',
      type: 'detailed',
      dateRange: '最近30天',
      generated: new Date(now.getTime() - 86400000).toISOString(),
      size: '2.8MB',
      status: 'ready'
    }
  ]
}

const formatReportFile = (report) => {
  return `报告名称: ${report.name}\n类型: ${report.type}\n日期范围: ${report.dateRange}\n生成时间: ${report.generated}\n状态: ${report.status}`
}

export const useReportStore = defineStore('report', {
  state: () => ({
    reports: safeStorage.get(STORAGE_KEY, [])
  }),
  actions: {
    async fetchReports() {
      try {
        await new Promise(resolve => setTimeout(resolve, 800))
        if (!this.reports.length) {
          this.reports = seedReports()
          safeStorage.set(STORAGE_KEY, this.reports)
        }
      } catch (error) {
        throw error
      }
    },

    async generateReport(payload) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1200))
        const nextId = this.reports.length ? Math.max(...this.reports.map(r => r.id)) + 1 : 1
        const typeLabel = payload.type === 'summary'
          ? '概要'
          : payload.type === 'detailed'
            ? '详细'
            : '自定义'
        const rangeLabel = payload.dateRange === '7d'
          ? '最近7天'
          : payload.dateRange === '30d'
            ? '最近30天'
            : '最近90天'

        const newReport = {
          id: nextId,
          name: `${typeLabel}报告 ${nextId}`,
          type: payload.type,
          dateRange: rangeLabel,
          generated: new Date().toISOString(),
          size: `${(1.2 + nextId * 0.3).toFixed(1)}MB`,
          status: 'ready'
        }

        this.reports = [...this.reports, newReport]
        safeStorage.set(STORAGE_KEY, this.reports)
      } catch (error) {
        throw error
      }
    },

    async downloadReport(reportId) {
      try {
        await new Promise(resolve => setTimeout(resolve, 600))
        const report = this.reports.find(r => r.id === reportId)
        if (!report) {
          throw new Error('报告未找到')
        }
        downloadText(formatReportFile(report), `${report.name}.txt`, 'text/plain;charset=utf-8')
      } catch (error) {
        throw error
      }
    }
  }
})
