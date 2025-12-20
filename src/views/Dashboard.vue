<!-- src/views/Dashboard.vue -->
<template>
  <div class="dashboard-page fade-in">
    <section class="hero surface-glass">
      <div class="hero-main">
        <div class="hero-title">
          <h1>系统总览</h1>
          <span class="badge">实时态势</span>
        </div>
        <p class="hero-subtitle">
          一眼掌控关键资源、风险波动与业务脉搏，确保核心链路稳定。
        </p>
        <div class="hero-actions">
          <button class="btn btn-primary">
            <i class="fas fa-bolt"></i>
            立即巡检
          </button>
          <button class="btn btn-ghost">
            <i class="fas fa-file-alt"></i>
            生成日报
          </button>
        </div>
      </div>
      <div class="hero-metrics">
        <div class="metric-card surface-card">
          <div class="metric-label">CPU 峰值</div>
          <div class="metric-value">{{ latestCpu }}%</div>
          <div class="metric-meta">过去 1 小时</div>
        </div>
        <div class="metric-card surface-card">
          <div class="metric-label">内存占用</div>
          <div class="metric-value">{{ memoryPercent }}%</div>
          <div class="metric-meta">{{ memoryUsage.used }} MB / {{ memoryTotal }} MB</div>
        </div>
        <div class="metric-card surface-card">
          <div class="metric-label">健康评分</div>
          <div class="metric-value">{{ healthScore }}</div>
          <div class="metric-meta">{{ healthLabel }}</div>
        </div>
      </div>
    </section>

    <section class="bento-grid">
      <div class="bento-card surface-card bento-span-8">
        <div class="section-header">
          <div>
            <div class="section-title">CPU 使用率</div>
            <div class="section-subtitle">关键节点实时负载</div>
          </div>
          <span class="pill">实时监控</span>
        </div>
        <CpuUsage />
      </div>

      <div class="bento-card surface-card bento-span-4">
        <div class="section-header">
          <div>
            <div class="section-title">内存趋势</div>
            <div class="section-subtitle">24 小时波动</div>
          </div>
          <span class="pill">峰值 {{ memoryPeak }} MB</span>
        </div>
        <MemoryUsage />
      </div>

      <div class="bento-card surface-card bento-span-4">
        <div class="section-header">
          <div>
            <div class="section-title">磁盘压力</div>
            <div class="section-subtitle">多盘位占用</div>
          </div>
          <span class="pill">剩余 {{ diskUsage.free }} GB</span>
        </div>
        <DiskUsage />
      </div>

      <div class="bento-card surface-card bento-span-4">
        <div class="section-header">
          <div>
            <div class="section-title">当前警报</div>
            <div class="section-subtitle">尚未确认的事件</div>
          </div>
          <span class="pill">{{ activeAlerts.length }} 条待处理</span>
        </div>
        <div class="alert-list">
          <div v-for="alert in activeAlerts" :key="alert.id" class="alert-item">
            <span :class="['alert-level', alert.level]">{{ alert.level }}</span>
            <div class="alert-info">
              <div class="alert-title">{{ alert.title }}</div>
              <div class="alert-meta">{{ alert.source }}</div>
            </div>
            <span class="alert-time">{{ formatTime(alert.timestamp) }}</span>
          </div>
          <div v-if="!activeAlerts.length" class="empty-hint">
            暂无未确认警报，系统运行平稳。
          </div>
        </div>
      </div>

      <div class="bento-card surface-card bento-span-4">
        <div class="section-header">
          <div>
            <div class="section-title">核心流程</div>
            <div class="section-subtitle">运行态与瓶颈</div>
          </div>
          <span class="pill">实时刷新</span>
        </div>
        <div class="process-list">
          <div v-for="process in hotProcesses" :key="process.pid" class="process-item">
            <div>
              <div class="process-name">{{ process.name }}</div>
              <div class="process-meta">PID {{ process.pid }}</div>
            </div>
            <div class="process-metrics">
              <span>{{ process.cpu }}% CPU</span>
              <span>{{ process.memory }} MB</span>
            </div>
          </div>
        </div>
      </div>

      <div class="bento-card surface-card bento-span-8">
        <div class="section-header">
          <div>
            <div class="section-title">网络流量</div>
            <div class="section-subtitle">入站 / 出站 / 总量</div>
          </div>
          <span class="pill">边缘链路</span>
        </div>
        <NetworkTraffic />
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMonitorStore } from '@/stores/monitorStore'
import CpuUsage from '@/components/charts/CpuUsage.vue'
import MemoryUsage from '@/components/charts/MemoryUsage.vue'
import DiskUsage from '@/components/charts/DiskUsage.vue'
import NetworkTraffic from '@/components/charts/NetworkTraffic.vue'

const store = useMonitorStore()

const latestCpu = computed(() => store.cpuUsage?.[store.cpuUsage.length - 1]?.usage ?? 0)
const memoryUsage = computed(() => store.memoryUsage)
const memoryTotal = computed(() => (memoryUsage.value.used || 0) + (memoryUsage.value.free || 0))
const memoryPercent = computed(() =>
  memoryTotal.value ? Math.round((memoryUsage.value.used / memoryTotal.value) * 100) : 0
)
const memoryPeak = computed(() => {
  const values = store.memoryUsageHistory?.map(item => item.value) || []
  return values.length ? Math.max(...values) : 0
})

const diskTotal = computed(() =>
  (store.diskUsage.usedDisk1 || 0) + (store.diskUsage.usedDisk2 || 0) + (store.diskUsage.usedDisk3 || 0) + (store.diskUsage.free || 0)
)
const diskPercent = computed(() =>
  diskTotal.value ? Math.round(((diskTotal.value - store.diskUsage.free) / diskTotal.value) * 100) : 0
)

const healthScore = computed(() => {
  const score = 100 - (latestCpu.value * 0.4 + memoryPercent.value * 0.35 + diskPercent.value * 0.25)
  return Math.max(0, Math.round(score))
})

const healthLabel = computed(() => {
  if (healthScore.value >= 85) return '稳定'
  if (healthScore.value >= 70) return '可控'
  if (healthScore.value >= 50) return '预警'
  return '高风险'
})

const activeAlerts = computed(() => store.alerts.filter(alert => !alert.acknowledged && !alert.archived).slice(0, 4))
const hotProcesses = computed(() => store.processes.slice(0, 4))

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.hero {
  display: grid;
  grid-template-columns: minmax(260px, 1.2fr) minmax(320px, 1fr);
  gap: 1.5rem;
  padding: 1.75rem;
}

.hero-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.hero-subtitle {
  margin-top: 0.75rem;
  font-size: 0.95rem;
  color: var(--text-2);
  max-width: 480px;
}

.hero-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.hero-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.metric-card {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.metric-label {
  font-size: 0.8rem;
  color: var(--text-2);
}

.metric-value {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text-0);
}

.metric-meta {
  font-size: 0.75rem;
  color: var(--text-3);
}

.alert-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 12px;
  background: rgba(148, 163, 184, 0.08);
  border: 1px solid rgba(148, 163, 184, 0.12);
}

.alert-level {
  font-size: 0.7rem;
  text-transform: uppercase;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  border: 1px solid transparent;
}

.alert-level.error {
  background: rgba(239, 68, 68, 0.15);
  color: #fecaca;
  border-color: rgba(239, 68, 68, 0.4);
}

.alert-level.warning {
  background: rgba(245, 158, 11, 0.15);
  color: #fde68a;
  border-color: rgba(245, 158, 11, 0.4);
}

.alert-level.info {
  background: rgba(56, 189, 248, 0.15);
  color: #bae6fd;
  border-color: rgba(56, 189, 248, 0.4);
}

.alert-info {
  flex: 1;
}

.alert-title {
  font-size: 0.9rem;
  color: var(--text-0);
}

.alert-meta {
  font-size: 0.75rem;
  color: var(--text-3);
}

.alert-time {
  font-size: 0.75rem;
  color: var(--text-2);
}

.empty-hint {
  padding: 1rem 0;
  color: var(--text-3);
  text-align: center;
}

.process-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.process-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.12);
  background: rgba(148, 163, 184, 0.08);
}

.process-name {
  font-size: 0.9rem;
  color: var(--text-0);
}

.process-meta {
  font-size: 0.7rem;
  color: var(--text-3);
}

.process-metrics {
  display: flex;
  flex-direction: column;
  font-size: 0.75rem;
  color: var(--text-2);
  text-align: right;
}

@media (max-width: 1100px) {
  .hero {
    grid-template-columns: 1fr;
  }

  .hero-metrics {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-metrics {
    grid-template-columns: 1fr;
  }
}
</style>
