<!-- src/components/UserExperience/UserMetrics.vue -->
<template>
    <div class="user-metrics">
      <h2 class="text-2xl font-bold mb-4">用户指标</h2>
      <div class="metrics-grid grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <!-- 活跃用户数 -->
        <div class="metric-card bg-white p-4 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-2">活跃用户数</h3>
          <div class="metric-value text-3xl">{{ metrics.activeUsers }}</div>
          <div class="metric-trend" :class="metrics.activeUsersTrend">
            {{ metrics.activeUsersTrend === 'up' ? '↑' : '↓' }}
            {{ metrics.activeUsersChange }}%
          </div>
        </div>
  
        <!-- 平均会话时长 -->
        <div class="metric-card bg-white p-4 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-2">平均会话时长</h3>
          <div class="metric-value text-3xl">{{ metrics.avgSessionDuration }}</div>
          <div class="metric-trend" :class="metrics.sessionDurationTrend">
            {{ metrics.sessionDurationTrend === 'up' ? '↑' : '↓' }}
            {{ metrics.sessionDurationChange }}%
          </div>
        </div>
  
        <!-- 错误率 -->
        <div class="metric-card bg-white p-4 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-2">错误率</h3>
          <div class="metric-value text-3xl">{{ metrics.errorRate }}%</div>
          <div class="metric-trend" :class="metrics.errorRateTrend">
            {{ metrics.errorRateTrend === 'down' ? '↓' : '↑' }}
            {{ metrics.errorRateChange }}%
          </div>
        </div>
      </div>
  
      <!-- 性能指标图表区域 -->
      <div class="performance-chart bg-white p-4 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4">性能指标变化</h3>
        <!-- 在此处添加图表组件 -->
        <ChartComponent 
          :type="'line'"
          :data="performanceData"
        />
      </div>
    </div>
  </template>
  
  <script>
 import ChartComponent from '@/components/charts/ChartComponent.vue'

  
  export default {
    name: 'UserMetrics',
    components: {
      ChartComponent
    },
    data() {
      return {
        metrics: {
          activeUsers: 1250,
          activeUsersTrend: 'up',
          activeUsersChange: 5.2,
          avgSessionDuration: '12分34秒',
          sessionDurationTrend: 'up',
          sessionDurationChange: 3.1,
          errorRate: 0.8,
          errorRateTrend: 'down',
          errorRateChange: 12.5
        },
        performanceData: {
          labels: ['一月', '二月', '三月', '四月', '五月', '六月'],
          datasets: [
            {
              label: '响应时间 (ms)',
              data: [200, 180, 220, 210, 190, 205],
              fill: false,
              borderColor: 'rgb(54, 162, 235)',
              tension: 0.1
            },
            {
              label: '错误率 (%)',
              data: [1.2, 1.0, 1.5, 1.3, 1.1, 0.9],
              fill: false,
              borderColor: 'rgb(255, 99, 132)',
              tension: 0.1
            },
            {
              label: '资源使用率 (%)',
              data: [65, 70, 68, 72, 69, 71],
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            }
          ]
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .user-metrics {
    background-color: var(--background-color);
    color: var(--text-color);
  }
  
  .user-metrics h2 {
    margin-bottom: 1.5rem;
  }
  
  .metrics-grid {
    display: grid;
    gap: 1rem;
  }
  
  .metric-card {
    padding: 1rem;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 0.375rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .metric-card h3 {
    margin-bottom: 0.5rem;
  }
  
  .metric-value {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  .metric-trend {
    font-size: 0.875rem;
    color: #718096;
  }
  
  .metric-trend.up {
    color: #38a169;
  }
  
  .metric-trend.down {
    color: #e53e3e;
  }
  
  .performance-chart {
    padding: 1rem;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 0.375rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .performance-chart h3 {
    margin-bottom: 1rem;
  }
  
  .grid {
    display: grid;
  }
  
  .grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  
  .md\:grid-cols-3 {
    @media (min-width: 768px) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
  
  .bg-white {
    background-color: #ffffff;
  }
  
  .rounded-lg {
    border-radius: 0.5rem;
  }
  
  .shadow {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .text-lg {
    font-size: 1.125rem;
  }
  
  .font-semibold {
    font-weight: 600;
  }
  
  .text-3xl {
    font-size: 1.875rem;
  }
  
  .flex {
    display: flex;
  }
  
  .justify-between {
    justify-content: space-between;
  }
  
  .bg-red-100 {
    background-color: #fdecea;
  }
  
  .text-red-800 {
    color: #c53030;
  }
  
  .bg-orange-100 {
    background-color: #fffaf0;
  }
  
  .text-orange-800 {
    color: #dd6b20;
  }
  
  .bg-yellow-100 {
    background-color: #fffff0;
  }
  
  .text-yellow-800 {
    color: #d69e2e;
  }
  
  .bg-green-100 {
    background-color: #f0fff4;
  }
  
  .text-green-800 {
    color: #22543d;
  }
  
  .text-gray-500 {
    color: #a0aec0;
  }
  </style>
  