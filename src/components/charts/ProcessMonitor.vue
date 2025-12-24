<!-- src/components/charts/ProcessMonitor.vue -->
<template>
  <div class="process-monitor">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- 进程列表 -->
      <div class="card">
        <h4 class="card-title">活动进程</h4>
        <div class="process-list">
          <table class="w-full">
            <thead>
              <tr>
                <th>PID</th>
                <th>名称</th>
                <th>CPU</th>
                <th>内存</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="process in processes" :key="process.pid">
                <td>{{ process.pid }}</td>
                <td>{{ process.name }}</td>
                <td>{{ process.cpu }}%</td>
                <td>{{ process.memory }}MB</td>
                <td>
                  <StatusIndicator 
                    :status="process.status" 
                    :label="process.status === 'running' ? 'Running' : 'Stopped'" 
                  />
                </td>
                <td>
                  <BaseButton
                    type="danger"
                    size="small"
                    @click="handleProcessAction(process.pid)"
                    :disabled="process.status === 'stopped'"
                  >
                    <AppIcon name="stop" :size="14" />
                  </BaseButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 资源使用趋势图 -->
      <div class="card">
        <h4 class="card-title">资源使用趋势</h4>
        <div class="chart-container">
          <ChartComponent
            type="line"
            :data="chartData"
            :options="chartOptions"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useTelemetryStore } from '@/stores/telemetry'
import { usePolling } from '@/composables/usePolling'
import ChartComponent from './ChartComponent.vue'
import StatusIndicator from '../StatusIndicator.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import AppIcon from '@/components/base/AppIcon.vue'

export default {
  name: 'ProcessMonitor',
  components: {
    ChartComponent,
    StatusIndicator,
    BaseButton,
    AppIcon
  },
  setup() {
    const store = useTelemetryStore()
    const processes = computed(() => store.processes)
    
    const chartData = computed(() => ({
      labels: store.cpuUsage.map(entry => entry.time),
      datasets: [
        {
          label: 'CPU 使用率 (%)',
          data: store.cpuUsage.map(entry => entry.usage),
          borderColor: '#41B883',
          tension: 0.4,
          yAxisID: 'y1' // 关联到第一个 Y 轴
        },
        {
          label: '内存使用 (MB)',
          data: store.memoryUsageHistory.map(entry => entry.value),
          borderColor: '#00D8FF',
          tension: 0.4,
          yAxisID: 'y2' // 关联到第二个 Y 轴
        }
      ]
    }))

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top'
        }
      },
      scales: {
        x: {
          type: 'category',
          display: true,
          title: {
            display: true,
            text: '时间'
          },
          grid: {
            display: true
          }
        },
        y1: { // 第一个 Y 轴用于 CPU 使用率
          type: 'linear',
          position: 'left',
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: 'CPU 使用率 (%)'
          },
          grid: {
            display: true
          }
        },
        y2: { // 第二个 Y 轴用于内存使用
          type: 'linear',
          position: 'right',
          beginAtZero: true,
          max: 500, // 根据实际内存使用调整
          title: {
            display: true,
            text: '内存使用 (MB)'
          },
          grid: {
            display: false
          }
        }
      }
    }

    const handleProcessAction = (pid) => {
      store.stopProcess(pid)
    }

    usePolling(() => store.fetchProcesses(), 5000)

    return {
      processes,
      chartData,
      chartOptions,
      handleProcessAction
    }
  }
}
</script>

<style scoped>
.process-monitor {
  padding: 1rem;
}

.card {
  background: var(--card-bg);
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.process-list {
  overflow-x: auto;
}

table {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
}

th, td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

th {
  background-color: var(--bg-secondary);
  font-weight: 600;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.status-badge.running {
  background-color: var(--success-bg);
  color: var(--success-text);
}

.status-badge.stopped {
  background-color: var(--danger-bg);
  color: var(--danger-text);
}

.chart-container {
  height: 300px;
  margin-top: 1rem;
}
</style>
