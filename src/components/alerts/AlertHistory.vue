<!-- src/components/alerts/AlertHistory.vue -->
<template>
  <div class="alert-history">
    <div class="section-header">
      <div>
        <div class="section-title">历史警报</div>
        <div class="section-subtitle">筛选、复盘与导出风险事件</div>
      </div>
      <div class="header-actions">
        <button class="btn btn-ghost" title="刷新数据" @click="refreshData">
          <i class="fas fa-rotate-right"></i>
          刷新数据
        </button>
        <button class="btn btn-primary" title="导出数据" @click="exportAlerts">
          <i class="fas fa-download"></i>
          导出数据
        </button>
      </div>
    </div>

    <div class="surface-card filter-panel">
      <div class="filter-grid">
        <div class="filter-group">
          <span class="filter-label">日期范围</span>
          <FormSelect v-model="filters.dateRange" :options="filterConfig.dateRange.options" />
        </div>
        <div class="filter-group">
          <span class="filter-label">严重程度</span>
          <FormSelect v-model="filters.severity" :options="filterConfig.severity.options" />
        </div>
        <div class="filter-group">
          <span class="filter-label">状态</span>
          <FormSelect v-model="filters.status" :options="filterConfig.status.options" />
        </div>
        <div class="filter-group">
          <span class="filter-label">警报类型</span>
          <FormSelect v-model="filters.alertType" :options="filterConfig.alertType.options" />
        </div>
      </div>

      <div v-if="filters.dateRange === 'custom'" class="filter-grid secondary">
        <div class="filter-group">
          <span class="filter-label">开始日期</span>
          <BaseInput
            v-model="filters.startDate"
            type="datetime-local"
            placeholder="选择开始时间"
          />
        </div>
        <div class="filter-group">
          <span class="filter-label">结束日期</span>
          <BaseInput
            v-model="filters.endDate"
            type="datetime-local"
            placeholder="选择结束时间"
            :min="filters.startDate || undefined"
          />
        </div>
      </div>
    </div>

    <div class="surface-card table-panel">
      <div class="table-header">
        <div>
          <h3>警报列表</h3>
          <p>共 {{ filteredAlerts.length }} 条事件</p>
        </div>
        <div class="table-tools">
          <span class="pill">排序: {{ getHeaderLabel(sortKey) }}</span>
        </div>
      </div>

      <div v-if="loading" class="state-block">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>

      <div v-else-if="!displayedAlerts.length" class="state-block empty">
        <p>暂无匹配的历史警报</p>
      </div>

      <div v-else class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th
                v-for="header in tableHeaders"
                :key="header.key"
                :class="{ sortable: header.sortable }"
                @click="header.sortable && sortBy(header.key)"
              >
                <span>{{ header.label }}</span>
                <i
                  v-if="header.sortable"
                  class="fas"
                  :class="sortIcon(header.key)"
                ></i>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="alert in displayedAlerts" :key="alert.id">
              <td>{{ formatDate(alert.timestamp) }}</td>
              <td>
                <span :class="['badge', `badge-${alert.category}`]">{{ alert.type }}</span>
              </td>
              <td>
                <span :class="['badge', `badge-${alert.severity}`]">{{ severityMap[alert.severity].label }}</span>
              </td>
              <td>
                <span :class="['badge', `badge-${alert.status}`]">{{ statusMap[alert.status].label }}</span>
              </td>
              <td class="truncate" :title="alert.description">{{ alert.description }}</td>
              <td>
                <div class="row-actions">
                  <button class="btn btn-ghost" @click="viewAlertDetails(alert)">查看</button>
                  <button
                    class="btn btn-ghost"
                    :disabled="alert.status === 'resolved'"
                    @click="handleUpdateAlertStatus(alert)"
                  >
                    {{ alert.status === 'open' ? '确认' : '解决' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <div class="pagination-size">
          <span>每页显示</span>
          <FormSelect v-model="pagination.pageSize" :options="pageSizeOptions" />
        </div>
        <div class="pagination-controls">
          <button class="btn btn-ghost" :disabled="!canPrev" @click="goToPage(pagination.currentPage - 1)">
            上一页
          </button>
          <div class="page-numbers">
            <button
              v-for="page in pageNumbers"
              :key="page"
              class="page-number"
              :class="{ active: page === pagination.currentPage }"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
          </div>
          <button class="btn btn-ghost" :disabled="!canNext" @click="goToPage(pagination.currentPage + 1)">
            下一页
          </button>
        </div>
      </div>
    </div>

    <BaseModal v-model="dialogVisible" title="警报详情" width="520px">
      <div v-if="selectedAlert" class="detail-block">
        <div class="detail-row">
          <span>时间</span>
          <span>{{ formatDate(selectedAlert.timestamp) }}</span>
        </div>
        <div class="detail-row">
          <span>类型</span>
          <span>{{ selectedAlert.type }}</span>
        </div>
        <div class="detail-row">
          <span>严重程度</span>
          <span>{{ severityMap[selectedAlert.severity].label }}</span>
        </div>
        <div class="detail-row">
          <span>状态</span>
          <span>{{ statusMap[selectedAlert.status].label }}</span>
        </div>
        <div class="detail-row">
          <span>描述</span>
          <span>{{ selectedAlert.description }}</span>
        </div>
      </div>
      <template #footer>
        <button class="btn btn-primary" @click="dialogVisible = false">关闭</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { saveAs } from 'file-saver'
import FormSelect from '@/components/common/FormSelect.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import { notify } from '@/utils/notify'

const alertData = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const selectedAlert = ref(null)

const sortKey = ref('timestamp')
const sortOrder = ref('desc')

const tableHeaders = [
  { key: 'timestamp', label: '时间', sortable: true },
  { key: 'type', label: '警报类型', sortable: true },
  { key: 'severity', label: '严重程度', sortable: true },
  { key: 'status', label: '状态', sortable: true },
  { key: 'description', label: '描述', sortable: false },
  { key: 'actions', label: '操作', sortable: false }
]

const filters = ref({
  dateRange: '24h',
  severity: 'all',
  status: 'all',
  alertType: 'all',
  startDate: '',
  endDate: ''
})

const pagination = ref({
  currentPage: 1,
  pageSize: 10
})

const pageSizeOptions = [
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 50, label: '50' }
]

const filterConfig = {
  dateRange: {
    options: [
      { value: '24h', label: '最近24小时' },
      { value: '7d', label: '最近7天' },
      { value: '30d', label: '最近30天' },
      { value: 'custom', label: '自定义范围' }
    ]
  },
  severity: {
    options: [
      { value: 'all', label: '全部' },
      { value: 'critical', label: '严重' },
      { value: 'high', label: '高' },
      { value: 'medium', label: '中' },
      { value: 'low', label: '低' }
    ]
  },
  status: {
    options: [
      { value: 'all', label: '全部' },
      { value: 'resolved', label: '已解决' },
      { value: 'acknowledged', label: '已确认' },
      { value: 'open', label: '未解决' }
    ]
  },
  alertType: {
    options: [
      { value: 'all', label: '全部类型' },
      { value: 'cpu', label: 'CPU相关' },
      { value: 'memory', label: '内存相关' },
      { value: 'disk', label: '磁盘相关' },
      { value: 'network', label: '网络相关' }
    ]
  }
}

const mockAlerts = [
  {
    id: 1,
    timestamp: '2024-12-24T10:15:30Z',
    type: 'CPU相关',
    category: 'cpu',
    severity: 'critical',
    status: 'open',
    description: 'CPU 使用率超过 90%'
  },
  {
    id: 2,
    timestamp: '2024-12-23T08:20:00Z',
    type: '内存相关',
    category: 'memory',
    severity: 'high',
    status: 'acknowledged',
    description: '内存使用率超过 80%'
  },
  {
    id: 3,
    timestamp: '2024-12-22T14:45:10Z',
    type: '磁盘相关',
    category: 'disk',
    severity: 'medium',
    status: 'resolved',
    description: '磁盘空间不足 10%'
  },
  {
    id: 4,
    timestamp: '2024-12-21T09:30:00Z',
    type: '网络相关',
    category: 'network',
    severity: 'low',
    status: 'open',
    description: '网络延迟超过 100ms'
  }
]

const statusMap = {
  open: { label: '未解决' },
  acknowledged: { label: '已确认' },
  resolved: { label: '已解决' }
}

const severityMap = {
  critical: { label: '严重' },
  high: { label: '高' },
  medium: { label: '中' },
  low: { label: '低' }
}

const getHeaderLabel = (key) => {
  const item = tableHeaders.find(header => header.key === key)
  return item ? item.label : '时间'
}

const getMockDateRange = (range) => {
  const now = new Date()
  let startDate = now
  if (range === '24h') {
    startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  } else if (range === '7d') {
    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  } else if (range === '30d') {
    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  }
  return { startDate, endDate: now }
}

const filteredAlerts = computed(() => {
  let result = [...alertData.value]
  if (filters.value.severity !== 'all') {
    result = result.filter(alert => alert.severity === filters.value.severity)
  }
  if (filters.value.status !== 'all') {
    result = result.filter(alert => alert.status === filters.value.status)
  }
  if (filters.value.alertType !== 'all') {
    result = result.filter(alert => alert.category === filters.value.alertType)
  }

  if (filters.value.dateRange === 'custom' && filters.value.startDate && filters.value.endDate) {
    const start = new Date(filters.value.startDate)
    const end = new Date(filters.value.endDate)
    result = result.filter(alert => {
      const date = new Date(alert.timestamp)
      return date >= start && date <= end
    })
  } else {
    const range = getMockDateRange(filters.value.dateRange)
    result = result.filter(alert => {
      const date = new Date(alert.timestamp)
      return date >= range.startDate && date <= range.endDate
    })
  }

  return result
})

const sortedAlerts = computed(() => {
  return [...filteredAlerts.value].sort((a, b) => {
    let aValue = a[sortKey.value]
    let bValue = b[sortKey.value]
    if (sortKey.value === 'timestamp') {
      aValue = new Date(aValue)
      bValue = new Date(bValue)
    }
    if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1
    if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })
})

const displayedAlerts = computed(() => {
  const start = (pagination.value.currentPage - 1) * pagination.value.pageSize
  const end = start + pagination.value.pageSize
  return sortedAlerts.value.slice(start, end)
})

const totalPages = computed(() => {
  const total = Math.ceil(filteredAlerts.value.length / pagination.value.pageSize)
  return total || 1
})

const pageNumbers = computed(() => {
  const current = pagination.value.currentPage
  const total = totalPages.value
  const delta = 2
  const start = Math.max(1, current - delta)
  const end = Math.min(total, current + delta)
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
})

const canPrev = computed(() => pagination.value.currentPage > 1)
const canNext = computed(() => pagination.value.currentPage < totalPages.value)

const sortIcon = (key) => {
  if (sortKey.value !== key) return 'fa-sort'
  return sortOrder.value === 'asc' ? 'fa-sort-up' : 'fa-sort-down'
}

const formatDate = (dateStr) => format(new Date(dateStr), 'yyyy年MM月dd日 HH:mm:ss', { locale: zhCN })

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

const goToPage = (page) => {
  const total = totalPages.value
  const target = Math.min(Math.max(page, 1), total)
  pagination.value.currentPage = target
}

const refreshData = async () => {
  await fetchAlertData()
}

const exportAlerts = () => {
  try {
    const payload = sortedAlerts.value.map(alert => ({
      时间: formatDate(alert.timestamp),
      警报类型: alert.type,
      严重程度: severityMap[alert.severity].label,
      状态: statusMap[alert.status].label,
      描述: alert.description
    }))
    if (!payload.length) {
      notify.info('暂无可导出的警报数据')
      return
    }
    const csv = convertToCSV(payload)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    saveAs(blob, `alert-history-${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`)
    notify.success('导出成功')
  } catch (error) {
    notify.error('导出失败')
    console.error(error)
  }
}

const convertToCSV = (objArray) => {
  const array = Array.isArray(objArray) ? objArray : JSON.parse(objArray)
  if (!array.length) return ''
  const headers = Object.keys(array[0]).join(',') + '\n'
  const rows = array.map(obj => Object.values(obj).map(value => `"${value}"`).join(',')).join('\n')
  return headers + rows
}

const viewAlertDetails = (alert) => {
  selectedAlert.value = alert
  dialogVisible.value = true
}

const handleUpdateAlertStatus = async (alert) => {
  try {
    const confirmation = await notify.confirm('确定要更新此警报的状态吗？', '更新警报')
    if (!confirmation) return
    const newStatus = alert.status === 'open' ? 'acknowledged' : 'resolved'
    const index = alertData.value.findIndex(a => a.id === alert.id)
    if (index !== -1) {
      alertData.value[index] = { ...alertData.value[index], status: newStatus }
      notify.success('状态更新成功')
    }
  } catch (error) {
    notify.error('状态更新失败')
    console.error(error)
  }
}

const fetchAlertData = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    alertData.value = mockAlerts
  } catch (error) {
    notify.error('获取警报数据失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

watch(
  () => JSON.stringify(filters.value),
  () => {
    pagination.value.currentPage = 1
  }
)

watch(
  () => pagination.value.pageSize,
  () => {
    pagination.value.currentPage = 1
  }
)

onMounted(() => {
  fetchAlertData()
})
</script>

<style scoped>
.alert-history {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.filter-panel {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

.filter-grid.secondary {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.filter-label {
  font-size: 0.8rem;
  color: var(--text-2);
}

.table-panel {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.table-header p {
  color: var(--text-2);
  margin-top: 0.35rem;
}

.table-wrapper {
  overflow-x: auto;
}

th.sortable {
  cursor: pointer;
}

th.sortable i {
  margin-left: 0.4rem;
  color: var(--text-3);
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  border: 1px solid transparent;
}

.badge-cpu {
  background: rgba(239, 68, 68, 0.16);
  color: #fecaca;
  border-color: rgba(239, 68, 68, 0.4);
}

.badge-memory {
  background: rgba(245, 158, 11, 0.16);
  color: #fde68a;
  border-color: rgba(245, 158, 11, 0.4);
}

.badge-disk {
  background: rgba(56, 189, 248, 0.16);
  color: #bae6fd;
  border-color: rgba(56, 189, 248, 0.4);
}

.badge-network {
  background: rgba(34, 197, 94, 0.16);
  color: #bbf7d0;
  border-color: rgba(34, 197, 94, 0.4);
}

.badge-critical {
  background: rgba(239, 68, 68, 0.16);
  color: #fecaca;
  border-color: rgba(239, 68, 68, 0.4);
}

.badge-high {
  background: rgba(245, 158, 11, 0.16);
  color: #fde68a;
  border-color: rgba(245, 158, 11, 0.4);
}

.badge-medium {
  background: rgba(56, 189, 248, 0.16);
  color: #bae6fd;
  border-color: rgba(56, 189, 248, 0.4);
}

.badge-low {
  background: rgba(34, 197, 94, 0.16);
  color: #bbf7d0;
  border-color: rgba(34, 197, 94, 0.4);
}

.badge-open {
  background: rgba(148, 163, 184, 0.16);
  color: var(--text-2);
  border-color: rgba(148, 163, 184, 0.4);
}

.badge-acknowledged {
  background: rgba(56, 189, 248, 0.16);
  color: #bae6fd;
  border-color: rgba(56, 189, 248, 0.4);
}

.badge-resolved {
  background: rgba(34, 197, 94, 0.16);
  color: #bbf7d0;
  border-color: rgba(34, 197, 94, 0.4);
}

.row-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.truncate {
  max-width: 320px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.state-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 2rem 0;
  color: var(--text-2);
}

.state-block.empty {
  color: var(--text-3);
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(34, 211, 238, 0.4);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.pagination-size {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--text-2);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.page-numbers {
  display: flex;
  gap: 0.4rem;
}

.page-number {
  border: 1px solid var(--border);
  background: rgba(148, 163, 184, 0.12);
  color: var(--text-1);
  border-radius: 10px;
  padding: 0.3rem 0.6rem;
  cursor: pointer;
}

.page-number.active {
  background: rgba(34, 211, 238, 0.2);
  border-color: rgba(34, 211, 238, 0.4);
  color: var(--text-0);
}

.detail-block {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  color: var(--text-1);
}

.detail-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1100px) {
  .filter-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .filter-grid,
  .filter-grid.secondary {
    grid-template-columns: 1fr;
  }
}
</style>
