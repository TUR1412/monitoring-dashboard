<!-- src/components/alerts/ActiveAlerts.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMonitorStore } from '@/stores/monitorStore'
import { AlertLevel, Alert, TimeFilter } from '@/types/alerts'

// 仓库初始化
const monitorStore = useMonitorStore()
const { alerts } = storeToRefs(monitorStore)

// 组件状态
const levelFilter = ref<AlertLevel | ''>('')
const timeFilter = ref<TimeFilter>('24h')

// 时间过滤映射（以毫秒为单位）
const TIME_FILTERS: Record<TimeFilter, number> = {
  '1h': 60 * 60 * 1000,
  '24h': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000
}

// 警报级别配置
const ALERT_CONFIGS = {
  critical: {
    icon: 'fas fa-exclamation-circle',
    color: 'var(--neon-red)'
  },
  error: {
    icon: 'fas fa-times-circle',
    color: 'var(--neon-red)'
  },
  warning: {
    icon: 'fas fa-exclamation-triangle',
    color: 'var(--neon-yellow)'
  },
  info: {
    icon: 'fas fa-info-circle',
    color: 'var(--neon-blue)'
  }
} as const

// 计算属性
const filteredAlerts = computed(() => {
  const now = Date.now()
  return alerts.value.filter(alert => {
    const matchesLevel = !levelFilter.value || alert.level === levelFilter.value
    const alertTime = typeof alert.timestamp === 'number' 
      ? alert.timestamp 
      : new Date(alert.timestamp).getTime()
    const matchesTime = now - alertTime <= TIME_FILTERS[timeFilter.value]
    return matchesLevel && matchesTime && !alert.archived
  })
})

// 方法
const getAlertIcon = (level: AlertLevel) => ALERT_CONFIGS[level]?.icon || ALERT_CONFIGS.info.icon

const formatTime = (timestamp: number | string) => {
  const date = typeof timestamp === 'number' ? new Date(timestamp) : new Date(timestamp)
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const handleAcknowledge = async (alertId: string) => {
  try {
    await monitorStore.acknowledgeAlert(alertId)
  } catch (error) {
    console.error('确认警报失败:', error)
  }
}

const handleMute = async (alertId: string) => {
  try {
    await monitorStore.muteAlert(alertId)
  } catch (error) {
    console.error('静音警报失败:', error)
  }
}

// 组件挂载时获取警报
monitorStore.fetchAlerts()
</script>

<template>
  <div class="alerts">
    <header class="alerts__header">
      <h2 class="alerts__title">活动警报</h2>
      <div class="alerts__filters">
        <select
          v-model="levelFilter"
          class="alerts__select"
          :class="{ 'alerts__select--active': levelFilter }"
        >
          <option value="">全部严重程度</option>
          <option value="critical">严重</option>
          <option value="error">错误</option>
          <option value="warning">警告</option>
          <option value="info">信息</option>
        </select>
        <select
          v-model="timeFilter"
          class="alerts__select"
        >
          <option value="1h">最近1小时</option>
          <option value="24h">最近24小时</option>
          <option value="7d">最近7天</option>
        </select>
      </div>
    </header>

    <transition-group 
      name="alert-list" 
      tag="div" 
      class="alerts__list"
    >
      <div
        v-for="alert in filteredAlerts"
        :key="alert.id"
        class="alert"
        :class="[`alert--${alert.level}`]"
      >
        <div class="alert__icon">
          <i :class="getAlertIcon(alert.level)"></i>
        </div>
        <div class="alert__content">
          <h3 class="alert__title">{{ alert.title }}</h3>
          <p class="alert__message">{{ alert.message }}</p>
          <div class="alert__meta">
            <time :datetime="alert.timestamp.toString()" class="alert__time">
              {{ formatTime(alert.timestamp) }}
            </time>
            <span class="alert__source">{{ alert.source }}</span>
          </div>
        </div>
        <div class="alert__actions">
          <button
            @click="handleAcknowledge(alert.id)"
            class="alert__button alert__button--acknowledge"
            :disabled="alert.acknowledged"
          >
            {{ alert.acknowledged ? '已确认' : '确认' }}
          </button>
          <button
            @click="handleMute(alert.id)"
            class="alert__button"
            :class="[
              'alert__button--mute',
              { 'alert__button--muted': alert.muted }
            ]"
          >
            {{ alert.muted ? '已静音' : '静音' }}
          </button>
        </div>
      </div>
    </transition-group>

    <div v-if="!filteredAlerts.length" class="alerts__empty">
      当前没有符合条件的警报
    </div>
  </div>
</template>

<style scoped>
.alerts {
  --alert-padding: 1.25rem;
  --alert-radius: 0.5rem;
  --alert-shadow: 0 0 10px var(--neon-pink), 0 0 20px var(--neon-blue);
  
  padding: var(--alert-padding);
  background-color: var(--background-color);
}

.alerts__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-block-end: 1.5rem;
}

.alerts__title {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.5rem;
  color: var(--neon-pink);
  text-shadow: 0 0 10px var(--neon-pink);
  margin: 0;
}

.alerts__filters {
  display: flex;
  gap: 0.75rem;
}

.alerts__select {
  padding: 0.5rem;
  border: 1px solid var(--gray-600);
  border-radius: 0.375rem;
  background-color: var(--card-background-color);
  color: var(--text-color);
  font-family: inherit;
}

.alerts__select--active {
  border-color: var(--neon-pink);
  box-shadow: 0 0 5px var(--neon-pink);
}

.alerts__list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.alert {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  padding: var(--alert-padding);
  border-radius: var(--alert-radius);
  background-color: var(--card-background-color);
  box-shadow: var(--alert-shadow);
  border-left: 4px solid transparent;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.alert:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 15px var(--neon-pink), 0 0 30px var(--neon-blue);
}

.alert--critical { border-color: var(--neon-red); }
.alert--error { border-color: var(--neon-red); }
.alert--warning { border-color: var(--neon-yellow); }
.alert--info { border-color: var(--neon-blue); }

.alert__icon {
  font-size: 1.25rem;
  color: var(--neon-pink);
  text-shadow: 0 0 10px currentColor;
}

.alert__title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.alert__message {
  color: var(--text-color);
  margin: 0.5rem 0;
}

.alert__meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: var(--gray-400);
}

.alert__button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.alert__button--acknowledge {
  background-color: var(--neon-green);
  color: var(--background-color);
}

.alert__button--acknowledge:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.alert__button--mute {
  background-color: var(--neon-pink);
  color: var(--background-color);
}

.alert__button--muted {
  background-color: var(--gray-600);
}

.alerts__empty {
  text-align: center;
  padding: 2rem;
  color: var(--neon-pink);
  font-style: italic;
}

/* 动画 */
.alert-list-enter-active,
.alert-list-leave-active {
  transition: all 0.3s ease;
}

.alert-list-enter-from,
.alert-list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

@media (max-width: 640px) {
  .alerts__header {
    flex-direction: column;
    gap: 1rem;
  }

  .alerts__filters {
    width: 100%;
  }

  .alerts__select {
    flex: 1;
  }

  .alert {
    grid-template-columns: 1fr;
  }

  .alert__actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }
}
</style>
