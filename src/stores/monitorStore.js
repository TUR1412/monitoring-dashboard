// src/stores/monitorStore.js
import { defineStore } from 'pinia';

const canUseStorage = typeof window !== 'undefined' && typeof localStorage !== 'undefined';
const readStorage = (key, fallback, parseJson = true) => {
  if (!canUseStorage) return fallback;
  const raw = localStorage.getItem(key);
  if (raw === null || raw === undefined) return fallback;
  if (!parseJson) return raw;
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn(`Failed to parse storage key: ${key}`, error);
    return fallback;
  }
};
const writeStorage = (key, value, stringify = true) => {
  if (!canUseStorage) return;
  try {
    const payload = stringify ? JSON.stringify(value) : String(value);
    localStorage.setItem(key, payload);
  } catch (error) {
    console.warn(`Failed to write storage key: ${key}`, error);
  }
};

export const useMonitorStore = defineStore('monitor', {
  state: () => ({
    // 标签管理
    openTabs: [], // 当前打开的标签数组
    activeTab: null, // 当前活动的标签名称

    // 用户管理
    users: readStorage('users', [
      { id: 1, username: 'admin', role: 'admin', isActive: true, lastSeen: '2025-12-20 09:12', department: 'SRE' },
      { id: 2, username: 'observer', role: 'user', isActive: true, lastSeen: '2025-12-20 08:45', department: 'NOC' },
      { id: 3, username: 'analyst', role: 'user', isActive: false, lastSeen: '2025-12-19 22:10', department: 'Security' }
    ]),
    user: readStorage('user', null), // 当前登录用户

    // 主题状态
    theme: readStorage('theme', 'dark', false), // 默认主题为深色主题

    uiPreferences: readStorage('uiPreferences', {
      density: 'comfortable',
      reducedMotion: false,
      compactSidebar: false
    }),

    // 系统资源
    cpuUsage: [
      { time: '00:00', usage: 20 },
      { time: '01:00', usage: 25 },
      { time: '02:00', usage: 30 },
      { time: '03:00', usage: 28 },
      { time: '04:00', usage: 35 },
      { time: '05:00', usage: 40 },
      { time: '06:00', usage: 38 },
      { time: '07:00', usage: 45 },
      { time: '08:00', usage: 50 },
      { time: '09:00', usage: 55 },
      { time: '10:00', usage: 60 },
      { time: '11:00', usage: 58 },
      { time: '12:00', usage: 65 },
      { time: '13:00', usage: 70 },
      { time: '14:00', usage: 68 },
      { time: '15:00', usage: 75 },
      { time: '16:00', usage: 80 },
      { time: '17:00', usage: 78 },
      { time: '18:00', usage: 85 },
      { time: '19:00', usage: 90 },
      { time: '20:00', usage: 88 },
      { time: '21:00', usage: 95 },
      { time: '22:00', usage: 100 },
      { time: '23:00', usage: 98 }
    ],
    memoryUsage: { used: 4096, free: 2048 }, // 单位：MB
    memoryUsageHistory: [
      { time: '00:00', value: 2048 },
      { time: '01:00', value: 2100 },
      { time: '02:00', value: 2200 },
      { time: '03:00', value: 2150 },
      { time: '04:00', value: 2250 },
      { time: '05:00', value: 2300 },
      { time: '06:00', value: 2350 },
      { time: '07:00', value: 2400 },
      { time: '08:00', value: 2450 },
      { time: '09:00', value: 2500 },
      { time: '10:00', value: 2550 },
      { time: '11:00', value: 2600 },
      { time: '12:00', value: 2650 },
      { time: '13:00', value: 2700 },
      { time: '14:00', value: 2750 },
      { time: '15:00', value: 2800 },
      { time: '16:00', value: 2850 },
      { time: '17:00', value: 2900 },
      { time: '18:00', value: 2950 },
      { time: '19:00', value: 3000 },
      { time: '20:00', value: 3050 },
      { time: '21:00', value: 3100 },
      { time: '22:00', value: 3150 },
      { time: '23:00', value: 3200 }
    ], // 单位：MB
    diskUsage: { usedDisk1: 500, usedDisk2: 300, usedDisk3: 200, free: 1500 }, // 单位：GB
    networkTraffic: {
      inbound: [50, 60, 55, 70, 65], // 示例数据
      outbound: [40, 50, 45, 60, 55],
      total: [90, 110, 100, 130, 120]
    }, // 单位：Mbps
    frontendPerformanceData: [
      { time: '00:00', loadTime: 2.5, interactionTime: 1.2, responseTime: 0.8, renderTime: 1.5 },
      { time: '01:00', loadTime: 2.7, interactionTime: 1.3, responseTime: 0.85, renderTime: 1.6 },
      { time: '02:00', loadTime: 2.8, interactionTime: 1.4, responseTime: 0.9, renderTime: 1.7 },
      // 添加更多静态数据
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
    logs: [
      { id: 1, level: 'info', message: '系统启动成功。', timestamp: '2024-04-27 08:00:00' },
      { id: 2, level: 'warning', message: '磁盘空间不足。', timestamp: '2024-04-27 09:30:00' },
      { id: 3, level: 'error', message: '应用程序崩溃。', timestamp: '2024-04-27 10:45:00' },
      { id: 4, level: 'info', message: '用户登录成功。', timestamp: '2024-04-27 11:00:00' },
      { id: 5, level: 'error', message: '无法连接到数据库。', timestamp: '2024-04-27 12:15:00' }
    ],
    alerts: [
      { 
        id: 1, 
        level: 'warning', 
        title: '高内存使用率', 
        message: '内存使用率超过80%。', 
        timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2小时前
        source: '系统监控', 
        acknowledged: false, 
        muted: false, 
        archived: false 
      },
      { 
        id: 2, 
        level: 'error', 
        title: '数据库连接失败', 
        message: '无法连接到数据库。', 
        timestamp: Date.now() - 1 * 60 * 60 * 1000, // 1小时前
        source: '数据库服务', 
        acknowledged: false, 
        muted: false, 
        archived: false 
      },
      { 
        id: 3, 
        level: 'info', 
        title: '系统维护通知', 
        message: '系统维护将在今晚12点开始。', 
        timestamp: Date.now() - 25 * 60 * 60 * 1000, // 25小时前
        source: '系统通知', 
        acknowledged: true, 
        muted: false, 
        archived: false 
      },
      // 可以添加更多静态警报
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
      { id: 3, username: 'user2', action: 'update', message: '更新了系统设置。', timestamp: '2024-04-27 10:45:00', details: { setting: '网络配置', oldValue: 'DHCP', newValue: '静态' } },
      { id: 4, username: 'admin', action: 'delete', message: '删除了用户。', timestamp: '2024-04-27 11:00:00', details: { userId: 3, username: 'user2' } },
      { id: 5, username: 'user1', action: 'logout', message: '用户登出。', timestamp: '2024-04-27 12:15:00', details: { ip: '192.168.1.11', location: '远程' } }
    ],

    // 进程管理
    processes: [
      { pid: 101, name: 'nginx', cpu: 5, memory: 150, status: 'running' },
      { pid: 202, name: 'node', cpu: 15, memory: 300, status: 'running' },
      { pid: 303, name: 'mysql', cpu: 10, memory: 250, status: 'stopped' },
      // 可以添加更多初始进程数据
    ],

    // I/O 统计数据
    ioStatistics: {
      readOps: [
        { time: '00:00', value: 2000 },
        { time: '01:00', value: 2500 },
        { time: '02:00', value: 3000 },
        { time: '03:00', value: 2800 },
        { time: '04:00', value: 3500 },
        { time: '05:00', value: 4000 },
        { time: '06:00', value: 3800 },
        { time: '07:00', value: 4500 },
        { time: '08:00', value: 5000 },
        { time: '09:00', value: 5500 },
        { time: '10:00', value: 6000 },
        { time: '11:00', value: 5800 },
        { time: '12:00', value: 6500 },
        { time: '13:00', value: 7000 },
        { time: '14:00', value: 6800 },
        { time: '15:00', value: 7500 },
        { time: '16:00', value: 8000 },
        { time: '17:00', value: 7800 },
        { time: '18:00', value: 8500 },
        { time: '19:00', value: 9000 },
        { time: '20:00', value: 8800 },
        { time: '21:00', value: 9500 },
        { time: '22:00', value: 10000 },
        { time: '23:00', value: 9300 }
      ],
      writeOps: [
        { time: '00:00', value: 1500 },
        { time: '01:00', value: 2000 },
        { time: '02:00', value: 2500 },
        { time: '03:00', value: 2300 },
        { time: '04:00', value: 3000 },
        { time: '05:00', value: 3500 },
        { time: '06:00', value: 3300 },
        { time: '07:00', value: 4000 },
        { time: '08:00', value: 4500 },
        { time: '09:00', value: 5000 },
        { time: '10:00', value: 5500 },
        { time: '11:00', value: 5300 },
        { time: '12:00', value: 6000 },
        { time: '13:00', value: 6500 },
        { time: '14:00', value: 6300 },
        { time: '15:00', value: 7000 },
        { time: '16:00', value: 7500 },
        { time: '17:00', value: 7300 },
        { time: '18:00', value: 8000 },
        { time: '19:00', value: 8500 },
        { time: '20:00', value: 8300 },
        { time: '21:00', value: 9000 },
        { time: '22:00', value: 9500 },
        { time: '23:00', value: 9300 }
      ]
    },

    // CPU 和系统温度历史数据（用于 Temperature.vue）
    cpuTemperatureHistory: [
      { time: '00:00', value: 40 },
      { time: '01:00', value: 42 },
      { time: '02:00', value: 45 },
      { time: '03:00', value: 43 },
      { time: '04:00', value: 47 },
      { time: '05:00', value: 50 },
      { time: '06:00', value: 48 },
      { time: '07:00', value: 52 },
      { time: '08:00', value: 55 },
      { time: '09:00', value: 60 },
      { time: '10:00', value: 65 },
      { time: '11:00', value: 63 },
      { time: '12:00', value: 68 },
      { time: '13:00', value: 70 },
      { time: '14:00', value: 72 },
      { time: '15:00', value: 75 },
      { time: '16:00', value: 78 },
      { time: '17:00', value: 76 },
      { time: '18:00', value: 80 },
      { time: '19:00', value: 85 },
      { time: '20:00', value: 83 },
      { time: '21:00', value: 88 },
      { time: '22:00', value: 90 },
      { time: '23:00', value: 92 }
    ],
    systemTemperatureHistory: [
      { time: '00:00', value: 35 },
      { time: '01:00', value: 36 },
      { time: '02:00', value: 38 },
      { time: '03:00', value: 37 },
      { time: '04:00', value: 39 },
      { time: '05:00', value: 40 },
      { time: '06:00', value: 39 },
      { time: '07:00', value: 41 },
      { time: '08:00', value: 43 },
      { time: '09:00', value: 45 },
      { time: '10:00', value: 48 },
      { time: '11:00', value: 46 },
      { time: '12:00', value: 50 },
      { time: '13:00', value: 52 },
      { time: '14:00', value: 54 },
      { time: '15:00', value: 56 },
      { time: '16:00', value: 58 },
      { time: '17:00', value: 57 },
      { time: '18:00', value: 60 },
      { time: '19:00', value: 63 },
      { time: '20:00', value: 62 },
      { time: '21:00', value: 65 },
      { time: '22:00', value: 67 },
      { time: '23:00', value: 68 }
    ],

    // 通用状态
    loading: false,
    error: null
  }),
  actions: {
    // 标签管理动作
    addTab(route) {
      const exists = this.openTabs.find(tab => tab.name === route.name);
      if (!exists && route.name) { // 确保路由有名称
        this.openTabs.push({
          name: route.name,
          path: route.path,
          meta: route.meta
        });
      }
      if (route.name) {
        this.activeTab = route.name;
      }
      this.persistTabs(); // 持久化
    },

    removeTab(name) {
      const index = this.openTabs.findIndex(tab => tab.name === name);
      if (index !== -1) {
        this.openTabs.splice(index, 1);
        // 如果关闭的是当前活动标签，切换到前一个或下一个标签
        if (this.activeTab === name) {
          if (this.openTabs.length > 0) {
            this.activeTab = this.openTabs[Math.max(0, index - 1)].name;
          } else {
            this.activeTab = null;
          }
        }
        this.persistTabs(); // 持久化
      }
    },

    setActiveTab(name) {
      this.activeTab = name;
      this.persistTabs(); // 持久化
    },

    initializeTabs() {
      const savedTabs = readStorage('openTabs', []);
      const savedActiveTab = readStorage('activeTab', null, false);
      if (savedTabs && Array.isArray(savedTabs)) {
        this.openTabs = savedTabs;
      }
      if (savedActiveTab && savedActiveTab !== 'null') {
        this.activeTab = savedActiveTab;
      }
    },

    persistTabs() {
      writeStorage('openTabs', this.openTabs);
      if (this.activeTab) {
        writeStorage('activeTab', this.activeTab, false);
      } else if (canUseStorage) {
        localStorage.removeItem('activeTab');
      }
    },

    // 数据获取动作（使用静态数据，无需异步操作）
    fetchCpuUsage() {
      this.loading = true;
      try {
        // 数据已静态初始化，无需操作
      } catch (err) {
        this.error = '无法获取 CPU 使用率数据。';
      } finally {
        this.loading = false;
      }
    },
    fetchMemoryUsage() {
      this.loading = true;
      try {
        // 数据已静态初始化，无需操作
      } catch (err) {
        this.error = '无法获取内存使用率数据。';
      } finally {
        this.loading = false;
      }
    },
    fetchDiskUsage() {
      this.loading = true;
      try {
        // 数据已静态初始化，无需操作
      } catch (err) {
        this.error = '无法获取磁盘使用情况数据。';
      } finally {
        this.loading = false;
      }
    },
    fetchNetworkTraffic() {
      this.loading = true;
      try {
        // 数据已静态初始化，无需操作
      } catch (err) {
        this.error = '无法获取网络流量数据。';
      } finally {
        this.loading = false;
      }
    },
    fetchFrontendPerformance() {
      this.loading = true;
      try {
        // 数据已静态初始化，无需操作
      } catch (err) {
        this.error = '无法获取前端性能数据。';
      } finally {
        this.loading = false;
      }
    },
    fetchErrorReports() {
      this.loading = true;
      try {
        // 数据已静态初始化，无需操作
      } catch (err) {
        this.error = '无法获取错误报告。';
      } finally {
        this.loading = false;
      }
    },
    fetchUserBehavior() {
      this.loading = true;
      try {
        // 数据已静态初始化，无需操作
      } catch (err) {
        this.error = '无法获取用户行为数据。';
      } finally {
        this.loading = false;
      }
    },
    fetchLogs() {
      this.loading = true;
      try {
        // 数据已静态初始化，无需操作
      } catch (err) {
        this.error = '无法获取日志数据。';
      } finally {
        this.loading = false;
      }
    },
    fetchAlerts() {
      this.loading = true;
      try {
        // 数据已静态初始化，无需操作
      } catch (err) {
        this.error = '无法获取警报数据。';
      } finally {
        this.loading = false;
      }
    },
    fetchSecurityLogs() {
      this.loading = true;
      try {
        // 数据已静态初始化，无需操作
      } catch (err) {
        this.error = '无法获取安全日志数据。';
      } finally {
        this.loading = false;
      }
    },
    fetchAuditLogs() {
      this.loading = true;
      try {
        // 数据已静态初始化，无需操作
      } catch (err) {
        this.error = '无法获取审计日志数据。';
      } finally {
        this.loading = false;
      }
    },

    fetchIOStatistics() {
      this.loading = true;
      try {
        // 数据已静态初始化，无需操作
      } catch (err) {
        this.error = '无法获取 I/O 数据。';
      } finally {
        this.loading = false;
      }
    },

    fetchProcesses() {
      this.loading = true;
      try {
        // 数据已静态初始化，无需操作
      } catch (err) {
        this.error = '无法获取进程数据。';
      } finally {
        this.loading = false;
      }
    },

    fetchTemperatureData() {
      this.loading = true;
      try {
        // 获取最后一个时间点
        const lastTimeCpu = this.cpuTemperatureHistory[this.cpuTemperatureHistory.length - 1].time;
        const lastTimeSystem = this.systemTemperatureHistory[this.systemTemperatureHistory.length - 1].time;

        // 假设时间以小时递增
        const [hour, minute] = lastTimeCpu.split(':').map(Number);
        let newHour = hour + 1;
        let newMinute = minute;
        if (newHour >= 24) {
          newHour = 0;
        }
        const newTime = `${newHour.toString().padStart(2, '0')}:${newMinute.toString().padStart(2, '0')}`;

        // 生成新的温度数据
        const newCpuTemp = Math.floor(40 + Math.random() * 30); // 40°C 到 70°C
        const newSystemTemp = Math.floor(35 + Math.random() * 25); // 35°C 到 60°C

        // 更新 cpuTemperatureHistory
        this.cpuTemperatureHistory = [
          ...this.cpuTemperatureHistory.slice(1), // 移除最旧的数据点
          { time: newTime, value: newCpuTemp }
        ];

        // 更新 systemTemperatureHistory
        this.systemTemperatureHistory = [
          ...this.systemTemperatureHistory.slice(1), // 移除最旧的数据点
          { time: newTime, value: newSystemTemp }
        ];

        console.log('Temperature Data Updated:', {
          cpu: newCpuTemp,
          system: newSystemTemp,
          time: newTime
        });
      } catch (err) {
        this.error = '无法获取温度数据。';
      } finally {
        this.loading = false;
      }
    },

    stopProcess(pid) {
      this.loading = true;
      try {
        const processIndex = this.processes.findIndex(p => p.pid === pid);
        if (processIndex !== -1) {
          // 使用不可变更新
          this.processes = [
            ...this.processes.slice(0, processIndex),
            { ...this.processes[processIndex], status: 'stopped' },
            ...this.processes.slice(processIndex + 1)
          ];
        }
        this.error = null;
      } catch (err) {
        this.error = '无法停止进程。';
      } finally {
        this.loading = false;
      }
    },

    // 登录动作（模拟登录）
    async login(username, password) {
      this.loading = true;
      this.error = null;
      try {
        // 模拟 API 请求延迟
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // 使用静态凭证进行验证
        if (username === 'admin' && password === 'password') {
          this.user = { name: '管理员用户', role: 'admin', avatar: null };
          // 存储用户信息到本地存储（实际项目中应存储令牌）
          writeStorage('authToken', 'mock-token', false);
          writeStorage('user', this.user);
        } else {
          throw new Error('用户名或密码错误');
        }
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      if (canUseStorage) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    },

    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      writeStorage('theme', this.theme, false); // 持久化主题选择
      this.applyTheme(); // 应用主题类到 <body>
    },

    initializeTheme() {
      const savedTheme = readStorage('theme', null, false);
      if (savedTheme) {
        this.theme = savedTheme;
      } else {
        // 根据系统偏好设置自动选择主题
        const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.theme = prefersDark ? 'dark' : 'light';
        writeStorage('theme', this.theme, false);
      }
      this.applyTheme(); // 应用主题类到 <body>
    },

    applyTheme() {
      if (typeof document === 'undefined') return;
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(this.theme);
      document.body.classList.remove('light', 'dark');
      document.body.classList.add(this.theme);
    },

    // 用户管理动作
    addUser(newUser) {
      const payload = {
        isActive: true,
        department: '未分配',
        lastSeen: '刚刚',
        ...newUser
      };
      this.users = [...this.users, { id: Date.now(), ...payload }];
      writeStorage('users', this.users);
      // 在实际项目中，应同步添加到后端
    },
    editUser(updatedUser) {
      const index = this.users.findIndex(user => user.id === updatedUser.id);
      if (index !== -1) {
        this.users = [
          ...this.users.slice(0, index),
          { ...this.users[index], ...updatedUser },
          ...this.users.slice(index + 1)
        ];
        writeStorage('users', this.users);
        // 在实际项目中，应同步更新到后端
      }
    },
    deleteUser(id) {
      this.users = this.users.filter(user => user.id !== id);
      writeStorage('users', this.users);
      // 在实际项目中，应同步删除到后端
    },

    setUiPreferences(preferences) {
      this.uiPreferences = { ...this.uiPreferences, ...preferences };
      writeStorage('uiPreferences', this.uiPreferences);
    },

    // 警报管理动作
    acknowledgeAlert(alertId) {
      const alertIndex = this.alerts.findIndex(a => a.id === alertId);
      if (alertIndex !== -1) {
        this.alerts = [
          ...this.alerts.slice(0, alertIndex),
          { ...this.alerts[alertIndex], acknowledged: true },
          ...this.alerts.slice(alertIndex + 1)
        ];
        // 在实际项目中，应同步更新到后端
      }
    },
    muteAlert(alertId) {
      const alertIndex = this.alerts.findIndex(a => a.id === alertId);
      if (alertIndex !== -1) {
        this.alerts = [
          ...this.alerts.slice(0, alertIndex),
          { ...this.alerts[alertIndex], muted: !this.alerts[alertIndex].muted },
          ...this.alerts.slice(alertIndex + 1)
        ];
        // 在实际项目中，应同步更新到后端
      }
    },
  }
});
