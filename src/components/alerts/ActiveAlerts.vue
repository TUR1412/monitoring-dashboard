<!-- src/components/alerts/ActiveAlerts.vue -->
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAlertsStore } from '@/stores/alerts'
import { AlertLevel, Alert, TimeFilter } from '@/types/alerts'
import BaseButton from '@/components/base/BaseButton.vue'
import AppIcon from '@/components/base/AppIcon.vue'

const alertsStore = useAlertsStore()
const { alerts } = storeToRefs(alertsStore)

const levelFilter = ref<AlertLevel | ''>('')
const timeFilter = ref<TimeFilter>('24h')

const TIME_FILTERS: Record<TimeFilter, number> = {
  '1h': 60 * 60 * 1000,
  '24h': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000
}

const ALERT_CONFIGS = {
  critical: {
    icon: 'alert',
    color: 'var(--neon-red)'
  },
  error: {
    icon: 'alert',
    color: 'var(--neon-red)'
  },
  warning: {
    icon: 'alert',
    color: 'var(--neon-yellow)'
  },
  info: {
    icon: 'bell',
    color: 'var(--neon-blue)'
  }
} as const

const filteredAlerts = computed<Alert[]>(() => {
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

const totalCount = computed(() => filteredAlerts.value.length)
const selectedIds = ref<Set<string | number>>(new Set())
const allSelected = computed(() =>
  filteredAlerts.value.length > 0 &&
  filteredAlerts.value.every(alert => selectedIds.value.has(alert.id))
)

const getAlertIconName = (level: AlertLevel) => ALERT_CONFIGS[level]?.icon || ALERT_CONFIGS.info.icon
const getAlertColor = (level: AlertLevel) => ALERT_CONFIGS[level]?.color || ALERT_CONFIGS.info.color

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

const handleAcknowledge = (alertId: string | number) => {
  alertsStore.acknowledgeAlert(alertId)
}

const handleMute = (alertId: string | number) => {
  alertsStore.muteAlert(alertId)
}

const toggleSelection = (alertId: string | number) => {
  const next = new Set(selectedIds.value)
  if (next.has(alertId)) {
    next.delete(alertId)
  } else {
    next.add(alertId)
  }
  selectedIds.value = next
}

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedIds.value = new Set()
    return
  }
  selectedIds.value = new Set(filteredAlerts.value.map(alert => alert.id))
}

const acknowledgeSelected = () => {
  Array.from(selectedIds.value).forEach(id => alertsStore.acknowledgeAlert(id))
  selectedIds.value = new Set()
}

const muteSelected = () => {
  Array.from(selectedIds.value).forEach(id => alertsStore.muteAlert(id))
  selectedIds.value = new Set()
}

const archiveSelected = async () => {
  alertsStore.archiveAlerts(Array.from(selectedIds.value))
  selectedIds.value = new Set()
}

watch(filteredAlerts, (next) => {
  const validIds = new Set(next.map(alert => alert.id))
  const nextSelected = new Set(
    Array.from(selectedIds.value).filter(id => validIds.has(id))
  )
  selectedIds.value = nextSelected
})

alertsStore.fetchAlerts()
</script>

<template>
  <div class="active-alerts fade-in">
    <header class="alerts-header">
      <div>
        <h2 class="page-title">活动警报</h2>
        <p class="subtitle">实时告警队列，支持快速筛选与批量处理。</p>
      </div>
      <div class="header-actions">
        <span class="stat-chip">
          <AppIcon name="bell" className="inline-icon" />
          当前 {{ totalCount }} 条
        </span>
        <BaseButton type="default" size="small" @click="toggleSelectAll">
          {{ allSelected ? '取消全选' : '全选' }}
        </BaseButton>
        <BaseButton type="default" size="small" :disabled="!selectedIds.size" @click="acknowledgeSelected">
          批量确认
        </BaseButton>
        <BaseButton type="default" size="small" :disabled="!selectedIds.size" @click="muteSelected">
          批量静音
        </BaseButton>
        <BaseButton type="danger" size="small" :disabled="!selectedIds.size" @click="archiveSelected">
          批量归档
        </BaseButton>
        <div class="filter-group">
          <select v-model="levelFilter">
            <option value="">全部严重程度</option>
            <option value="critical">严重</option>
            <option value="error">错误</option>
            <option value="warning">警告</option>
            <option value="info">信息</option>
          </select>
          <select v-model="timeFilter">
            <option value="1h">最近1小时</option>
            <option value="24h">最近24小时</option>
            <option value="7d">最近7天</option>
          </select>
        </div>
      </div>
    </header>

    <div class="alerts-list">
      <article
        v-for="alert in filteredAlerts"
        :key="alert.id"
        class="alert-card card"
        :style="{ borderColor: `${getAlertColor(alert.level)}55` }"
      >
        <div class="alert-main">
          <label class="select-box">
            <input
              type="checkbox"
              :checked="selectedIds.has(alert.id)"
              @change="toggleSelection(alert.id)"
            />
            <span></span>
          </label>
          <div class="alert-icon" :style="{ color: getAlertColor(alert.level) }">
            <AppIcon :name="getAlertIconName(alert.level)" />
          </div>
          <div class="alert-body">
            <h3>{{ alert.title }}</h3>
            <p>{{ alert.message }}</p>
            <div class="alert-meta">
              <span>
                {{ formatTime(alert.timestamp) }}
              </span>
              <span>
                {{ alert.source }}
              </span>
            </div>
          </div>
        </div>
        <div class="alert-actions">
          <BaseButton
            type="default"
            size="small"
            @click="handleAcknowledge(alert.id)"
            :disabled="alert.acknowledged"
          >
            {{ alert.acknowledged ? '已确认' : '确认' }}
          </BaseButton>
          <BaseButton
            type="default"
            size="small"
            @click="handleMute(alert.id)"
            :class="{ muted: alert.muted }"
          >
            {{ alert.muted ? '已静音' : '静音' }}
          </BaseButton>
        </div>
      </article>
    </div>

    <div v-if="!filteredAlerts.length" class="empty-state">
      当前没有符合条件的警报
    </div>
  </div>
</template>

<style scoped>
.active-alerts {
  padding: var(--container-padding);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.alerts-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.alert-card {
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
  align-items: center;
  background: rgba(15, 23, 42, 0.3);
  border: 1px solid var(--border-color);
}

.alert-main {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.select-box {
  display: inline-flex;
  align-items: center;
}

.select-box input[type='checkbox'] {
  width: 16px;
  height: 16px;
  accent-color: var(--neon-blue);
}

.alert-icon {
  width: 44px;
  height: 44px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.alert-body h3 {
  margin: 0;
  font-size: 1.05rem;
}

.alert-body p {
  margin: 0.35rem 0 0.6rem;
  color: var(--text-muted);
}

.alert-meta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  color: var(--text-muted);
  font-size: 0.85rem;
}

.alert-actions {
  display: flex;
  gap: 0.6rem;
}

.muted {
  opacity: 0.7;
}

.empty-state {
  text-align: center;
  padding: 2rem 0;
  color: var(--text-muted);
}

.inline-icon {
  margin-right: 0.5rem;
}

@media (max-width: 768px) {
  .alert-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .alert-actions {
    width: 100%;
  }
}
</style>
