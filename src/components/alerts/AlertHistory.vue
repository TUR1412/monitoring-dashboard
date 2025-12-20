<!-- src/components/AlertHistory.vue -->
<template>
  <div class="alert-history">
    <!-- 顶部区域 -->
    <header class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold text-gradient">历史警报</h2>
      <div class="flex gap-4">
        <el-tooltip content="刷新数据" placement="top">
          <button @click="refreshData" class="button-neon px-4 py-2">
            <i class="el-icon-refresh mr-1"></i>
            刷新数据
          </button>
        </el-tooltip>
        <el-tooltip content="导出数据" placement="top">
          <button @click="exportAlerts" class="button-neon px-4 py-2">
            <i class="el-icon-download mr-1"></i>
            导出数据
          </button>
        </el-tooltip>
      </div>
    </header>

    <!-- 筛选器区域 -->
    <div class="card mb-6 bg-gray-800/30 rounded-lg shadow-lg">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
        <!-- 日期范围筛选 -->
        <div class="filter-group">
          <label class="label text-gray-300 mb-2">日期范围</label>
          <el-select 
            v-model="filters.dateRange" 
            class="w-full"
            size="large"
          >
            <el-option
              v-for="option in filterConfig.dateRange.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </div>

        <!-- 严重程度筛选 -->
        <div class="filter-group">
          <label class="label text-gray-300 mb-2">严重程度</label>
          <el-select 
            v-model="filters.severity" 
            class="w-full"
            size="large"
          >
            <el-option
              v-for="option in filterConfig.severity.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </div>

        <!-- 状态筛选 -->
        <div class="filter-group">
          <label class="label text-gray-300 mb-2">状态</label>
          <el-select 
            v-model="filters.status" 
            class="w-full"
            size="large"
          >
            <el-option
              v-for="option in filterConfig.status.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </div>

        <!-- 警报类型筛选 -->
        <div class="filter-group">
          <label class="label text-gray-300 mb-2">警报类型</label>
          <el-select 
            v-model="filters.alertType" 
            class="w-full"
            size="large"
          >
            <el-option
              v-for="option in filterConfig.alertType.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </div>
      </div>

      <!-- 自定义日期范围选择器 -->
      <div 
        v-if="filters.dateRange === 'custom'" 
        class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border-t border-gray-700"
      >
        <div class="filter-group">
          <label class="label text-gray-300 mb-2">开始日期</label>
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
          <label class="label text-gray-300 mb-2">结束日期</label>
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

    <!-- 数据表格区域 -->
    <div class="card bg-gray-800/30 rounded-lg shadow-lg">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[800px]">
          <thead>
            <tr class="border-b border-gray-700">
              <th 
                v-for="header in tableHeaders" 
                :key="header.key"
                @click="header.sortable && sortBy(header.key)"
                class="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700/50"
                :class="{ 
                  'cursor-pointer hover:bg-gray-700': header.sortable,
                  'bg-gray-700/30': sortKey === header.key
                }"
              >
                <div class="flex items-center space-x-1">
                  <span>{{ header.label }}</span>
                  <span v-if="header.sortable" class="text-gray-400">
                    <i 
                      class="el-icon-sort"
                      :class="{
                        'text-blue-400': sortKey === header.key,
                        'transform rotate-180': sortOrder === 'desc' && sortKey === header.key
                      }"
                    ></i>
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            <template v-if="loading">
              <tr>
                <td 
                  :colspan="tableHeaders.length" 
                  class="px-6 py-4 text-center text-gray-400"
                >
                  <el-spinner size="medium" />
                  <span class="ml-2">加载中...</span>
                </td>
              </tr>
            </template>
            <template v-else-if="displayedAlerts.length === 0">
              <tr>
                <td 
                  :colspan="tableHeaders.length" 
                  class="px-6 py-4 text-center text-gray-400"
                >
                  暂无数据
                </td>
              </tr>
            </template>
            <template v-else>
              <tr 
                v-for="alert in displayedAlerts" 
                :key="alert.id" 
                class="hover:bg-gray-700/30 transition-colors"
              >
                <!-- 时间 -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {{ formatDate(alert.timestamp) }}
                </td>
                
                <!-- 警报类型 -->
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span :class="['status-badge', `type-${alert.type.toLowerCase()}`]">
                    {{ alert.type }}
                  </span>
                </td>
                
                <!-- 严重程度 -->
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span 
                    class="status-badge"
                    :style="{ color: severityMap[alert.severity].color }"
                  >
                    {{ severityMap[alert.severity].label }}
                  </span>
                </td>
                
                <!-- 状态 -->
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span 
                    class="status-badge"
                    :style="{ color: statusMap[alert.status].color }"
                  >
                    {{ statusMap[alert.status].label }}
                  </span>
                </td>
                
                <!-- 描述 -->
                <td class="px-6 py-4 text-sm text-gray-300">
                  <div class="max-w-lg truncate" :title="alert.description">
                    {{ alert.description }}
                  </div>
                </td>
                
                <!-- 操作 -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <div class="flex space-x-3">
                    <el-tooltip content="查看详情" placement="top">
                      <button 
                        @click="viewAlertDetails(alert)"
                        class="button-neon px-3 py-1 text-sm"
                      >
                        查看
                      </button>
                    </el-tooltip>
                    <el-tooltip 
                      :content="alert.status === 'open' ? '确认警报' : '解决警报'"
                      placement="top"
                    >
                      <button 
                        @click="handleUpdateAlertStatus(alert)"
                        class="button-neon px-3 py-1 text-sm"
                        :disabled="alert.status === 'resolved'"
                      >
                        {{ alert.status === 'open' ? '确认' : '解决' }}
                      </button>
                    </el-tooltip>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- 分页区域 -->
      <div class="flex items-center justify-between p-4 border-t border-gray-700">
        <div class="flex items-center space-x-2 text-gray-300">
          <span class="text-sm">每页显示</span>
          <el-select 
            v-model="pagination.pageSize" 
            class="w-20"
            size="small"
          >
            <el-option
              v-for="size in [10, 20, 50]"
              :key="size"
              :label="size"
              :value="size"
            />
          </el-select>
          <span class="text-sm">条</span>
        </div>
        
        <div class="flex items-center space-x-4">
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
    </div>

    <!-- 确认对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="30%"
      destroy-on-close
    >
      <span>{{ dialogMessage }}</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleDialogConfirm">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
// import { alertService, alertUtils } from '@/api/alertService' // 注释掉实际的服务调用
import { notify } from '@/utils/notify'
// import { statusMap, severityMap } from '@/utils/statusMap' // 保留这些工具
import { ElLoading } from 'element-plus'

// Router for navigation
const router = useRouter()

// Reactive references
const alertData = ref([])
const sortKey = ref('timestamp')
const sortOrder = ref('desc')
const loading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('')
const dialogMessage = ref('')

// 表格头部配置
const tableHeaders = [
  { key: 'timestamp', label: '时间', sortable: true },
  { key: 'type', label: '警报类型', sortable: true },
  { key: 'severity', label: '严重程度', sortable: true },
  { key: 'status', label: '状态', sortable: true },
  { key: 'description', label: '描述', sortable: false },
  { key: 'actions', label: '操作', sortable: false }
]

// 过滤和分页状态
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

// 配置对象
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

// 模拟警报数据
const mockAlerts = [
  {
    id: 1,
    timestamp: '2024-12-24T10:15:30Z',
    type: 'CPU相关',
    severity: 'critical',
    status: 'open',
    description: 'CPU 使用率超过 90%'
  },
  {
    id: 2,
    timestamp: '2024-12-23T08:20:00Z',
    type: '内存相关',
    severity: 'high',
    status: 'acknowledged',
    description: '内存使用率超过 80%'
  },
  {
    id: 3,
    timestamp: '2024-12-22T14:45:10Z',
    type: '磁盘相关',
    severity: 'medium',
    status: 'resolved',
    description: '磁盘空间不足 10%'
  },
  {
    id: 4,
    timestamp: '2024-12-21T09:30:00Z',
    type: '网络相关',
    severity: 'low',
    status: 'open',
    description: '网络延迟超过 100ms'
  },
  // 你可以根据需要添加更多的模拟数据
]

// 计算属性
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

  // 日期过滤
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

    // If sorting by timestamp, convert to Date objects
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

// 模拟获取日期范围
const getMockDateRange = (range) => {
  const now = new Date()
  let startDate, endDate
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

// 禁用结束日期选择器中小于开始日期的日期
const disabledEndDate = (time) => {
  if (!filters.value.startDate) return false
  return time.getTime() < new Date(filters.value.startDate).getTime()
}

// 状态和严重程度映射
const statusMap = {
  open: { label: '未解决', color: '#FF5722' },
  acknowledged: { label: '已确认', color: '#2196F3' },
  resolved: { label: '已解决', color: '#4CAF50' }
}

const severityMap = {
  critical: { label: '严重', color: '#F44336' },
  high: { label: '高', color: '#FF9800' },
  medium: { label: '中', color: '#2196F3' },
  low: { label: '低', color: '#4CAF50' }
}

// Methods

// 格式化日期
const formatDate = (dateStr) => {
  return format(new Date(dateStr), 'yyyy年MM月dd日 HH:mm:ss', { locale: zhCN })
}

// 排序方法
const sortBy = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

// 刷新数据
const refreshData = async () => {
  await fetchAlertData()
}

// 导出警报数据
const exportAlerts = async () => {
  try {
    // 使用模拟数据进行导出
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

// 将JSON数据转换为CSV格式
const convertToCSV = (objArray) => {
  const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray
  let str = ''
  const headers = Object.keys(array[0]).join(',') + '\n'
  str += headers

  array.forEach(obj => {
    let line = ''
    for (const index in obj) {
      if (line !== '') line += ','
      line += `"${obj[index]}"` // 添加双引号以处理逗号
    }
    str += line + '\n'
  })

  return str
}

// 查看警报详情
const viewAlertDetails = (alert) => {
  // 这里可以根据需求进行导航或显示详情
  // 例如，弹出一个对话框显示详情
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

// 更新警报状态
const handleUpdateAlertStatus = async (alert) => {
  try {
    const confirmation = await notify.confirm('确定要更新此警报的状态吗？')
    if (!confirmation) return

    const newStatus = alert.status === 'open' ? 'acknowledged' : 'resolved'
    // 模拟状态更新
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

// 处理分页大小变化
const handleSizeChange = (newSize) => {
  pagination.value.pageSize = newSize
  pagination.value.currentPage = 1
}

// 处理当前页变化
const handleCurrentChange = (newPage) => {
  pagination.value.currentPage = newPage
}

// 确认对话框的确认操作
const handleDialogConfirm = () => {
  // 关闭对话框
  dialogVisible.value = false
}

// Fetch alert data from API or use mock data
const fetchAlertData = async () => {
  loading.value = true
  const loadingInstance = ElLoading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })

  try {
    // 使用模拟数据
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

// 监听器
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

// 生命周期
onMounted(() => {
  fetchAlertData()
})
</script>

<style scoped>
.alert-history {
  @apply min-h-screen p-6;
}

/* 使用全局定义的样式类，移除重复定义 */
.filter-group {
  @apply flex flex-col;
}

.status-badge {
  @apply inline-flex items-center px-3 py-1 rounded-full text-xs font-medium;
}

/* 使用CSS变量定义的颜色 */
.status-badge.type-cpu {
  color: var(--neon-red);
}

.status-badge.type-memory {
  color: var(--neon-yellow);
}

.status-badge.type-disk {
  color: var(--neon-blue);
}

.status-badge.type-network {
  color: var(--neon-green);
}

.status-badge.status-resolved {
  color: var(--neon-green);
}

.status-badge.status-acknowledged {
  color: var(--neon-blue);
}

.status-badge.status-open {
  color: var(--gray-400);
}

/* 继承全局样式中定义的动画效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 自定义按钮样式 */
.button-neon {
  background: linear-gradient(45deg, #ff6ec4, #7873f5);
  border: none;
  color: white;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(255, 110, 196, 0.5), 0 0 10px rgba(120, 115, 245, 0.5);
  transition: all 0.3s ease;
}

.button-neon:hover {
  box-shadow: 0 0 20px rgba(255, 110, 196, 0.7), 0 0 20px rgba(120, 115, 245, 0.7);
}

.button-neon:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 对话框内容格式 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

/* 导出按钮自定义样式 */
.pagination-custom .el-pagination__total {
  color: var(--text-0);
}

.pagination-custom .el-pagination__pager li a,
.pagination-custom .el-pagination__pager li a:hover,
.pagination-custom .el-pagination__pager li a.active {
  color: var(--text-0);
  background: transparent;
}
</style>
