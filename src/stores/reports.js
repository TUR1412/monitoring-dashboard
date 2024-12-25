import { defineStore } from 'pinia'

export const useReportStore = defineStore('report', {
  state: () => ({
    reports: []
  }),
  actions: {
    async fetchReports() {
      try {
        // 模拟异步操作
        await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟1秒延迟

        // 模拟数据
        this.reports = [
          {
            id: 1,
            name: '报告1',
            type: 'summary',
            dateRange: '最近7天',
            generated: new Date().toLocaleString()
          },
          {
            id: 2,
            name: '报告2',
            type: 'detailed',
            dateRange: '最近30天',
            generated: new Date().toLocaleString()
          }
          // 可以添加更多模拟报告
        ]
      } catch (error) {
        throw error
      }
    },

    async generateReport(payload) {
      try {
        // 模拟异步操作
        await new Promise(resolve => setTimeout(resolve, 1500)) // 模拟1.5秒延迟

        // 模拟生成报告
        const newReport = {
          id: this.reports.length + 1,
          name: `报告${this.reports.length + 1}`,
          type: payload.type,
          dateRange: payload.dateRange === '7d' ? '最近7天' :
                     payload.dateRange === '30d' ? '最近30天' : '最近90天',
          generated: new Date().toLocaleString()
        }

        this.reports.push(newReport)
      } catch (error) {
        throw error
      }
    },

    async downloadReport(reportId) {
      try {
        // 模拟异步操作
        await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟1秒延迟

        // 模拟下载操作
        const report = this.reports.find(r => r.id === reportId)
        if (!report) {
          throw new Error('报告未找到')
        }

        // 创建一个虚拟文件并触发下载
        const blob = new Blob([`这是 ${report.name} 的内容。`], { type: 'text/plain' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${report.name}.txt`)
        document.body.appendChild(link)
        link.click()
        link.parentNode.removeChild(link)
      } catch (error) {
        throw error
      }
    }
  }
})
