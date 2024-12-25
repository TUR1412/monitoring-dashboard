<!-- src/components/analytics/Reports.vue -->
<template>
    <div class="reports">
      <h2 class="text-2xl font-bold mb-4">分析报告</h2>
      <div class="reports-controls mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="date-range">
            <label class="block text-sm font-medium mb-1">日期范围</label>
            <select v-model="dateRange" class="w-full p-2 border rounded">
              <option value="7d">最近7天</option>
              <option value="30d">最近30天</option>
              <option value="90d">最近90天</option>
            </select>
          </div>
          <div class="report-type">
            <label class="block text-sm font-medium mb-1">报告类型</label>
            <select v-model="reportType" class="w-full p-2 border rounded">
              <option value="summary">概要报告</option>
              <option value="detailed">详细报告</option>
              <option value="custom">自定义报告</option>
            </select>
          </div>
          <div class="generate-report">
            <button 
              @click="generateReport" 
              class="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              生成报告
            </button>
          </div>
        </div>
      </div>
      <div class="reports-list bg-white rounded-lg shadow">
        <table class="w-full">
          <thead>
            <tr class="border-b">
              <th class="p-4 text-left">报告名称</th>
              <th class="p-4 text-left">类型</th>
              <th class="p-4 text-left">日期范围</th>
              <th class="p-4 text-left">生成时间</th>
              <th class="p-4 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="report in reports" :key="report.id" class="border-b">
              <td class="p-4">{{ report.name }}</td>
              <td class="p-4">{{ report.type === 'summary' ? '概要' : (report.type === 'detailed' ? '详细' : '自定义') }}</td>
              <td class="p-4">{{ report.dateRange }}</td>
              <td class="p-4">{{ report.generated }}</td>
              <td class="p-4">
                <button 
                  @click="downloadReport(report.id)"
                  class="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 mr-2">
                  下载
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Reports',
    data() {
      return {
        dateRange: '7d', // 选择的日期范围
        reportType: 'summary', // 选择的报告类型
        reports: [
          {
            id: 1,
            name: '每周性能概要',
            type: 'summary',
            dateRange: '最近7天',
            generated: '2024-03-20'
          },
          {
            id: 2,
            name: '月度流量分析',
            type: 'detailed',
            dateRange: '最近30天',
            generated: '2024-03-19'
          }
        ]
      }
    },
    methods: {
      // 生成新报告
      generateReport() {
        // TODO: 实现生成报告的逻辑
        console.log('生成报告:', this.dateRange, this.reportType)
      },
      // 下载报告
      downloadReport(reportId) {
        // TODO: 实现下载报告的逻辑
        const report = this.reports.find(r => r.id === reportId)
        if (report) {
          alert(`下载报告: ${report.name}`)
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .reports {
    padding: 20px;
  }
  
  .reports-controls {
    padding: 20px;
    background-color: #f9fafb;
    border-radius: 8px;
  }
  
  .reports-list table {
    border-collapse: collapse;
  }
  
  .reports-list th, .reports-list td {
    padding: 12px;
    text-align: left;
  }
  
  .reports-list th {
    background-color: #f3f4f6;
  }
  
  .reports-list tr:hover {
    background-color: #f9fafb;
  }
  </style>
  