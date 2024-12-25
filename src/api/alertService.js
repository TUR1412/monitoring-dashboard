// src/api/alertService.js
import axios from 'axios'

const API_BASE_URL = '/api/alerts'

export const alertService = {
  // 获取警报列表
  async getAlerts(params) {
    try {
      const response = await axios.get(`${API_BASE_URL}/history`, { params })
      return response.data
    } catch (error) {
      console.error('获取警报数据失败:', error)
      throw error
    }
  },

  // 更新警报状态
  async updateAlertStatus(alertId, status) {
    try {
      const response = await axios.patch(`${API_BASE_URL}/${alertId}/status`, { status })
      return response.data
    } catch (error) {
      console.error('更新警报状态失败:', error)
      throw error
    }
  },

  // 导出警报数据
  async exportAlerts(filters) {
    try {
      const response = await axios.get(`${API_BASE_URL}/export`, {
        params: filters,
        responseType: 'blob'
      })
      return response.data
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
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
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