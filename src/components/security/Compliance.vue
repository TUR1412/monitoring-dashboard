<!-- src/components/security/Compliance.vue -->
<template>
  <div class="compliance-dashboard fade-in">
    <header class="header">
      <div>
        <h2 class="page-title">合规审计</h2>
        <p class="subtitle">核心框架与控制项的达标状态一览。</p>
      </div>
      <div class="header-actions">
        <span class="stat-chip">
          <AppIcon name="file" className="inline-icon" />
          审计覆盖 3 项框架
        </span>
        <BaseButton type="primary" @click="refreshAudit">
          <AppIcon name="refresh" className="inline-icon" />
          刷新评估
        </BaseButton>
      </div>
    </header>

    <div class="compliance-grid">
      <div v-for="card in complianceCards" :key="card.title" class="card compliance-card pressable">
        <div class="card-head">
          <AppIcon :name="card.icon" className="card-icon" :style="{ color: getStatusColor(card.status) }" />
          <div>
            <h3 class="card-title">{{ card.title }}</h3>
            <p class="card-desc">{{ card.description }}</p>
          </div>
        </div>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: `${card.progress}%`, background: getStatusColor(card.status) }"></div>
        </div>
        <div class="card-foot">
          <span class="status-pill" :class="getStatusClass(card.status)">
            {{ getStatusText(card.status) }}
          </span>
          <span class="card-progress">{{ card.progress }}%</span>
        </div>
      </div>
    </div>

    <section class="card compliance-details">
      <div class="section-header">
        <div class="section-title">
          <span class="icon-badge">
            <AppIcon name="file" />
          </span>
          详细合规信息
        </div>
        <span class="section-meta">共 {{ complianceDetails.length }} 项控制</span>
      </div>
      <div class="detail-list">
        <div v-for="item in complianceDetails" :key="item.id" class="detail-item">
          <div class="detail-top">
            <span class="detail-label">{{ item.description }}</span>
            <span class="status-pill" :class="getStatusClass(item.status)">
              {{ getStatusText(item.status) }}
            </span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: `${item.progress}%`, background: getStatusColor(item.status) }"></div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import AppIcon from '@/components/base/AppIcon.vue'

const complianceData = ref([
  {
    title: 'GDPR 合规',
    status: 'compliant',
    description: '数据保护与隐私合规',
    icon: 'shield',
    progress: 100
  },
  {
    title: 'ISO 27001',
    status: 'in-progress',
    description: '信息安全管理体系认证',
    icon: 'alert',
    progress: 75
  },
  {
    title: 'SOC 2',
    status: 'non-compliant',
    description: '服务机构控制报告',
    icon: 'x',
    progress: 30
  }
])

const complianceDetails = ref([
  {
    id: 1,
    description: '数据加密标准',
    status: 'compliant',
    progress: 100
  },
  {
    id: 2,
    description: '访问控制策略',
    status: 'in-progress',
    progress: 75
  },
  {
    id: 3,
    description: '安全审计日志',
    status: 'non-compliant',
    progress: 30
  }
])

const complianceCards = computed(() => complianceData.value)

const refreshAudit = () => {
  complianceData.value = complianceData.value.map(item => ({
    ...item,
    progress: Math.max(20, Math.min(100, item.progress + (Math.random() * 20 - 10)))
  }))
}

const getStatusText = (status) => ({
  compliant: '完全合规',
  'in-progress': '进行中',
  'non-compliant': '未合规'
}[status])

const getStatusColor = (status) => ({
  compliant: 'var(--neon-green)',
  'in-progress': 'var(--neon-yellow)',
  'non-compliant': 'var(--neon-red)'
}[status])

const getStatusClass = (status) => ({
  compliant: 'status-ok',
  'in-progress': 'status-warning',
  'non-compliant': 'status-critical'
}[status])
</script>

<style scoped>
.compliance-dashboard {
  padding: var(--container-padding);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.header {
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

.compliance-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.2rem;
}

.compliance-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: rgba(15, 23, 42, 0.3);
}

.card-head {
  display: flex;
  gap: 0.9rem;
  align-items: center;
}

.card-icon {
  width: 44px;
  height: 44px;
  padding: 0.5rem;
  border-radius: 16px;
  background: rgba(46, 196, 182, 0.16);
  border: 1px solid rgba(46, 196, 182, 0.3);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.card-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
}

.card-desc {
  margin: 0.2rem 0 0;
  color: var(--text-muted);
  font-size: 0.88rem;
}

.progress-track {
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.3s ease;
}

.card-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-progress {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.compliance-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.2rem;
  font-weight: 600;
}

.section-meta {
  color: var(--text-muted);
  font-size: 0.9rem;
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

.detail-list {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.detail-item {
  padding: 1rem 1.2rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background: rgba(15, 23, 42, 0.25);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.detail-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.detail-label {
  font-weight: 600;
}

.status-pill {
  padding: 0.25rem 0.8rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid transparent;
}

.status-pill.status-ok {
  color: var(--neon-green);
  background: rgba(6, 214, 160, 0.12);
  border-color: rgba(6, 214, 160, 0.45);
}

.status-pill.status-warning {
  color: var(--neon-yellow);
  background: rgba(246, 189, 96, 0.12);
  border-color: rgba(246, 189, 96, 0.45);
}

.status-pill.status-critical {
  color: var(--neon-red);
  background: rgba(231, 111, 81, 0.12);
  border-color: rgba(231, 111, 81, 0.45);
}

.inline-icon {
  margin-right: 0.5rem;
}
</style>
