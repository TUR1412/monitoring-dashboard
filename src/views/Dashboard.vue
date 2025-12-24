<!-- src/views/Dashboard.vue -->
<template>
  <div class="dashboard">
    <section class="dashboard-hero card glow-background">
      <div class="hero-main">
        <p class="eyebrow">实时态势</p>
        <h1 class="page-title">系统全景 · 今日运行摘要</h1>
        <p class="hero-subtitle">
          聚焦关键性能指标、告警状态与资源分布，让每一次决策更快更稳。
        </p>
        <div class="hero-chips">
          <span class="stat-chip">
            <span class="status-dot"></span>
            平台运行中
          </span>
          <span class="stat-chip">告警 {{ alertCount }} 条</span>
          <span class="stat-chip">活跃进程 {{ processCount }}</span>
        </div>
      </div>
      <div class="hero-metrics">
        <div class="metric-tile">
          <span class="metric-label">CPU 峰值</span>
          <span class="metric-value">{{ cpuPeak }}%</span>
        </div>
        <div class="metric-tile">
          <span class="metric-label">内存占用</span>
          <span class="metric-value">{{ memoryUsed }} MB</span>
        </div>
        <div class="metric-tile">
          <span class="metric-label">磁盘使用</span>
          <span class="metric-value">{{ diskUsed }} GB</span>
        </div>
      </div>
    </section>

    <section class="card ops-overview">
      <div class="section-header">
        <div>
          <h2 class="section-title">运营层总览</h2>
          <p class="subtitle">跨模块 KPI 汇总与智能摘要，辅助当班快速判断。</p>
        </div>
        <div class="header-actions">
          <span class="stat-chip">SLA {{ sla }}%</span>
          <BaseButton type="default" @click="exportOpsReport">
            <AppIcon name="export" className="inline-icon" />
            导出摘要
          </BaseButton>
        </div>
      </div>
      <div class="ops-grid">
        <div class="ops-card">
          <span class="label">可用性</span>
          <span class="value">{{ availability }}%</span>
          <span class="trend up">+0.02%</span>
        </div>
        <div class="ops-card">
          <span class="label">未确认告警</span>
          <span class="value">{{ unacknowledgedCount }}</span>
          <span class="trend" :class="unacknowledgedCount > 3 ? 'down' : 'up'">
            {{ unacknowledgedCount > 3 ? '风险上升' : '可控' }}
          </span>
        </div>
        <div class="ops-card">
          <span class="label">平均响应</span>
          <span class="value">{{ avgResponse }} ms</span>
          <span class="trend up">持续优化</span>
        </div>
        <div class="ops-card">
          <span class="label">已确认告警</span>
          <span class="value">{{ acknowledgedCount }}</span>
          <span class="trend up">当班已处理</span>
        </div>
      </div>
      <div class="ops-summary">
        <div class="summary-header">
          <h3>智能摘要</h3>
          <span class="summary-tag" :class="riskLevelClass">{{ riskLevel }}</span>
        </div>
        <p>{{ opsSummary }}</p>
        <div class="summary-tags">
          <span v-for="tag in summaryTags" :key="tag" class="stat-chip">{{ tag }}</span>
        </div>
      </div>
    </section>

    <section class="bento-grid dashboard-grid">
      <div class="bento-item span-8">
        <CpuUsage />
      </div>
      <div class="bento-item span-4">
        <MemoryUsage />
      </div>
      <div class="bento-item span-4">
        <DiskUsage />
      </div>
      <div class="bento-item span-4">
        <NetworkTraffic />
      </div>
      <div class="bento-item span-4">
        <Temperature />
      </div>
      <div class="bento-item span-12">
        <div class="card alert-summary">
          <div class="alert-header">
            <h2 class="section-title">最新告警</h2>
            <span class="text-muted">实时更新 · 仅展示最近 5 条</span>
          </div>
          <div class="alert-list">
            <div v-for="alert in recentAlerts" :key="alert.id" class="alert-item">
              <div class="alert-dot" :class="alert.level"></div>
              <div class="alert-body">
                <div class="alert-title">{{ alert.title }}</div>
                <div class="alert-meta">{{ alert.source }} · {{ formatAlertTime(alert.timestamp) }}</div>
              </div>
              <span class="alert-tag" :class="alert.level">{{ alert.level }}</span>
            </div>
            <div v-if="recentAlerts.length === 0" class="empty-state">
              当前暂无告警，系统运行良好。
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAlertsStore } from '@/stores/alerts'
import { useTelemetryStore } from '@/stores/telemetry'
import { useUiStore } from '@/stores/ui'
import { buildCsvFromMatrix, downloadCsv } from '@/utils/csv'
import { buildDateStamp } from '@/utils/filename'
import AppIcon from '@/components/base/AppIcon.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import CpuUsage from '@/components/charts/CpuUsage.vue'
import MemoryUsage from '@/components/charts/MemoryUsage.vue'
import DiskUsage from '@/components/charts/DiskUsage.vue'
import NetworkTraffic from '@/components/charts/NetworkTraffic.vue'
import Temperature from '@/components/charts/Temperature.vue'

const alertsStore = useAlertsStore()
const telemetryStore = useTelemetryStore()
const uiStore = useUiStore()

const alertCount = computed(() => (alertsStore.alerts || []).length)
const processCount = computed(() => (telemetryStore.processes || []).length)
const acknowledgedCount = computed(() => (alertsStore.alerts || []).filter(alert => alert.acknowledged).length)
const unacknowledgedCount = computed(() =>
  (alertsStore.alerts || []).filter(alert => !alert.acknowledged && !alert.archived).length
)

const cpuPeak = computed(() => {
  const values = (telemetryStore.cpuUsage || []).map(entry => entry.usage)
  return values.length ? Math.max(...values) : 0
})

const memoryUsed = computed(() => telemetryStore.memoryUsage?.used || 0)
const diskUsed = computed(() => {
  const disk = telemetryStore.diskUsage || {}
  return (disk.usedDisk1 || 0) + (disk.usedDisk2 || 0) + (disk.usedDisk3 || 0)
})

const recentAlerts = computed(() => (alertsStore.alerts || []).slice(0, 5))

const sla = computed(() => {
  const base = 99.98
  const penalty = Math.min(unacknowledgedCount.value * 0.01, 0.3)
  return (base - penalty).toFixed(2)
})

const availability = computed(() => {
  const base = 99.96
  const penalty = Math.min(unacknowledgedCount.value * 0.02, 0.5)
  return (base - penalty).toFixed(2)
})

const avgResponse = computed(() => {
  const data = telemetryStore.frontendPerformanceData || []
  if (!data.length) return 0
  const total = data.reduce((sum, item) => sum + (item.responseTime || 0), 0)
  return Math.round((total / data.length) * 1000)
})

const riskLevel = computed(() => {
  if (unacknowledgedCount.value >= 4) return '高风险'
  if (unacknowledgedCount.value >= 2) return '中风险'
  return '平稳'
})

const riskLevelClass = computed(() => ({
  'tag-high': riskLevel.value === '高风险',
  'tag-medium': riskLevel.value === '中风险',
  'tag-low': riskLevel.value === '平稳'
}))

const opsSummary = computed(() => {
  return `今日系统保持 ${availability.value}% 可用性，当前未确认告警 ${unacknowledgedCount.value} 条，
  前端平均响应 ${avgResponse.value} ms。建议关注高频资源占用并复盘异常峰值时段。`
})

const summaryTags = computed(() => [
  `SLA ${sla.value}%`,
  `告警 ${alertCount.value}`,
  `进程 ${processCount.value}`
])

const exportOpsReport = () => {
  const rows = [
    ['指标', '数值'],
    ['可用性', `${availability.value}%`],
    ['SLA', `${sla.value}%`],
    ['未确认告警', `${unacknowledgedCount.value}`],
    ['已确认告警', `${acknowledgedCount.value}`],
    ['平均响应(ms)', `${avgResponse.value}`]
  ]
  const csvContent = buildCsvFromMatrix(rows)
  downloadCsv(csvContent, `运营摘要_${buildDateStamp()}.csv`)
  uiStore.pushToast({ type: 'success', message: '运营摘要已导出' })
}

const formatAlertTime = (timestamp) => {
  const date = new Date(timestamp)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
  width: 100%;
}

.dashboard-hero {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: 2rem;
  align-items: center;
}

.ops-overview {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  background: rgba(15, 23, 42, 0.32);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.ops-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.ops-card {
  padding: 1rem 1.2rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background: rgba(15, 23, 42, 0.35);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.ops-card .label {
  color: var(--text-muted);
  font-size: 0.8rem;
}

.ops-card .value {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text-strong);
}

.trend {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.trend.up {
  color: var(--neon-green);
}

.trend.down {
  color: var(--neon-red);
}

.ops-summary {
  padding: 1rem 1.2rem;
  border-radius: var(--radius-md);
  border: 1px solid rgba(46, 196, 182, 0.3);
  background: rgba(46, 196, 182, 0.12);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.summary-tag {
  padding: 0.2rem 0.7rem;
  border-radius: 999px;
  font-size: 0.75rem;
  border: 1px solid transparent;
}

.summary-tag.tag-high {
  color: var(--neon-red);
  border-color: rgba(231, 111, 81, 0.5);
  background: rgba(231, 111, 81, 0.12);
}

.summary-tag.tag-medium {
  color: var(--neon-yellow);
  border-color: rgba(246, 189, 96, 0.5);
  background: rgba(246, 189, 96, 0.12);
}

.summary-tag.tag-low {
  color: var(--neon-green);
  border-color: rgba(6, 214, 160, 0.5);
  background: rgba(6, 214, 160, 0.12);
}

.summary-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.3em;
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.hero-subtitle {
  color: var(--text-muted);
  margin-top: 0.75rem;
  max-width: 520px;
}

.hero-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 1.2rem;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--neon-green);
  box-shadow: 0 0 8px rgba(6, 214, 160, 0.6);
}

.hero-metrics {
  display: grid;
  gap: 0.8rem;
}

.metric-tile {
  padding: 1rem 1.2rem;
  border-radius: var(--radius-md);
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(46, 196, 182, 0.2);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.metric-label {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.metric-value {
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--text-strong);
}

.dashboard-grid {
  margin-top: 0.5rem;
}

.alert-summary {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.alert-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
}

.section-title {
  font-size: 1.25rem;
  margin: 0;
}

.text-muted {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.alert-list {
  display: grid;
  gap: 0.85rem;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  background: rgba(12, 17, 24, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.alert-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--neon-blue);
}

.alert-dot.warning {
  background: var(--neon-yellow);
}

.alert-dot.error,
.alert-dot.critical {
  background: var(--neon-red);
}

.alert-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.alert-title {
  font-size: 0.95rem;
  color: var(--text-strong);
}

.alert-meta {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.alert-tag {
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border: 1px solid rgba(46, 196, 182, 0.4);
  color: var(--text-strong);
}

.alert-tag.warning {
  border-color: rgba(246, 189, 96, 0.6);
}

.alert-tag.error,
.alert-tag.critical {
  border-color: rgba(231, 111, 81, 0.6);
}

.empty-state {
  text-align: center;
  padding: 1rem 0;
  color: var(--text-muted);
}

.inline-icon {
  margin-right: 0.5rem;
}

@media (max-width: 1024px) {
  .dashboard-hero {
    grid-template-columns: 1fr;
  }
}
</style>
