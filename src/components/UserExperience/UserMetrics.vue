<!-- src/components/UserExperience/UserMetrics.vue -->
<template>
    <div class="user-metrics">
      <h2 class="section-title">用户指标</h2>
      <div class="metrics-grid">
        <!-- 活跃用户数 -->
        <div class="card metric-card">
          <h3>活跃用户数</h3>
          <div class="metric-value text-3xl">{{ metrics.activeUsers }}</div>
          <div class="metric-trend" :class="metrics.activeUsersTrend">
            {{ metrics.activeUsersTrend === 'up' ? '↑' : '↓' }}
            {{ metrics.activeUsersChange }}%
          </div>
        </div>
  
        <!-- 平均会话时长 -->
        <div class="card metric-card">
          <h3>平均会话时长</h3>
          <div class="metric-value text-3xl">{{ metrics.avgSessionDuration }}</div>
          <div class="metric-trend" :class="metrics.sessionDurationTrend">
            {{ metrics.sessionDurationTrend === 'up' ? '↑' : '↓' }}
            {{ metrics.sessionDurationChange }}%
          </div>
        </div>
  
        <!-- 错误率 -->
        <div class="card metric-card">
          <h3>错误率</h3>
          <div class="metric-value text-3xl">{{ metrics.errorRate }}%</div>
          <div class="metric-trend" :class="metrics.errorRateTrend">
            {{ metrics.errorRateTrend === 'down' ? '↓' : '↑' }}
            {{ metrics.errorRateChange }}%
          </div>
        </div>
      </div>
  
      <!-- 性能指标图表区域 -->
      <div class="card performance-chart">
        <h3 class="section-subtitle">性能指标变化</h3>
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
              borderColor: 'rgba(46, 196, 182, 0.9)',
              tension: 0.3
            },
            {
              label: '错误率 (%)',
              data: [1.2, 1.0, 1.5, 1.3, 1.1, 0.9],
              fill: false,
              borderColor: 'rgba(231, 111, 81, 0.9)',
              tension: 0.3
            },
            {
              label: '资源使用率 (%)',
              data: [65, 70, 68, 72, 69, 71],
              fill: false,
              borderColor: 'rgba(244, 162, 97, 0.9)',
              tension: 0.3
            }
          ]
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .user-metrics {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .section-title {
    font-size: 1.3rem;
    margin: 0;
  }
  
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1rem;
  }
  
  .metric-card {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }
  
  .metric-card h3 {
    margin-bottom: 0.5rem;
    color: var(--text-muted);
  }
  
  .metric-value {
    font-size: 1.8rem;
    font-weight: 600;
    color: var(--text-strong);
  }
  
  .metric-trend {
    font-size: 0.875rem;
    color: var(--text-muted);
  }
  
  .metric-trend.up {
    color: var(--neon-green);
  }
  
  .metric-trend.down {
    color: var(--neon-red);
  }
  
  .performance-chart {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .section-subtitle {
    font-size: 1rem;
    margin: 0;
  }
  </style>
  
