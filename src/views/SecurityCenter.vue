<!-- src/views/SecurityCenter.vue -->
<template>
  <div class="security-center">
    <div class="section-header">
      <div>
        <div class="section-title">安全中心</div>
        <div class="section-subtitle">威胁检测、访问控制与合规审计</div>
      </div>
      <span class="pill">策略已同步</span>
    </div>

    <section class="bento-grid security-overview">
      <div class="surface-card bento-card bento-span-4 security-card">
        <div class="security-label">高危威胁</div>
        <div class="security-value">{{ criticalThreats }}</div>
        <div class="security-meta">高危 {{ highThreats }} · 最新 {{ lastUpdateLabel }}</div>
      </div>
      <div class="surface-card bento-card bento-span-4 security-card warning">
        <div class="security-label">敏感操作</div>
        <div class="security-value">{{ auditRisk }}</div>
        <div class="security-meta">高敏动作 · 重点关注</div>
      </div>
      <div class="surface-card bento-card bento-span-4 security-card success">
        <div class="security-label">合规评分</div>
        <div class="security-value">{{ complianceScore }}</div>
        <div class="security-meta">{{ complianceLabel }}</div>
      </div>
    </section>

    <div class="security-content">
      <nav class="security-nav surface-glass">
        <router-link
          to="/dashboard/security/threats"
          class="nav-link"
          :class="{ 'active-link': isActive('threats') }"
        >
          威胁检测
        </router-link>
        <router-link
          to="/dashboard/security/access-control"
          class="nav-link"
          :class="{ 'active-link': isActive('access-control') }"
        >
          访问控制
        </router-link>
        <router-link
          to="/dashboard/security/compliance"
          class="nav-link"
          :class="{ 'active-link': isActive('compliance') }"
        >
          合规审计
        </router-link>
      </nav>
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useMonitorStore } from '@/stores/monitorStore'
import { formatDateTime, getLatestDate } from '@/utils/logs'

const route = useRoute()
const store = useMonitorStore()

const isActive = (segment) => route.path.includes(segment)

const criticalThreats = computed(() =>
  (store.securityLogs || []).filter(item => item.level === 'critical').length
)
const highThreats = computed(() =>
  (store.securityLogs || []).filter(item => item.level === 'high').length
)
const auditRisk = computed(() =>
  (store.auditLogs || []).filter(item => ['delete', 'update'].includes(item.action)).length
)

const complianceScore = computed(() => {
  const score = 98 - criticalThreats.value * 8 - highThreats.value * 4 - auditRisk.value * 2
  return Math.max(60, Math.round(score))
})

const complianceLabel = computed(() => {
  if (complianceScore.value >= 90) return '合规良好'
  if (complianceScore.value >= 80) return '需重点关注'
  return '风险升高'
})

const lastUpdateLabel = computed(() => {
  const latest = getLatestDate(store.securityLogs || [], (log) => log.timestamp)
  return latest ? formatDateTime(latest) : '暂无数据'
})
</script>

<style scoped>
.security-center {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.security-overview {
  align-items: stretch;
}

.security-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.security-card.warning {
  border-color: rgba(245, 158, 11, 0.35);
  background: rgba(245, 158, 11, 0.08);
}

.security-card.success {
  border-color: rgba(34, 197, 94, 0.35);
  background: rgba(34, 197, 94, 0.08);
}

.security-label {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.security-value {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text-strong);
}

.security-meta {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.security-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.security-nav {
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.nav-link {
  padding: 6px 12px;
  text-decoration: none;
  color: var(--text-muted);
  border-radius: 999px;
  transition: background-color 0.3s, color 0.3s;
}

.nav-link:hover {
  background-color: rgba(46, 196, 182, 0.12);
  color: var(--text-strong);
}

.active-link {
  color: var(--text-strong);
  background-color: rgba(46, 196, 182, 0.18);
}
</style>
