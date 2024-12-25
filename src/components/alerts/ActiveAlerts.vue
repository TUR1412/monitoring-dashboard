<!-- src/components/alerts/ActiveAlerts.vue -->
<template>
  <div class="alerts-container">
    <div class="alerts-header">
      <h2 class="text-xl font-cyberpunk mb-4">活动警报</h2>
      <div class="alert-filters">
        <select v-model="levelFilter" class="filter-select">
          <option value="">全部严重程度</option>
          <option value="critical">严重</option>
          <option value="error">错误</option>
          <option value="warning">警告</option>
          <option value="info">信息</option>
        </select>
        <select v-model="timeFilter" class="filter-select">
          <option value="1h">最近1小时</option>
          <option value="24h">最近24小时</option>
          <option value="7d">最近7天</option>
        </select>
      </div>
    </div>

    <!-- 调试信息：显示过滤后的警报数量 -->
    <div class="debug-info">
      <p class="text-neon-pink">过滤后的警报数量: {{ filteredAlerts.length }}</p>
      <pre class="text-sm text-gray-400">{{ filteredAlerts }}</pre> <!-- 仅用于调试，生产环境请移除 -->
    </div>

    <div class="alerts-list" v-if="filteredAlerts.length">
      <div v-for="alert in filteredAlerts" 
           :key="alert.id" 
           :class="['alert-item', `severity-${alert.level}`]">
        <div class="alert-icon">
          <i :class="getAlertIcon(alert.level)"></i>
        </div>
        <div class="alert-content">
          <h3 class="alert-title">{{ alert.title }}</h3>
          <p class="alert-message">{{ alert.message }}</p>
          <div class="alert-meta">
            <span class="alert-time">{{ formatTime(alert.timestamp) }}</span>
            <span class="alert-source">{{ alert.source }}</span>
          </div>
        </div>
        <div class="alert-actions">
          <button @click="acknowledgeAlert(alert.id)" 
                  class="btn-acknowledge"
                  :disabled="alert.acknowledged">
            {{ alert.acknowledged ? '已确认' : '确认' }}
          </button>
          <button @click="muteAlert(alert.id)" 
                  class="btn-mute"
                  :class="{ 'btn-muted': alert.muted }">
            {{ alert.muted ? '已静音' : '静音' }}
          </button>
        </div>
      </div>
    </div>
    <div v-else class="no-alerts">
      <p>当前没有符合条件的警报</p>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useMonitorStore } from '@/stores/monitorStore'

export default {
  name: 'ActiveAlerts',
  
  setup() {
    const store = useMonitorStore()
    const levelFilter = ref('')
    const timeFilter = ref('24h')

    // 计算过滤后的警报列表
    const filteredAlerts = computed(() => {
      return store.alerts.filter(alert => {
        const matchesLevel = !levelFilter.value || alert.level === levelFilter.value
        const matchesTime = isWithinTimeFilter(alert.timestamp)
        return matchesLevel && matchesTime && !alert.archived
      })
    })

    // 获取警报图标类名
    const getAlertIcon = (level) => {
      const icons = {
        critical: 'fas fa-exclamation-circle text-neon-red',
        error: 'fas fa-times-circle text-neon-red',
        warning: 'fas fa-exclamation-triangle text-neon-yellow',
        info: 'fas fa-info-circle text-neon-blue'
      }
      return icons[level] || icons.info
    }

    // 格式化时间戳
    const formatTime = (timestamp) => {
      const date = typeof timestamp === 'number' ? new Date(timestamp) : new Date(timestamp)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    // 判断警报是否在过滤的时间范围内
    const isWithinTimeFilter = (timestamp) => {
      const now = Date.now()
      let alertTime
      if (typeof timestamp === 'number') {
        alertTime = timestamp
      } else {
        alertTime = new Date(timestamp).getTime()
      }
      const timeFilters = {
        '1h': 60 * 60 * 1000,
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000
      }
      return now - alertTime <= timeFilters[timeFilter.value]
    }

    // 确认警报
    const acknowledgeAlert = (alertId) => {
      store.acknowledgeAlert(alertId)
    }

    // 静音警报
    const muteAlert = (alertId) => {
      store.muteAlert(alertId)
    }

    // 在组件挂载时获取警报数据
    onMounted(() => {
      store.fetchAlerts()
    })

    return {
      levelFilter,
      timeFilter,
      filteredAlerts,
      getAlertIcon,
      formatTime,
      acknowledgeAlert,
      muteAlert
    }
  }
}
</script>

<style scoped>
.alerts-container {
  padding: 1.25rem;
  background-color: var(--background-color, #1e1e1e);
  color: var(--text-color, #ffffff);
}

.alerts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.alert-filters select {
  padding: 0.5rem;
  border: 1px solid #555;
  border-radius: 0.375rem;
  margin-left: 0.75rem;
  background-color: #2c2c2c;
  color: #ffffff;
}

.alert-filters select option {
  background-color: #2c2c2c;
  color: #ffffff;
}

.debug-info {
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #ff6ec7;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.alert-item {
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: #2c3e50;
  box-shadow: 0 0 10px #ff6ec7, 0 0 20px #1f8ef1, 0 0 30px #17c0eb;
  border-left: 4px solid transparent;
  transition: transform 0.3s;
}

.alert-item:hover {
  transform: translateY(-5px);
}

.severity-critical {
  border-left-color: #ff073a;
}

.severity-error {
  border-left-color: #ff073a;
}

.severity-warning {
  border-left-color: #ffdd57;
}

.severity-info {
  border-left-color: #17c0eb;
}

.alert-icon {
  padding: 0.5rem;
  font-size: 1.25rem;
  color: #ff6ec7;
  text-shadow: 0 0 10px #ff6ec7, 0 0 20px #1f8ef1;
}

.alert-content {
  flex: 1;
  margin: 0 1rem;
}

.alert-title {
  font-size: 1.125rem;
  font-family: 'Orbitron', sans-serif;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #ffffff;
}

.alert-message {
  color: #17c0eb;
  margin-bottom: 0.5rem;
}

.alert-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #a0aec0;
}

.alert-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-acknowledge,
.btn-mute {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;
  border: none;
}

.btn-acknowledge {
  background-color: #00ff99;
  color: #1a1a1a;
  box-shadow: 0 0 10px #00ff99, 0 0 20px #ff6ec7;
}

.btn-acknowledge:disabled {
  background-color: #82c791;
  cursor: not-allowed;
}

.btn-mute {
  background-color: #ff6ec7;
  color: #1a1a1a;
  box-shadow: 0 0 10px #ff6ec7, 0 0 20px #1f8ef1;
}

.btn-mute:hover {
  background-color: #1f8ef1;
}

.btn-muted {
  background-color: #adb5bd;
}

.no-alerts {
  text-align: center;
  padding: 2rem;
  color: #ff6ec7;
}

@media (max-width: 640px) {
  .alerts-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .alert-filters {
    display: flex;
    gap: 0.5rem;
  }

  .filter-select {
    flex: 1;
    margin-left: 0;
    background-color: #2c2c2c;
    color: #ffffff;
  }

  .alert-meta {
    flex-direction: column;
    gap: 0.5rem;
  }

  .alert-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
