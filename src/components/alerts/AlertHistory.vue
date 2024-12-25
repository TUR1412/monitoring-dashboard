<!-- src/components/alerts/AlertHistory.vue -->
<template>
    <div class="alert-history">
      <h2 class="text-2xl font-bold mb-4">历史警报</h2>
      <div class="alert-filters mb-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="filter-group">
            <label class="block text-sm font-medium mb-1">日期范围</label>
            <select class="w-full p-2 border rounded">
              <option>最近24小时</option>
              <option>最近7天</option>
              <option>最近30天</option>
              <option>自定义范围</option>
            </select>
          </div>
          <div class="filter-group">
            <label class="block text-sm font-medium mb-1">严重程度</label>
            <select class="w-full p-2 border rounded">
              <option>全部</option>
              <option>严重</option>
              <option>高</option>
              <option>中</option>
              <option>低</option>
            </select>
          </div>
          <div class="filter-group">
            <label class="block text-sm font-medium mb-1">状态</label>
            <select class="w-full p-2 border rounded">
              <option>全部</option>
              <option>已解决</option>
              <option>已确认</option>
              <option>未解决</option>
            </select>
          </div>
        </div>
      </div>
  
      <div class="alert-list">
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border">
            <thead>
              <tr class="bg-gray-50">
                <th class="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">时间</th>
                <th class="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">警报类型</th>
                <th class="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">严重程度</th>
                <th class="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                <th class="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="alert in alertHistory" :key="alert.id">
                <td class="px-6 py-4 whitespace-nowrap">{{ alert.timestamp }}</td>
                <td class="px-6 py-4">{{ alert.type }}</td>
                <td class="px-6 py-4">
                  <span :class="getSeverityClass(alert.severity)">
                    {{ alert.severity }}
                  </span>
                </td>
                <td class="px-6 py-4">{{ alert.status }}</td>
                <td class="px-6 py-4">
                  <button class="text-blue-600 hover:text-blue-800 mr-2">查看</button>
                  <button class="text-gray-600 hover:text-gray-800">导出</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AlertHistory',
    data() {
      return {
        alertHistory: [
          {
            id: 1,
            timestamp: '2024-12-25 10:30:00',
            type: '高CPU使用率',
            severity: '严重',
            status: '已解决'
          },
          {
            id: 2,
            timestamp: '2024-12-25 09:15:00',
            type: '内存警告',
            severity: '高',
            status: '已确认'
          },
          // 添加更多示例数据
          {
            id: 3,
            timestamp: '2024-12-24 14:20:00',
            type: '磁盘空间不足',
            severity: '中',
            status: '未解决'
          },
          {
            id: 4,
            timestamp: '2024-12-23 16:45:00',
            type: '网络异常',
            severity: '低',
            status: '已解决'
          }
        ]
      }
    },
    methods: {
      // 获取严重程度对应的CSS类
      getSeverityClass(severity) {
        const classes = {
          '严重': 'bg-red-100 text-red-800 px-2 py-1 rounded-full',
          '高': 'bg-orange-100 text-orange-800 px-2 py-1 rounded-full',
          '中': 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full',
          '低': 'bg-green-100 text-green-800 px-2 py-1 rounded-full'
        }
        return classes[severity] || ''
      }
    }
  }
  </script> 
  
  <style scoped>
  .alert-history {
    padding: 1.25rem;
    background-color: var(--background-color, #f8f9fa);
  }
  
  .alert-filters {
    padding: 1rem;
    background-color: #ffffff;
    border: 1px solid #ddd;
    border-radius: 0.375rem;
  }
  
  .filter-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  .filter-group select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 0.375rem;
    background-color: white;
  }
  
  .alert-list {
    margin-top: 1.5rem;
  }
  
  .alert-list table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .alert-list th,
  .alert-list td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  
  .alert-list th {
    background-color: #f0f0f0;
    font-weight: 600;
  }
  
  .alert-list tbody tr:hover {
    background-color: #f9f9f9;
  }
  
  .text-blue-600 {
    color: #3182ce;
  }
  
  .text-blue-800 {
    color: #2c5282;
  }
  
  .text-gray-600 {
    color: #4a5568;
  }
  
  .text-gray-800 {
    color: #2d3748;
  }
  
  </style>
  