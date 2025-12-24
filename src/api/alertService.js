// src/api/alertService.js
import { http } from '@/utils/http'
import { downloadBlob } from '@/utils/download'

const API_BASE_URL = '/api/alerts'

export const alertService = {
  // 获取警报列表
  async getAlerts(params) {
    try {
      return await http.get(`${API_BASE_URL}/history`, { params })
    } catch (error) {
      console.error('获取警报数据失败:', error)
      throw error
    }
  },

  // 更新警报状态
  async updateAlertStatus(alertId, status) {
    try {
      return await http.patch(`${API_BASE_URL}/${alertId}/status`, { body: { status } })
    } catch (error) {
      console.error('更新警报状态失败:', error)
      throw error
    }
  },

  // 导出警报数据
  async exportAlerts(filters) {
    try {
      return await http.get(`${API_BASE_URL}/export`, {
        params: filters,
        responseType: 'blob'
      })
    } catch (error) {
      console.error('导出警报数据失败:', error)
      throw error
    }
  }
}

// 工具函数
export const alertUtils = {
  // 根据日期范围获取开始和结束时间
  getDateRange(range) {
    const now = new Date()
    let start = new Date()
    
    switch (range) {
      case '24h':
        start.setHours(start.getHours() - 24)
        break
      case '7d':
        start.setDate(start.getDate() - 7)
        break
      case '30d':
        start.setDate(start.getDate() - 30)
        break
      case 'custom':
        return null // 使用用户自定义的日期范围
      default:
        start.setHours(start.getHours() - 24)
    }
    
    return {
      startDate: start.toISOString(),
      endDate: now.toISOString()
    }
  },

  // 处理导出文件下载
  handleExport(blob, filename = 'alerts-export.xlsx') {
    downloadBlob(blob, filename)
  },

  // 格式化警报数据用于导出
  formatAlertsForExport(alerts) {
    return alerts.map(alert => ({
      时间: alert.timestamp,
      类型: alert.type,
      严重程度: alert.severity,
      状态: alert.status,
      描述: alert.description
    }))
  }
}
