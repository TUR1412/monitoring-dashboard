<!-- src/components/security/AccessControl.vue -->
<template>
  <div class="access-control">
    <div class="section-header">
      <div>
        <div class="section-title">访问控制</div>
        <div class="section-subtitle">策略护栏、会话追踪与安全边界</div>
      </div>
      <span class="pill">{{ policies.length }} 项策略 · {{ activeSessions.length }} 个会话</span>
    </div>

    <section class="bento-grid access-overview">
      <div class="surface-card bento-card bento-span-3 overview-card">
        <div class="overview-label">启用策略</div>
        <div class="overview-value">{{ enabledPolicies }}</div>
        <div class="overview-meta">最近更新 {{ policyUpdatedLabel }}</div>
      </div>
      <div class="surface-card bento-card bento-span-3 overview-card warning">
        <div class="overview-label">禁用策略</div>
        <div class="overview-value">{{ disabledPolicies }}</div>
        <div class="overview-meta">需复核</div>
      </div>
      <div class="surface-card bento-card bento-span-3 overview-card info">
        <div class="overview-label">远程会话</div>
        <div class="overview-value">{{ remoteSessions }}</div>
        <div class="overview-meta">重点关注</div>
      </div>
      <div class="surface-card bento-card bento-span-3 overview-card success">
        <div class="overview-label">最近刷新</div>
        <div class="overview-value">{{ sessionRefreshLabel }}</div>
        <div class="overview-meta">会话视图</div>
      </div>
    </section>

    <section class="access-panels">
      <div class="surface-card access-panel">
        <div class="panel-header">
          <div>
            <h3>访问策略</h3>
            <p>应用级、系统级与网络级策略统一治理</p>
          </div>
          <div class="panel-actions">
            <BaseButton type="ghost" size="small" @click="exportPoliciesCsv">CSV</BaseButton>
            <BaseButton type="ghost" size="small" @click="exportPoliciesJson">JSON</BaseButton>
          </div>
        </div>

        <div class="filter-grid">
          <div class="filter-group">
            <span class="filter-label">关键字</span>
            <BaseInput v-model="policyQuery" placeholder="搜索策略名称或描述" />
          </div>
          <div class="filter-group">
            <span class="filter-label">状态</span>
            <select v-model="policyStatus" aria-label="策略状态">
              <option value="all">全部</option>
              <option value="enabled">启用</option>
              <option value="disabled">禁用</option>
            </select>
          </div>
          <div class="filter-group">
            <span class="filter-label">类型</span>
            <select v-model="policyType" aria-label="策略类型">
              <option value="all">全部</option>
              <option v-for="type in policyTypeOptions" :key="type" :value="type">{{ type }}</option>
            </select>
          </div>
          <div class="filter-group">
            <span class="filter-label">排序</span>
            <select v-model="policySort" aria-label="策略排序">
              <option value="latest">最近更新</option>
              <option value="oldest">最早更新</option>
            </select>
          </div>
        </div>

        <div class="filter-meta">
          <span>筛选结果 {{ filteredPolicies.length }} 条</span>
          <span>更新：{{ policyUpdatedLabel }}</span>
        </div>

        <div class="policy-list">
          <article v-for="policy in filteredPolicies" :key="policy.id" class="policy-item">
            <div class="policy-main">
              <div class="policy-title">
                <span class="policy-name">{{ policy.name }}</span>
                <span :class="['status-badge', policy.status === '启用' ? 'success' : 'danger']">
                  {{ policy.status }}
                </span>
              </div>
              <p class="policy-description">{{ policy.description }}</p>
              <div class="policy-meta">
                <span class="meta-pill">{{ policy.type }}</span>
                <span>更新 {{ formatDateTime(policy.lastUpdated) }}</span>
              </div>
            </div>
            <BaseButton type="ghost" size="small" @click="togglePolicy(policy.id)">
              {{ policy.status === '启用' ? '停用' : '启用' }}
            </BaseButton>
          </article>
          <div v-if="!filteredPolicies.length" class="empty-state">暂无匹配策略</div>
        </div>
      </div>

      <div class="surface-card access-panel">
        <div class="panel-header">
          <div>
            <h3>活动会话</h3>
            <p>实时访问与设备分布状态</p>
          </div>
          <div class="panel-actions">
            <BaseButton type="ghost" size="small" @click="refreshSessions">
              刷新
            </BaseButton>
            <BaseButton type="ghost" size="small" @click="exportSessionsCsv">CSV</BaseButton>
            <BaseButton type="ghost" size="small" @click="exportSessionsJson">JSON</BaseButton>
          </div>
        </div>

        <div class="filter-grid">
          <div class="filter-group">
            <span class="filter-label">关键字</span>
            <BaseInput v-model="sessionQuery" placeholder="搜索用户、IP 或地点" />
          </div>
          <div class="filter-group">
            <span class="filter-label">设备</span>
            <select v-model="sessionDevice" aria-label="设备类型">
              <option value="all">全部</option>
              <option v-for="device in deviceTypeOptions" :key="device" :value="device">{{ device }}</option>
            </select>
          </div>
          <div class="filter-group">
            <span class="filter-label">排序</span>
            <select v-model="sessionSort" aria-label="会话排序">
              <option value="latest">最新登录</option>
              <option value="oldest">最早登录</option>
            </select>
          </div>
          <div class="filter-group">
            <span class="filter-label">数量</span>
            <select v-model="sessionLimit" aria-label="会话数量">
              <option value="5">最近5条</option>
              <option value="10">最近10条</option>
              <option value="20">最近20条</option>
              <option value="all">全部</option>
            </select>
          </div>
        </div>

        <div class="filter-meta">
          <span>筛选结果 {{ filteredSessions.length }} 条</span>
          <span>最近刷新 {{ sessionRefreshLabel }}</span>
        </div>

        <div class="session-list">
          <article v-for="session in filteredSessions" :key="session.id" class="session-item">
            <div class="session-main">
              <div class="session-title">
                <span class="session-user">{{ session.username }}</span>
                <span class="status-badge info">{{ session.deviceType }}</span>
              </div>
              <div class="session-meta">
                <span class="meta-pill">{{ session.ip }}</span>
                <span class="meta-pill">{{ session.location }}</span>
              </div>
              <div class="session-time">登录 {{ formatDateTime(session.loginTime) }}</div>
            </div>
            <BaseButton type="danger" size="small" @click="terminateSession(session.id)">终止</BaseButton>
          </article>
          <div v-if="!filteredSessions.length" class="empty-state">暂无匹配会话</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import { exportCsv, exportJson, formatDateTime, getLatestDate, sortByTimestamp } from '@/utils/logs'
import { safeStorage } from '@/utils/storage'

const STORAGE_KEY = 'monitoring-dashboard:access-control:filters'

const defaultFilters = {
  policyQuery: '',
  policyStatus: 'all',
  policyType: 'all',
  policySort: 'latest',
  sessionQuery: '',
  sessionDevice: 'all',
  sessionSort: 'latest',
  sessionLimit: '10'
}

const readFilters = () => {
  const saved = safeStorage.get(STORAGE_KEY, null)
  if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return { ...defaultFilters }
  return { ...defaultFilters, ...saved }
}

const initialFilters = readFilters()

const policyQuery = ref(initialFilters.policyQuery ?? defaultFilters.policyQuery)
const policyStatus = ref(initialFilters.policyStatus ?? defaultFilters.policyStatus)
const policyType = ref(initialFilters.policyType ?? defaultFilters.policyType)
const policySort = ref(initialFilters.policySort ?? defaultFilters.policySort)
const sessionQuery = ref(initialFilters.sessionQuery ?? defaultFilters.sessionQuery)
const sessionDevice = ref(initialFilters.sessionDevice ?? defaultFilters.sessionDevice)
const sessionSort = ref(initialFilters.sessionSort ?? defaultFilters.sessionSort)
const sessionLimit = ref(initialFilters.sessionLimit ?? defaultFilters.sessionLimit)
const lastRefreshAt = ref(Date.now())

const policies = ref([
  { 
    id: 1, 
    name: '管理员访问权限', 
    type: '系统级',
    status: '启用',
    description: '允许管理员完全访问所有系统资源和配置',
    lastUpdated: '2024-04-26'
  },
  { 
    id: 2, 
    name: '用户访问权限', 
    type: '应用级',
    status: '启用',
    description: '标准用户的基本系统访问权限配置',
    lastUpdated: '2024-04-25'
  },
  { 
    id: 3, 
    name: '访客访问权限', 
    type: '受限级',
    status: '禁用',
    description: '临时访客的有限系统访问权限',
    lastUpdated: '2024-04-24'
  },
  { 
    id: 4, 
    name: '远程访问权限', 
    type: '网络级',
    status: '启用',
    description: '允许授权用户进行远程系统访问',
    lastUpdated: '2024-04-23'
  }
])

const activeSessions = ref([
  { 
    id: 1, 
    username: 'admin', 
    ip: '192.168.1.10', 
    location: '办公室', 
    loginTime: '2024-04-27 08:00:00',
    deviceType: '桌面终端'
  },
  { 
    id: 2, 
    username: 'user1', 
    ip: '192.168.1.11', 
    location: '远程', 
    loginTime: '2024-04-27 09:30:00',
    deviceType: '移动设备'
  },
  { 
    id: 3, 
    username: 'developer', 
    ip: '192.168.1.12', 
    location: '开发区', 
    loginTime: '2024-04-27 10:15:00',
    deviceType: '工作站'
  }
])

const policyTypeOptions = computed(() => {
  const types = policies.value.map(policy => policy.type)
  return Array.from(new Set(types))
})

const deviceTypeOptions = computed(() => {
  const types = activeSessions.value.map(session => session.deviceType)
  return Array.from(new Set(types))
})

const filteredPolicies = computed(() => {
  const keyword = policyQuery.value.trim().toLowerCase()
  let data = policies.value.filter(policy => {
    if (policyStatus.value === 'enabled' && policy.status !== '启用') return false
    if (policyStatus.value === 'disabled' && policy.status !== '禁用') return false
    if (policyType.value !== 'all' && policy.type !== policyType.value) return false
    if (keyword) {
      const haystack = `${policy.name} ${policy.description}`.toLowerCase()
      if (!haystack.includes(keyword)) return false
    }
    return true
  })
  data = sortByTimestamp(data, policySort.value === 'oldest' ? 'asc' : 'desc', (policy) => policy.lastUpdated)
  return data
})

const filteredSessions = computed(() => {
  const keyword = sessionQuery.value.trim().toLowerCase()
  let data = activeSessions.value.filter(session => {
    if (sessionDevice.value !== 'all' && session.deviceType !== sessionDevice.value) return false
    if (keyword) {
      const haystack = `${session.username} ${session.ip} ${session.location}`.toLowerCase()
      if (!haystack.includes(keyword)) return false
    }
    return true
  })
  data = sortByTimestamp(data, sessionSort.value === 'oldest' ? 'asc' : 'desc', (session) => session.loginTime)
  const limit = sessionLimit.value === 'all' ? Number.POSITIVE_INFINITY : Number(sessionLimit.value) || 10
  return Number.isFinite(limit) ? data.slice(0, limit) : data
})

const enabledPolicies = computed(() => policies.value.filter(policy => policy.status === '启用').length)
const disabledPolicies = computed(() => policies.value.filter(policy => policy.status === '禁用').length)
const remoteSessions = computed(() =>
  activeSessions.value.filter(session => session.location === '远程').length
)

const policyUpdatedLabel = computed(() => {
  const latest = getLatestDate(policies.value, (policy) => policy.lastUpdated)
  return latest ? formatDateTime(latest) : '暂无数据'
})

const sessionRefreshLabel = computed(() => formatDateTime(lastRefreshAt.value))

const togglePolicy = (id) => {
  const policy = policies.value.find(item => item.id === id)
  if (!policy) return
  policy.status = policy.status === '启用' ? '禁用' : '启用'
  policy.lastUpdated = formatDateTime(Date.now())
}

const terminateSession = (id) => {
  activeSessions.value = activeSessions.value.filter(session => session.id !== id)
}

const refreshSessions = async () => {
  await new Promise(resolve => setTimeout(resolve, 600))
  lastRefreshAt.value = Date.now()
}

const policyColumns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: '名称' },
  { key: 'type', label: '类型' },
  { key: 'status', label: '状态' },
  { key: 'description', label: '描述' },
  { key: 'lastUpdated', label: '更新时间', format: (value) => formatDateTime(value) }
]

const sessionColumns = [
  { key: 'id', label: 'ID' },
  { key: 'username', label: '用户' },
  { key: 'ip', label: 'IP' },
  { key: 'location', label: '位置' },
  { key: 'deviceType', label: '设备' },
  { key: 'loginTime', label: '登录时间', format: (value) => formatDateTime(value) }
]

const exportPoliciesCsv = () => exportCsv(filteredPolicies.value, policyColumns, 'access-policies')
const exportPoliciesJson = () => exportJson(filteredPolicies.value, 'access-policies')
const exportSessionsCsv = () => exportCsv(filteredSessions.value, sessionColumns, 'active-sessions')
const exportSessionsJson = () => exportJson(filteredSessions.value, sessionColumns, 'active-sessions')

watch(
  [policyQuery, policyStatus, policyType, policySort, sessionQuery, sessionDevice, sessionSort, sessionLimit],
  ([pQuery, pStatus, pType, pSort, sQuery, sDevice, sSort, sLimit]) => {
    safeStorage.set(STORAGE_KEY, {
      policyQuery: pQuery,
      policyStatus: pStatus,
      policyType: pType,
      policySort: pSort,
      sessionQuery: sQuery,
      sessionDevice: sDevice,
      sessionSort: sSort,
      sessionLimit: sLimit
    })
  }
)

onMounted(() => {
  refreshSessions()
})
</script>

<style scoped>
.access-control {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.access-overview {
  align-items: stretch;
}

.overview-card {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.overview-card.warning {
  border-color: rgba(245, 158, 11, 0.35);
  background: rgba(245, 158, 11, 0.08);
}

.overview-card.info {
  border-color: rgba(46, 196, 182, 0.35);
  background: rgba(46, 196, 182, 0.08);
}

.overview-card.success {
  border-color: rgba(34, 197, 94, 0.35);
  background: rgba(34, 197, 94, 0.08);
}

.overview-label {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.overview-value {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text-strong);
}

.overview-meta {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.access-panels {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

.access-panel {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.panel-header p {
  margin-top: 0.35rem;
  color: var(--text-muted);
  font-size: 0.85rem;
}

.panel-actions {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.filter-label {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.filter-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.policy-list,
.session-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.policy-item,
.session-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 1rem;
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.05);
}

.policy-main,
.session-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.policy-title,
.session-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.policy-name,
.session-user {
  font-weight: 600;
  color: var(--text-strong);
}

.policy-description {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.policy-meta,
.session-meta {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.session-time {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.meta-pill {
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.72rem;
}

.status-badge {
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  font-size: 0.7rem;
  border: 1px solid transparent;
}

.status-badge.success {
  border-color: rgba(34, 197, 94, 0.4);
  color: #bbf7d0;
}

.status-badge.danger {
  border-color: rgba(239, 68, 68, 0.4);
  color: #fecaca;
}

.status-badge.info {
  border-color: rgba(46, 196, 182, 0.4);
  color: #99f6e4;
}

.empty-state {
  padding: 1rem 0;
  text-align: center;
  color: var(--text-muted);
}
</style>
