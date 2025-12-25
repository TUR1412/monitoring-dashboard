// src/stores/telemetry.js
// 系统资源/进程/日志/温度等遥测数据（演示数据 + 可扩展的刷新动作）。

import { defineStore } from 'pinia'
import { safeStorage } from '@/utils/storage'

const STORAGE_KEYS = {
  processes: 'monitoring-dashboard:processes'
}

const pad2 = (num) => String(num).padStart(2, '0')

const clampNumber = (value, min, max) => Math.min(max, Math.max(min, value))

const nextHourlyTime = (lastTime) => {
  const [hour, minute] = String(lastTime || '00:00').split(':').map((part) => Number(part))
  const nextHour = Number.isFinite(hour) ? (hour + 1) % 24 : 0
  const nextMinute = Number.isFinite(minute) ? minute : 0
  return `${pad2(nextHour)}:${pad2(nextMinute)}`
}

const shiftAndPushSeries = (series, { key = 'value', jitter = 6, min = 0, max = 100 } = {}) => {
  const next = Array.isArray(series) ? [...series] : []
  const last = next[next.length - 1] || { time: '00:00', [key]: min }
  const time = nextHourlyTime(last.time)
  const base = Number(last?.[key] ?? min)
  const drift = (Math.random() * 2 - 1) * jitter
  const value = Math.round(clampNumber(base + drift, min, max))
  if (next.length) next.shift()
  next.push({ ...last, time, [key]: value })
  return next
}

const buildHourlySeries = ({ points = 24, base = 40, amp = 18, phase = 0, clampMin = 0, clampMax = 100 } = {}) => {
  const twoPi = Math.PI * 2
  return Array.from({ length: points }).map((_, index) => {
    const time = `${pad2(index)}:00`
    const wave = base + amp * Math.sin((index / points) * twoPi + phase)
    const value = Math.round(Math.min(clampMax, Math.max(clampMin, wave)))
    return { time, value }
  })
}

const seedCpuUsage = () => buildHourlySeries({ base: 55, amp: 22, phase: 0.9, clampMin: 10, clampMax: 100 })
  .map((point) => ({ time: point.time, usage: point.value }))

const seedMemoryHistory = () => buildHourlySeries({ base: 2500, amp: 420, phase: 0.2, clampMin: 1500, clampMax: 3800 })

const seedTemperatureHistory = () => ({
  cpu: buildHourlySeries({ base: 52, amp: 10, phase: 0.7, clampMin: 35, clampMax: 80 }),
  system: buildHourlySeries({ base: 46, amp: 8, phase: 1.1, clampMin: 30, clampMax: 75 })
})

const seedIoStatistics = () => ({
  readOps: buildHourlySeries({ base: 5600, amp: 1200, phase: 0.5, clampMin: 2000, clampMax: 9000 }),
  writeOps: buildHourlySeries({ base: 3600, amp: 800, phase: 1.2, clampMin: 1200, clampMax: 7000 })
})

const seedProcesses = () => ([
  { pid: 101, name: 'nginx', cpu: 5, memory: 150, status: 'running' },
  { pid: 202, name: 'node', cpu: 15, memory: 300, status: 'running' },
  { pid: 303, name: 'mysql', cpu: 10, memory: 250, status: 'stopped' }
])

export const useTelemetryStore = defineStore('telemetry', {
  state: () => {
    const io = seedIoStatistics()
    const temp = seedTemperatureHistory()
    return {
      loading: false,
      error: null,
      lastUpdatedAt: null,

      // 系统资源
      cpuUsage: seedCpuUsage(),
      memoryUsage: { used: 4096, free: 2048 },
      memoryUsageHistory: seedMemoryHistory(),
      diskUsage: { usedDisk1: 500, usedDisk2: 300, usedDisk3: 200, free: 1500 },
      networkTraffic: {
        inbound: [50, 60, 55, 70, 65],
        outbound: [40, 50, 45, 60, 55],
        total: [90, 110, 100, 130, 120]
      },

      // I/O 与温度
      ioStatistics: io,
      cpuTemperatureHistory: temp.cpu,
      systemTemperatureHistory: temp.system,

      // 前端性能/错误（演示）
      frontendPerformanceData: [
        { time: '00:00', loadTime: 2.5, interactionTime: 1.2, responseTime: 0.8, renderTime: 1.5 },
        { time: '01:00', loadTime: 2.7, interactionTime: 1.3, responseTime: 0.85, renderTime: 1.6 },
        { time: '02:00', loadTime: 2.8, interactionTime: 1.4, responseTime: 0.9, renderTime: 1.7 }
      ],
      errorReports: [
        '错误: 无法从服务器获取数据。',
        '警告: 检测到高内存使用率。',
        '错误: 磁盘空间不足。',
        '信息: 系统维护计划在午夜开始。'
      ],
      userBehavior: {
        labels: ['浏览页面', '点击按钮', '提交表单', '滚动页面'],
        data: [65, 59, 80, 81]
      },

      // 日志（演示）
      logs: [
        { id: 1, level: 'info', message: '系统启动成功。', timestamp: '2024-04-27 08:00:00' },
        { id: 2, level: 'warning', message: '磁盘空间不足。', timestamp: '2024-04-27 09:30:00' }
      ],
      securityLogs: [
        { id: 1, level: 'high', source: '防火墙', message: '检测到异常登录尝试。', timestamp: '2024-04-27 10:30:00' },
        { id: 2, level: 'medium', source: '入侵检测系统', message: '发现可疑流量模式。', timestamp: '2024-04-27 11:15:00' },
        { id: 3, level: 'low', source: '安全审计', message: '定期安全扫描完成。', timestamp: '2024-04-27 09:00:00' },
        { id: 4, level: 'critical', source: '防病毒软件', message: '检测到恶意软件。', timestamp: '2024-04-27 12:45:00' }
      ],
      auditLogs: [
        { id: 1, username: 'admin', action: 'login', message: '管理员登录成功。', timestamp: '2024-04-27 08:00:00', details: { ip: '192.168.1.10', location: '办公室' } },
        { id: 2, username: 'user1', action: 'create', message: '创建了新用户。', timestamp: '2024-04-27 09:30:00', details: { userId: 4, username: 'user4' } },
        { id: 3, username: 'user2', action: 'update', message: '更新了系统设置。', timestamp: '2024-04-27 10:45:00', details: { setting: '网络配置', oldValue: 'DHCP', newValue: '静态' } }
      ],

      // 进程（持久化）
      processes: safeStorage.get(STORAGE_KEYS.processes, seedProcesses())
    }
  },
  actions: {
    hydrate() {
      const processes = safeStorage.get(STORAGE_KEYS.processes, null)
      this.processes = Array.isArray(processes) ? processes : seedProcesses()
      this.persist()
    },

    persist() {
      safeStorage.set(STORAGE_KEYS.processes, this.processes)
    },

    fetchCpuUsage() {
      this.cpuUsage = shiftAndPushSeries(this.cpuUsage, {
        key: 'usage',
        jitter: 10,
        min: 5,
        max: 100
      })
      this.lastUpdatedAt = Date.now()
    },

    fetchMemoryUsage() {
      const used = Number(this.memoryUsage?.used ?? 0)
      const free = Number(this.memoryUsage?.free ?? 0)
      const total = Math.max(1024, used + free)

      const nextUsed = clampNumber(Math.round(used + (Math.random() * 2 - 1) * 140), 256, total - 128)
      const nextFree = Math.max(0, total - nextUsed)

      this.memoryUsage = { used: nextUsed, free: nextFree }
      this.memoryUsageHistory = shiftAndPushSeries(this.memoryUsageHistory, {
        key: 'value',
        jitter: 180,
        min: 256,
        max: total
      })
      this.lastUpdatedAt = Date.now()
    },

    fetchDiskUsage() {
      const disk = this.diskUsage || {}
      const next = {
        usedDisk1: clampNumber(Math.round(Number(disk.usedDisk1 ?? 0) + (Math.random() * 2 - 1) * 10), 0, 2000),
        usedDisk2: clampNumber(Math.round(Number(disk.usedDisk2 ?? 0) + (Math.random() * 2 - 1) * 8), 0, 2000),
        usedDisk3: clampNumber(Math.round(Number(disk.usedDisk3 ?? 0) + (Math.random() * 2 - 1) * 6), 0, 2000),
        free: clampNumber(Math.round(Number(disk.free ?? 0) + (Math.random() * 2 - 1) * 12), 0, 5000)
      }
      this.diskUsage = next
      this.lastUpdatedAt = Date.now()
    },

    fetchNetworkTraffic() {
      const shiftAndPush = (arr, jitter = 12, min = 0, max = 240) => {
        const next = Array.isArray(arr) ? [...arr] : []
        const last = Number(next[next.length - 1] ?? 0)
        const value = clampNumber(Math.round(last + (Math.random() * 2 - 1) * jitter), min, max)
        if (next.length) next.shift()
        next.push(value)
        return next
      }

      const inbound = shiftAndPush(this.networkTraffic?.inbound, 14, 10, 220)
      const outbound = shiftAndPush(this.networkTraffic?.outbound, 12, 8, 200)
      const total = inbound.map((value, index) => value + Number(outbound[index] ?? 0))

      this.networkTraffic = { inbound, outbound, total }
      this.lastUpdatedAt = Date.now()
    },

    fetchFrontendPerformance() {
      const series = Array.isArray(this.frontendPerformanceData) ? [...this.frontendPerformanceData] : []
      const last = series[series.length - 1] || { time: '00:00', loadTime: 2.5, interactionTime: 1.2, responseTime: 0.8, renderTime: 1.5 }
      const time = nextHourlyTime(last.time)

      const nextEntry = {
        time,
        loadTime: Number((clampNumber(Number(last.loadTime ?? 2.5) + (Math.random() * 2 - 1) * 0.35, 0.6, 6.0)).toFixed(2)),
        interactionTime: Number((clampNumber(Number(last.interactionTime ?? 1.2) + (Math.random() * 2 - 1) * 0.22, 0.2, 3.2)).toFixed(2)),
        responseTime: Number((clampNumber(Number(last.responseTime ?? 0.8) + (Math.random() * 2 - 1) * 0.18, 0.1, 2.5)).toFixed(2)),
        renderTime: Number((clampNumber(Number(last.renderTime ?? 1.5) + (Math.random() * 2 - 1) * 0.3, 0.3, 4.2)).toFixed(2))
      }

      if (series.length) series.shift()
      series.push(nextEntry)
      this.frontendPerformanceData = series
      this.lastUpdatedAt = Date.now()
    },

    fetchLogs() {
      const now = new Date()
      const nextId = Number(this.logs?.[this.logs.length - 1]?.id ?? 0) + 1
      const messagePool = [
        '采样完成：关键指标已更新。',
        '日志聚合：检测到轻微波动。',
        '系统心跳：连接稳定。',
        '缓存刷新：配置已生效。'
      ]
      const next = {
        id: nextId,
        level: 'info',
        message: messagePool[Math.floor(Math.random() * messagePool.length)],
        timestamp: `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 8)}`
      }
      const logs = Array.isArray(this.logs) ? [...this.logs, next] : [next]
      this.logs = logs.slice(-200)
      this.lastUpdatedAt = Date.now()
    },

    fetchSecurityLogs() {
      const now = new Date()
      const nextId = Number(this.securityLogs?.[this.securityLogs.length - 1]?.id ?? 0) + 1
      const pool = [
        { level: 'low', source: '安全审计', message: '基线检查通过。' },
        { level: 'medium', source: '入侵检测系统', message: '观察到异常请求峰值。' },
        { level: 'high', source: '防火墙', message: '阻断可疑访问尝试。' }
      ]
      const pick = pool[Math.floor(Math.random() * pool.length)]
      const next = {
        id: nextId,
        ...pick,
        timestamp: `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 8)}`
      }
      const logs = Array.isArray(this.securityLogs) ? [...this.securityLogs, next] : [next]
      this.securityLogs = logs.slice(-200)
      this.lastUpdatedAt = Date.now()
    },

    fetchAuditLogs() {
      const now = new Date()
      const nextId = Number(this.auditLogs?.[this.auditLogs.length - 1]?.id ?? 0) + 1
      const actions = [
        { action: 'view', message: '查看了仪表盘摘要。' },
        { action: 'export', message: '导出了告警列表。' },
        { action: 'update', message: '更新了偏好设置。' }
      ]
      const pick = actions[Math.floor(Math.random() * actions.length)]
      const next = {
        id: nextId,
        username: 'admin',
        ...pick,
        timestamp: `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 8)}`,
        details: { traceId: `trace-${now.getTime()}` }
      }
      const logs = Array.isArray(this.auditLogs) ? [...this.auditLogs, next] : [next]
      this.auditLogs = logs.slice(-200)
      this.lastUpdatedAt = Date.now()
    },

    fetchIOStatistics() {
      this.updateIOStatistics()
      this.lastUpdatedAt = Date.now()
    },

    updateIOStatistics() {
      // 演示：用轻量“滑窗”模拟刷新
      const shiftAndPush = (series, jitter = 200) => {
        const next = [...series]
        const last = next[next.length - 1]
        const [hour, minute] = String(last?.time || '00:00').split(':').map((part) => Number(part))
        const nextHour = Number.isFinite(hour) ? (hour + 1) % 24 : 0
        const time = `${pad2(nextHour)}:${pad2(Number.isFinite(minute) ? minute : 0)}`
        const base = Number(last?.value || 0)
        const value = Math.max(0, Math.round(base + (Math.random() * 2 - 1) * jitter))
        next.shift()
        next.push({ time, value })
        return next
      }

      this.ioStatistics = {
        readOps: shiftAndPush(this.ioStatistics.readOps, 220),
        writeOps: shiftAndPush(this.ioStatistics.writeOps, 160)
      }
    },

    fetchProcesses() {
      this.processes = (this.processes || []).map((process) => {
        const cpu = clampNumber(Math.round(Number(process.cpu ?? 0) + (Math.random() * 2 - 1) * 4), 0, 100)
        const memory = clampNumber(Math.round(Number(process.memory ?? 0) + (Math.random() * 2 - 1) * 18), 20, 2000)
        return { ...process, cpu, memory }
      })
      this.lastUpdatedAt = Date.now()
    },

    stopProcess(pid) {
      const index = this.processes.findIndex((p) => p.pid === pid)
      if (index === -1) return
      this.processes = [
        ...this.processes.slice(0, index),
        { ...this.processes[index], status: 'stopped' },
        ...this.processes.slice(index + 1)
      ]
      this.persist()
    },

    fetchTemperatureData() {
      const step = (series, { min = 30, max = 85 } = {}) => {
        const next = [...series]
        const last = next[next.length - 1]
        const [hour, minute] = String(last?.time || '00:00').split(':').map((part) => Number(part))
        const nextHour = Number.isFinite(hour) ? (hour + 1) % 24 : 0
        const time = `${pad2(nextHour)}:${pad2(Number.isFinite(minute) ? minute : 0)}`
        const lastValue = Number(last?.value || min)
        const drift = (Math.random() * 2 - 1) * 2.2
        const value = Math.round(Math.max(min, Math.min(max, lastValue + drift)))
        next.shift()
        next.push({ time, value })
        return next
      }

      this.cpuTemperatureHistory = step(this.cpuTemperatureHistory, { min: 35, max: 80 })
      this.systemTemperatureHistory = step(this.systemTemperatureHistory, { min: 30, max: 75 })
      this.lastUpdatedAt = Date.now()
    },

    refreshAll() {
      this.fetchCpuUsage()
      this.fetchMemoryUsage()
      this.fetchDiskUsage()
      this.fetchNetworkTraffic()
      this.fetchFrontendPerformance()
      this.fetchProcesses()
      this.fetchIOStatistics()
      this.fetchTemperatureData()
      this.fetchLogs()
    }
  }
})

