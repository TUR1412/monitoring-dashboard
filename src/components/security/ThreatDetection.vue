<!-- src/components/security/ThreatDetection.vue -->
<template>
  <div class="threat-detection fade-in">
    <header class="threat-header">
      <div>
        <h2 class="page-title">威胁检测系统</h2>
        <p class="subtitle">持续监测异常行为与攻击路径，实时协同响应。</p>
      </div>
      <div class="header-actions">
        <span class="stat-chip">
          <i class="fas fa-satellite-dish"></i>
          实时监控
        </span>
        <BaseButton type="primary" @click="refreshThreats">
          <i class="fas fa-rotate" :class="{ spin: isRefreshing }"></i>
          刷新数据
        </BaseButton>
      </div>
    </header>

    <div class="priority-grid">
      <div
        v-for="priority in priorities"
        :key="priority.label"
        class="card priority-card pressable"
        :style="{ borderColor: `${priority.color}60` }"
      >
        <div class="priority-top">
          <div class="priority-icon" :style="{ color: priority.color, background: `${priority.color}1A` }">
            <i :class="priority.icon"></i>
          </div>
          <span class="priority-trend" :class="priority.trend.startsWith('+') ? 'up' : 'down'">
            {{ priority.trend }}
          </span>
        </div>
        <div class="priority-body">
          <h3 class="priority-label">{{ priority.label }}</h3>
          <div class="priority-value" :style="{ color: priority.color }">
            {{ priority.count }}
          </div>
        </div>
        <div class="progress-track">
          <div
            class="progress-fill"
            :style="{ width: `${priority.percentage}%`, background: priority.color }"
          ></div>
        </div>
        <p class="priority-footnote">风险占比 {{ priority.percentage }}%</p>
      </div>
    </div>

    <section class="card threat-details">
      <div class="section-header">
        <div class="section-title">
          <span class="icon-badge">
            <i class="fas fa-bug"></i>
          </span>
          威胁详情
        </div>
        <span class="section-meta">最后更新 {{ currentTime }}</span>
      </div>

      <div class="threat-list">
        <div
          v-for="threat in threats"
          :key="threat.id"
          class="threat-item"
          :style="{ borderColor: `${getThreatColor(threat.severity)}66` }"
        >
          <div class="threat-main">
            <div class="threat-indicator" :style="{ background: getThreatColor(threat.severity) }"></div>
            <div>
              <div class="threat-title">{{ threat.description }}</div>
              <div class="threat-meta">
                IP: {{ threat.ip }} · 来源: {{ threat.source }}
              </div>
            </div>
          </div>
          <div class="threat-right">
            <span class="status-pill" :class="getStatusClass(threat.status)">
              {{ threat.status }}
            </span>
            <span class="time-text">{{ formatDate(threat.timestamp) }}</span>
          </div>
          <div class="threat-actions">
            <BaseButton
              v-for="action in threat.actions"
              :key="action.label"
              type="default"
              size="small"
              :style="{ borderColor: `${getThreatColor(threat.severity)}80`, color: getThreatColor(threat.severity) }"
            >
              {{ action.label }}
            </BaseButton>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'

const currentTime = ref(new Date().toLocaleString('zh-CN'))
const isRefreshing = ref(false)
let timeTicker = null

const priorities = ref([
  {
    label: '高危威胁',
    count: 3,
    trend: '+2',
    percentage: 75,
    color: 'var(--neon-red)',
    icon: 'fas fa-skull-crossbones'
  },
  {
    label: '中度威胁',
    count: 7,
    trend: '-1',
    percentage: 45,
    color: 'var(--neon-yellow)',
    icon: 'fas fa-radiation'
  },
  {
    label: '低危威胁',
    count: 12,
    trend: '+5',
    percentage: 25,
    color: 'var(--neon-green)',
    icon: 'fas fa-shield-alt'
  }
])

const threats = ref([
  {
    id: 1,
    description: '检测到未授权的系统访问尝试',
    severity: 'high',
    status: '需立即处理',
    timestamp: new Date().getTime() - 1000 * 60 * 30,
    ip: '192.168.1.100',
    source: '外部网络',
    actions: [
      { label: '隔离终端', type: 'isolate' },
      { label: '查看详情', type: 'view' }
    ]
  },
  {
    id: 2,
    description: '发现可疑的数据传输活动',
    severity: 'medium',
    status: '处理中',
    timestamp: new Date().getTime() - 1000 * 60 * 60,
    ip: '10.0.0.15',
    source: '内部网络',
    actions: [
      { label: '阻断连接', type: 'block' },
      { label: '查看详情', type: 'view' }
    ]
  },
  {
    id: 3,
    description: '检测到系统配置异常变更',
    severity: 'low',
    status: '已解决',
    timestamp: new Date().getTime() - 1000 * 60 * 120,
    ip: '172.16.0.8',
    source: '本地终端',
    actions: [
      { label: '恢复配置', type: 'restore' },
      { label: '查看详情', type: 'view' }
    ]
  }
])

const getThreatColor = (severity) => {
  const colors = {
    high: 'var(--neon-red)',
    medium: 'var(--neon-yellow)',
    low: 'var(--neon-green)'
  }
  return colors[severity]
}

const getStatusClass = (status) => {
  return {
    'status-critical': status === '需立即处理',
    'status-warning': status === '处理中',
    'status-ok': status === '已解决'
  }
}

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString('zh-CN', {
    hour12: false,
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const refreshThreats = async () => {
  isRefreshing.value = true

  await new Promise(resolve => setTimeout(resolve, 800))

  priorities.value = priorities.value.map(priority => ({
    ...priority,
    count: Math.floor(Math.random() * 15),
    trend: `${Math.random() > 0.5 ? '+' : '-'}${Math.floor(Math.random() * 5)}`,
    percentage: Math.floor(Math.random() * 100)
  }))

  currentTime.value = new Date().toLocaleString('zh-CN')
  isRefreshing.value = false
}

onMounted(() => {
  timeTicker = setInterval(() => {
    currentTime.value = new Date().toLocaleString('zh-CN')
  }, 1000)
})

onUnmounted(() => {
  if (timeTicker) {
    clearInterval(timeTicker)
  }
})
</script>

<style scoped>
.threat-detection {
  padding: var(--container-padding);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.threat-header {
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

.priority-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.2rem;
}

.priority-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border: 1px solid var(--border-color);
  background: rgba(15, 23, 42, 0.32);
}

.priority-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.priority-icon {
  width: 44px;
  height: 44px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.priority-trend {
  font-size: 0.85rem;
  font-weight: 600;
}

.priority-trend.up {
  color: var(--neon-red);
}

.priority-trend.down {
  color: var(--neon-green);
}

.priority-label {
  font-size: 1rem;
  margin: 0;
  color: var(--text-muted);
}

.priority-value {
  font-size: 2.4rem;
  font-weight: 700;
}

.progress-track {
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.3s ease;
}

.priority-footnote {
  color: var(--text-muted);
  font-size: 0.8rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.2rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.2rem;
  font-weight: 600;
}

.section-meta {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.icon-badge {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(46, 196, 182, 0.18);
  color: var(--neon-blue);
  border: 1px solid rgba(46, 196, 182, 0.4);
}

.threat-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.threat-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.threat-item {
  padding: 1rem 1.2rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background: rgba(15, 23, 42, 0.28);
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.75rem;
}

.threat-main {
  display: flex;
  gap: 0.8rem;
  align-items: flex-start;
}

.threat-indicator {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  margin-top: 0.35rem;
  box-shadow: 0 0 12px currentColor;
}

.threat-title {
  font-weight: 600;
  color: var(--text-strong);
}

.threat-meta {
  color: var(--text-muted);
  font-size: 0.85rem;
  margin-top: 0.3rem;
}

.threat-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.4rem;
}

.status-pill {
  padding: 0.3rem 0.8rem;
  border-radius: 999px;
  font-size: 0.75rem;
  border: 1px solid transparent;
  font-weight: 600;
}

.status-pill.status-critical {
  color: var(--neon-red);
  background: rgba(231, 111, 81, 0.12);
  border-color: rgba(231, 111, 81, 0.4);
}

.status-pill.status-warning {
  color: var(--neon-yellow);
  background: rgba(246, 189, 96, 0.12);
  border-color: rgba(246, 189, 96, 0.45);
}

.status-pill.status-ok {
  color: var(--neon-green);
  background: rgba(6, 214, 160, 0.12);
  border-color: rgba(6, 214, 160, 0.45);
}

.time-text {
  color: var(--text-muted);
  font-size: 0.8rem;
}

.threat-actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.spin {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .threat-item {
    grid-template-columns: 1fr;
  }

  .threat-right {
    align-items: flex-start;
  }
}
</style>
