<!-- src/components/alerts/AlertHistory.vue -->
<template>
  <div class="alert-history fade-in">
    <header class="history-header">
      <div>
        <h2 class="page-title">历史警报</h2>
        <p class="subtitle">支持多维筛选、导出与状态复盘。</p>
      </div>
      <div class="header-actions">
        <span class="stat-chip">
          <i class="fas fa-history"></i>
          共 {{ filteredAlerts.length }} 条
        </span>
        <el-tooltip content="刷新数据" placement="top">
          <BaseButton type="primary" @click="refreshData">
            <i class="fas fa-rotate"></i>
            刷新数据
          </BaseButton>
        </el-tooltip>
        <el-tooltip content="导出数据" placement="top">
          <BaseButton type="default" @click="exportAlerts">
            <i class="fas fa-file-export"></i>
            导出数据
          </BaseButton>
        </el-tooltip>
      </div>
    </header>

    <div class="card filter-card">
      <div class="filter-grid">
        <div class="filter-group">
          <label>日期范围</label>
          <el-select v-model="filters.dateRange" class="w-full" size="large">
            <el-option
              v-for="option in filterConfig.dateRange.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </div>

        <div class="filter-group">
          <label>严重程度</label>
          <el-select v-model="filters.severity" class="w-full" size="large">
            <el-option
              v-for="option in filterConfig.severity.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </div>

        <div class="filter-group">
          <label>状态</label>
          <el-select v-model="filters.status" class="w-full" size="large">
            <el-option
              v-for="option in filterConfig.status.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </div>

        <div class="filter-group">
          <label>警报类型</label>
          <el-select v-model="filters.alertType" class="w-full" size="large">
            <el-option
              v-for="option in filterConfig.alertType.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </div>
      </div>

      <div
        v-if="filters.dateRange === 'custom'"
        class="filter-grid custom-range"
      >
        <div class="filter-group">
          <label>开始日期</label>
          <el-date-picker
            v-model="filters.startDate"
            type="datetime"
            placeholder="选择开始日期时间"
            class="w-full"
            size="large"
            :clearable="false"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </div>
        <div class="filter-group">
          <label>结束日期</label>
          <el-date-picker
            v-model="filters.endDate"
            type="datetime"
            placeholder="选择结束日期时间"
            class="w-full"
            size="large"
            :clearable="false"
            value-format="yyyy-MM-dd HH:mm:ss"
            :disabled-date="disabledEndDate"
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
                  <span v-if="header.sortable" class="sort-icon">
                    <i
                      class="fas fa-sort"
                      :class="{
                        active: sortKey === header.key,
                        desc: sortOrder === 'desc' && sortKey === header.key
                      }"
                    ></i>
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td :colspan="tableHeaders.length" class="state-cell">
                <i class="fas fa-spinner fa-spin"></i>
                <span>加载中...</span>
              </td>
            </tr>
            <tr v-else-if="displayedAlerts.length === 0">
              <td :colspan="tableHeaders.length" class="state-cell">
                暂无数据
              </td>
            </tr>
            <tr v-else v-for="alert in displayedAlerts" :key="alert.id">
              <td>{{ formatDate(alert.timestamp) }}</td>
              <td>
                <span class="status-badge" :class="`type-${alert.type.toLowerCase()}`">
                  {{ alert.type }}
                </span>
              </td>
              <td>
                <span class="status-badge" :style="{ color: severityMap[alert.severity].color }">
                  {{ severityMap[alert.severity].label }}
                </span>
              </td>
              <td>
                <span class="status-badge" :style="{ color: statusMap[alert.status].color }">
                  {{ statusMap[alert.status].label }}
                </span>
              </td>
              <td>
                <div class="desc-cell" :title="alert.description">
                  {{ alert.description }}
                </div>
              </td>
              <td>
                <div class="table-actions">
                  <el-tooltip content="查看详情" placement="top">
                    <BaseButton type="default" size="small" @click="viewAlertDetails(alert)">
                      查看
                    </BaseButton>
                  </el-tooltip>
                  <el-tooltip
                    :content="alert.status === 'open' ? '确认警报' : '解决警报'"
                    placement="top"
                  >
                    <BaseButton
                      type="default"
                      size="small"
                      @click="handleUpdateAlertStatus(alert)"
                      :disabled="alert.status === 'resolved'"
                    >
                      {{ alert.status === 'open' ? '确认' : '解决' }}
                    </BaseButton>
                  </el-tooltip>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination-row">
        <div class="page-size">
          <span>每页显示</span>
          <el-select v-model="pagination.pageSize" class="w-20" size="small">
            <el-option v-for="size in [10, 20, 50]" :key="size" :label="size" :value="size" />
          </el-select>
          <span>条</span>
        </div>

        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :total="filteredAlerts.length"
          :page-sizes="[10, 20, 50]"
          layout="total, prev, pager, next"
          class="pagination-custom"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="30%" destroy-on-close>
      <span>{{ dialogMessage }}</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleDialogConfirm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { notify } from '@/utils/notify'
import { ElLoading } from 'element-plus'
import BaseButton from '@/components/base/BaseButton.vue'

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
  pageSize: 10,
  total: 0
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
    timestamp: '2025-12-19T08:20:00Z',
    type: '内存相关',
    severity: 'high',
    status: 'acknowledged',
    description: '内存使用率超过 80%'
  },
  {
    id: 3,
    timestamp: '2025-12-18T14:45:10Z',
    type: '磁盘相关',
    severity: 'medium',
    status: 'resolved',
    description: '磁盘空间不足 10%'
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

const filteredAlerts = computed(() => {
  let result = [...alertData.value]

  if (filters.value.severity !== 'all') {
    result = result.filter(alert => alert.severity === filters.value.severity)
  }
  if (filters.value.status !== 'all') {
    result = result.filter(alert => alert.status === filters.value.status)
  }
  if (filters.value.alertType !== 'all') {
    result = result.filter(alert => alert.type.toLowerCase().includes(filters.value.alertType))
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
      aValue = aValue.toString().toLowerCase()
      bValue = bValue.toString().toLowerCase()
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

const disabledEndDate = (time) => {
  if (!filters.value.startDate) return false
  return time.getTime() < new Date(filters.value.startDate).getTime()
}

const statusMap = {
  open: { label: '未解决', color: 'var(--neon-red)' },
  acknowledged: { label: '已确认', color: 'var(--neon-blue)' },
  resolved: { label: '已解决', color: 'var(--neon-green)' }
}

const severityMap = {
  critical: { label: '严重', color: 'var(--neon-red)' },
  high: { label: '高', color: 'var(--neon-yellow)' },
  medium: { label: '中', color: 'var(--neon-blue)' },
  low: { label: '低', color: 'var(--neon-green)' }
}

const formatDate = (dateStr) => {
  return format(new Date(dateStr), 'yyyy年MM月dd日 HH:mm:ss', { locale: zhCN })
}

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

const exportAlerts = async () => {
  try {
    const dataToExport = sortedAlerts.value.map(alert => ({
      时间: formatDate(alert.timestamp),
      警报类型: alert.type,
      严重程度: severityMap[alert.severity].label,
      状态: statusMap[alert.status].label,
      描述: alert.description
    }))
    const csvContent = convertToCSV(dataToExport)
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const filename = `警报记录_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    notify.success('导出成功')
  } catch (error) {
    notify.error('导出失败')
    console.error(error)
  }
}

const convertToCSV = (objArray) => {
  const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray
  let str = ''
  const headers = Object.keys(array[0]).join(',') + '\n'
  str += headers

  array.forEach(obj => {
    let line = ''
    for (const index in obj) {
      if (line !== '') line += ','
      line += `"${obj[index]}"`
    }
    str += line + '\n'
  })

  return str
}

const viewAlertDetails = (alert) => {
  dialogTitle.value = '警报详情'
  dialogMessage.value = `
    时间: ${formatDate(alert.timestamp)}\n
    类型: ${alert.type}\n
    严重程度: ${severityMap[alert.severity].label}\n
    状态: ${statusMap[alert.status].label}\n
    描述: ${alert.description}
  `
  dialogVisible.value = true
}

const handleUpdateAlertStatus = async (alert) => {
  try {
    const confirmation = await notify.confirm('确定要更新此警报的状态吗？')
    if (!confirmation) return

    const newStatus = alert.status === 'open' ? 'acknowledged' : 'resolved'
    const index = alertData.value.findIndex(a => a.id === alert.id)
    if (index !== -1) {
      alertData.value[index].status = newStatus
      notify.success('状态更新成功')
    }
  } catch (error) {
    if (error !== 'cancel') {
      notify.error('状态更新失败')
      console.error(error)
    }
  }
}

const handleSizeChange = (newSize) => {
  pagination.value.pageSize = newSize
  pagination.value.currentPage = 1
}

const handleCurrentChange = (newPage) => {
  pagination.value.currentPage = newPage
}

const handleDialogConfirm = () => {
  dialogVisible.value = false
}

const fetchAlertData = async () => {
  loading.value = true
  const loadingInstance = ElLoading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })

  try {
    alertData.value = mockAlerts
    pagination.value.total = mockAlerts.length
  } catch (error) {
    notify.error('获取警报数据失败')
    console.error(error)
  } finally {
    loading.value = false
    loadingInstance.close()
  }
}

watch(
  [
    () => JSON.stringify(filters.value),
    () => pagination.value.pageSize,
    () => pagination.value.currentPage,
    () => sortKey.value,
    () => sortOrder.value
  ],
  () => {
    fetchAlertData()
  }
)

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
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.table-card {
  background: rgba(15, 23, 42, 0.28);
}

.history-table {
  width: 100%;
}

th.sortable {
  cursor: pointer;
}

th.active {
  background: rgba(46, 196, 182, 0.18);
}

.th-cell {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.sort-icon i {
  font-size: 0.75rem;
  color: var(--text-muted);
  transition: transform 0.2s ease;
}

.sort-icon i.active {
  color: var(--neon-blue);
}

.sort-icon i.desc {
  transform: rotate(180deg);
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.status-badge.type-cpu {
  color: var(--neon-red);
  background: rgba(231, 111, 81, 0.12);
}

.status-badge.type-memory {
  color: var(--neon-yellow);
  background: rgba(246, 189, 96, 0.12);
}

.status-badge.type-disk {
  color: var(--neon-blue);
  background: rgba(46, 196, 182, 0.12);
}

.status-badge.type-network {
  color: var(--neon-green);
  background: rgba(6, 214, 160, 0.12);
}

.desc-cell {
  max-width: 420px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--text-muted);
}

.table-actions {
  display: flex;
  gap: 0.6rem;
}

.state-cell {
  text-align: center;
  color: var(--text-muted);
  padding: 2rem 0;
}

.pagination-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.page-size {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
