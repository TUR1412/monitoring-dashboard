<template>
  <div class="alert-history fade-in">
    <header class="history-header">
      <div>
        <h2 class="page-title">历史警报</h2>
        <p class="subtitle">支持多维筛选、导出与状态复盘。</p>
      </div>
      <div class="header-actions">
        <span class="stat-chip">
          <AppIcon name="history" className="inline-icon" />
          共 {{ filteredAlerts.length }} 条
        </span>
        <BaseButton type="primary" @click="refreshData" title="刷新数据">
          <AppIcon name="refresh" className="inline-icon" />
          刷新数据
        </BaseButton>
        <BaseButton type="default" @click="exportAlerts" title="导出数据">
          <AppIcon name="export" className="inline-icon" />
          导出数据
        </BaseButton>
      </div>
    </header>

    <div class="card filter-card">
      <div class="filter-grid">
        <div class="filter-group">
          <label>日期范围</label>
          <select v-model="filters.dateRange">
            <option
              v-for="option in filterConfig.dateRange.options"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label>严重程度</label>
          <select v-model="filters.severity">
            <option
              v-for="option in filterConfig.severity.options"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label>状态</label>
          <select v-model="filters.status">
            <option
              v-for="option in filterConfig.status.options"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label>警报类型</label>
          <select v-model="filters.alertType">
            <option
              v-for="option in filterConfig.alertType.options"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>

      <div v-if="filters.dateRange === 'custom'" class="filter-grid custom-range">
        <div class="filter-group">
          <label>开始日期</label>
          <input
            v-model="filters.startDate"
            type="datetime-local"
            :max="filters.endDate || undefined"
          />
        </div>
        <div class="filter-group">
          <label>结束日期</label>
          <input
            v-model="filters.endDate"
            type="datetime-local"
            :min="filters.startDate || undefined"
          />
        </div>
      </div>
    </div>

    <div class="card table-card">
      <div class="overflow-x-auto">
        <table class="history-table">
          <thead>
            <tr>
              <th
                v-for="header in tableHeaders"
                :key="header.key"
                @click="header.sortable && sortBy(header.key)"
                :class="{ sortable: header.sortable, active: sortKey === header.key }"
              >
                <div class="th-cell">
                  <span>{{ header.label }}</span>
                  <span v-if="header.sortable" class="sort-icon" aria-hidden="true">
                    <AppIcon
                      name="sort"
                      :className="[
                        'sort-symbol',
                        {
                          active: sortKey === header.key,
                          desc: sortOrder === 'desc' && sortKey === header.key
                        }
                      ]"
                    />
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td :colspan="tableHeaders.length" class="state-cell">
                <AppIcon name="refresh" className="spin" />
                <span>加载中...</span>
              </td>
            </tr>
            <tr v-else-if="displayedAlerts.length === 0">
              <td :colspan="tableHeaders.length" class="state-cell">
                暂无数据
              </td>
            </tr>
            <tr v-else v-for="alert in displayedAlerts" :key="alert.id">
              <td>{{ formatTimestamp(alert.timestamp) }}</td>
              <td>
                <span class="status-badge" :class="`type-${alertTypeKey(alert.type)}`">
                  {{ alert.type }}
                </span>
              </td>
              <td>
                <span class="status-badge" :style="{ color: severityMap[alert.severity]?.color }">
                  {{ severityMap[alert.severity]?.label || alert.severity }}
                </span>
              </td>
              <td>
                <span class="status-badge" :style="{ color: statusMap[alert.status]?.color }">
                  {{ statusMap[alert.status]?.label || alert.status }}
                </span>
              </td>
              <td>
                <div class="desc-cell" :title="alert.description">
                  {{ alert.description }}
                </div>
              </td>
              <td>
                <div class="table-actions">
                  <BaseButton type="default" size="small" @click="viewAlertDetails(alert)" title="查看详情">
                    查看
                  </BaseButton>
                  <BaseButton
                    type="default"
                    size="small"
                    @click="handleUpdateAlertStatus(alert)"
                    :disabled="alert.status === 'resolved'"
                    :title="alert.status === 'open' ? '确认警报' : '解决警报'"
                  >
                    {{ alert.status === 'open' ? '确认' : '解决' }}
                  </BaseButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination-row">
        <div class="page-size">
          <span>每页显示</span>
          <select v-model.number="pagination.pageSize" @change="handleSizeChange(pagination.pageSize)">
            <option v-for="size in [10, 20, 50]" :key="size" :value="size">{{ size }}</option>
          </select>
          <span>条</span>
        </div>

        <div class="page-controls">
          <span class="page-total">共 {{ filteredAlerts.length }} 条</span>
          <BaseButton
            type="default"
            size="small"
            :disabled="pagination.currentPage <= 1"
            @click="handleCurrentChange(pagination.currentPage - 1)"
          >
            上一页
          </BaseButton>
          <span class="page-indicator">{{ pagination.currentPage }} / {{ totalPages }}</span>
          <BaseButton
            type="default"
            size="small"
            :disabled="pagination.currentPage >= totalPages"
            @click="handleCurrentChange(pagination.currentPage + 1)"
          >
            下一页
          </BaseButton>
        </div>
      </div>
    </div>

    <BaseModal v-model="dialogVisible" :title="dialogTitle" width="560px">
      <pre class="dialog-pre">{{ dialogMessage }}</pre>
      <template #footer>
        <BaseButton type="default" @click="dialogVisible = false">关闭</BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useUiStore } from '@/stores/ui'
import { formatDateTime } from '@/utils/datetime'
import { statusMap, severityMap } from '@/utils/statusMap'
import { buildCsvFromObjects, downloadCsv } from '@/utils/csv'
import { buildFileStamp } from '@/utils/filename'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import AppIcon from '@/components/base/AppIcon.vue'

const uiStore = useUiStore()

const alertData = ref([])
const sortKey = ref('timestamp')
const sortOrder = ref('desc')
const loading = ref(false)

const dialogVisible = ref(false)
const dialogTitle = ref('')
const dialogMessage = ref('')

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

const filterConfig = {
  dateRange: {
    label: '日期范围',
    options: [
      { value: '24h', label: '最近24小时' },
      { value: '7d', label: '最近7天' },
      { value: '30d', label: '最近30天' },
      { value: 'custom', label: '自定义范围' }
    ]
  },
  severity: {
    label: '严重程度',
    options: [
      { value: 'all', label: '全部' },
      { value: 'critical', label: '严重' },
      { value: 'high', label: '高' },
      { value: 'medium', label: '中' },
      { value: 'low', label: '低' }
    ]
  },
  status: {
    label: '状态',
    options: [
      { value: 'all', label: '全部' },
      { value: 'resolved', label: '已解决' },
      { value: 'acknowledged', label: '已确认' },
      { value: 'open', label: '未解决' }
    ]
  },
  alertType: {
    label: '警报类型',
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
    timestamp: '2025-12-20T10:15:30Z',
    type: 'CPU相关',
    severity: 'critical',
    status: 'open',
    description: 'CPU 使用率超过 90%'
  },
  {
    id: 2,
    timestamp: '2025-12-19T14:20:10Z',
    type: '内存相关',
    severity: 'high',
    status: 'acknowledged',
    description: '内存使用率超过 80%'
  },
  {
    id: 3,
    timestamp: '2025-12-18T08:05:45Z',
    type: '磁盘相关',
    severity: 'medium',
    status: 'resolved',
    description: '磁盘使用率超过 70%'
  },
  {
    id: 4,
    timestamp: '2025-12-17T09:30:00Z',
    type: '网络相关',
    severity: 'low',
    status: 'open',
    description: '网络延迟超过 100ms'
  }
]

const alertTypeKey = (typeLabel) => {
  const text = String(typeLabel || '').toLowerCase()
  if (text.includes('cpu')) return 'cpu'
  if (text.includes('内存') || text.includes('memory')) return 'memory'
  if (text.includes('磁盘') || text.includes('disk')) return 'disk'
  if (text.includes('网络') || text.includes('network')) return 'network'
  return 'other'
}

const getMockDateRange = (range) => {
  const now = new Date()
  let startDate
  let endDate
  switch (range) {
    case '24h':
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      endDate = now
      break
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      endDate = now
      break
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      endDate = now
      break
    default:
      startDate = now
      endDate = now
  }
  return { startDate, endDate }
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
    result = result.filter(alert => alertTypeKey(alert.type) === filters.value.alertType)
  }

  if (filters.value.dateRange === 'custom' && filters.value.startDate && filters.value.endDate) {
    const start = new Date(filters.value.startDate)
    const end = new Date(filters.value.endDate)
    result = result.filter(alert => {
      const date = new Date(alert.timestamp)
      return date >= start && date <= end
    })
  } else {
    const dateRange = getMockDateRange(filters.value.dateRange)
    const start = new Date(dateRange.startDate)
    const end = new Date(dateRange.endDate)
    result = result.filter(alert => {
      const date = new Date(alert.timestamp)
      return date >= start && date <= end
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
    } else {
      aValue = String(aValue).toLowerCase()
      bValue = String(bValue).toLowerCase()
    }

    if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1
    if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })
})

const totalPages = computed(() => {
  const size = pagination.value.pageSize || 10
  const total = filteredAlerts.value.length
  return Math.max(1, Math.ceil(total / size))
})

const displayedAlerts = computed(() => {
  const start = (pagination.value.currentPage - 1) * pagination.value.pageSize
  const end = start + pagination.value.pageSize
  return sortedAlerts.value.slice(start, end)
})

const formatTimestamp = (dateStr) => formatDateTime(dateStr)

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

const refreshData = async () => {
  await fetchAlertData()
}

const exportAlerts = () => {
  try {
    const dataToExport = sortedAlerts.value.map(alert => ({
      时间: formatTimestamp(alert.timestamp),
      警报类型: alert.type,
      严重程度: severityMap[alert.severity]?.label || alert.severity,
      状态: statusMap[alert.status]?.label || alert.status,
      描述: alert.description
    }))
    const csvContent = buildCsvFromObjects(dataToExport)
    downloadCsv(csvContent, `警报记录_${buildFileStamp()}.csv`)
    uiStore.pushToast({ type: 'success', message: '导出成功' })
  } catch (error) {
    uiStore.pushToast({ type: 'error', message: '导出失败' })
    console.error(error)
  }
}

const viewAlertDetails = (alert) => {
  dialogTitle.value = '警报详情'
  dialogMessage.value = [
    `时间: ${formatTimestamp(alert.timestamp)}`,
    `类型: ${alert.type}`,
    `严重程度: ${severityMap[alert.severity]?.label || alert.severity}`,
    `状态: ${statusMap[alert.status]?.label || alert.status}`,
    `描述: ${alert.description}`
  ].join('\n')
  dialogVisible.value = true
}

const handleUpdateAlertStatus = async (alert) => {
  const confirmed = await uiStore.requestConfirm('确定要更新此警报的状态吗？', '确认')
  if (!confirmed) return

  const newStatus = alert.status === 'open' ? 'acknowledged' : 'resolved'
  const index = alertData.value.findIndex(a => a.id === alert.id)
  if (index !== -1) {
    alertData.value = [
      ...alertData.value.slice(0, index),
      { ...alertData.value[index], status: newStatus },
      ...alertData.value.slice(index + 1)
    ]
    uiStore.pushToast({ type: 'success', message: '状态更新成功' })
  }
}

const handleSizeChange = (newSize) => {
  pagination.value.pageSize = Number(newSize) || 10
  pagination.value.currentPage = 1
}

const handleCurrentChange = (newPage) => {
  const next = Number(newPage) || 1
  pagination.value.currentPage = Math.max(1, Math.min(next, totalPages.value))
}

const fetchAlertData = async () => {
  loading.value = true
  try {
    alertData.value = mockAlerts
  } catch (error) {
    uiStore.pushToast({ type: 'error', message: '获取警报数据失败' })
    console.error(error)
  } finally {
    loading.value = false
  }
}

watch(
  () => filters.value,
  () => {
    pagination.value.currentPage = 1
  },
  { deep: true }
)

watch(
  () => pagination.value.pageSize,
  () => {
    pagination.value.currentPage = 1
  }
)

watch(totalPages, (pages) => {
  if (pagination.value.currentPage > pages) {
    pagination.value.currentPage = pages
  }
})

onMounted(() => {
  fetchAlertData()
})
</script>

<style scoped>
.alert-history {
  padding: var(--container-padding);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.history-header {
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

.filter-card {
  background: rgba(15, 23, 42, 0.28);
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.custom-range {
  margin-top: 1rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.table-card {
  background: rgba(15, 23, 42, 0.28);
}

.history-table th.sortable {
  cursor: pointer;
  user-select: none;
}

.history-table th.active {
  color: var(--text-strong);
}

.th-cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.sort-icon i {
  opacity: 0.55;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.sort-symbol {
  opacity: 0.55;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.sort-symbol.active {
  opacity: 1;
}

.sort-symbol.desc {
  transform: rotate(180deg);
}

.state-cell {
  text-align: center;
  padding: 1.25rem 0.75rem;
  color: var(--text-muted);
}

.desc-cell {
  max-width: 420px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.table-actions {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.pagination-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.page-size {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-muted);
  font-size: 0.85rem;
}

.page-controls {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.page-total {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.page-indicator {
  color: var(--text-muted);
  font-size: 0.85rem;
  min-width: 84px;
  text-align: center;
}

.dialog-pre {
  margin: 0;
  white-space: pre-wrap;
  color: var(--text-color);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.9rem;
}

.inline-icon {
  margin-right: 0.5rem;
}

.spin {
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.status-badge {
  font-size: 0.85rem;
  font-weight: 600;
}
</style>
