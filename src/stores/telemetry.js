// src/stores/telemetry.js
// 系统资源/进程/日志/温度等遥测数据（演示数据 + 可扩展的刷新动作）。

import { defineStore } from 'pinia'
import { safeStorage } from '@/utils/storage'

const STORAGE_KEYS = {
  processes: 'monitoring-dashboard:processes'
}

const pad2 = (num) => String(num).padStart(2, '0')

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
      return
    },

    fetchMemoryUsage() {
      return
    },

    fetchDiskUsage() {
      return
    },

    fetchNetworkTraffic() {
      return
    },

    fetchFrontendPerformance() {
      return
    },

    fetchLogs() {
      return
    },

    fetchSecurityLogs() {
      return
    },

    fetchAuditLogs() {
      return
    },

    fetchIOStatistics() {
      return
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
      return
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
    }
  }
})

