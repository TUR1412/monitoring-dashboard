// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

const LoginPage = () => import('@/views/LoginPage.vue');
const Dashboard = () => import('@/views/Dashboard.vue');
const MainLayout = () => import('@/layouts/MainLayout.vue');

// 系统资源组件
const SystemResources = () => import('@/components/SystemResources.vue');
const CpuUsage = () => import('@/components/charts/CpuUsage.vue');
const MemoryUsage = () => import('@/components/charts/MemoryUsage.vue');
const DiskUsage = () => import('@/components/charts/DiskUsage.vue');
const NetworkTraffic = () => import('@/components/charts/NetworkTraffic.vue');

// 用户管理
const UserManagement = () => import('@/views/UserManagement.vue');
const AddUser = () => import('@/components/UserManagement/AddUser.vue');
const EditUser = () => import('@/components/UserManagement/EditUser.vue');
const RolePermissions = () => import('@/components/UserManagement/RolePermissions.vue');
const UserGroups = () => import('@/components/UserManagement/UserGroups.vue');

// 系统警报
const SystemAlerts = () => import('@/views/SystemAlerts.vue');
const ActiveAlerts = () => import('@/components/alerts/ActiveAlerts.vue');
const AlertHistory = () => import('@/components/alerts/AlertHistory.vue');
const AlertSettings = () => import('@/components/alerts/AlertSettings.vue');

// 日志
const Logs = () => import('@/views/Logs.vue');
const SystemLogs = () => import('@/components/logs/SystemLogs.vue');
const SecurityLogs = () => import('@/components/logs/SecurityLogs.vue');
const AuditLogs = () => import('@/components/logs/AuditLogs.vue');

// 用户体验
const UserExperience = () => import('@/components/UserExperience.vue');
const UserFeedback = () => import('@/components/UserExperience/UserFeedback.vue');
const Surveys = () => import('@/components/UserExperience/Surveys.vue');
const UserMetrics = () => import('@/components/UserExperience/UserMetrics.vue');

// 安全中心
const SecurityCenter = () => import('@/views/SecurityCenter.vue');
const ThreatDetection = () => import('@/components/security/ThreatDetection.vue');
const AccessControl = () => import('@/components/security/AccessControl.vue');
const Compliance = () => import('@/components/security/Compliance.vue');

// 数据分析
const Analytics = () => import('@/views/Analytics.vue');
const TrafficAnalysis = () => import('@/components/analytics/TrafficAnalysis.vue');
const PerformanceAnalysis = () => import('@/components/analytics/PerformanceAnalysis.vue');
const Reports = () => import('@/components/analytics/Reports.vue');

// 引入 Pinia 存储
import { useMonitorStore } from '@/stores/monitorStore';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginPage,
    meta: { title: '登录' }
  },
  {
    path: '/dashboard',
    component: MainLayout,
    meta: { requiresAuth: true, title: '仪表盘' },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: Dashboard,
        meta: { title: '仪表盘' }
      },
      {
        path: 'system-resources',
        name: 'SystemResourcesParent',
        component: SystemResources,
        meta: { title: '系统资源' },
        children: [
          {
            path: 'cpu-usage',
            name: 'CpuUsage',
            component: CpuUsage,
            meta: { title: 'CPU 使用率' }
          },
          {
            path: 'memory-usage',
            name: 'MemoryUsage',
            component: MemoryUsage,
            meta: { title: '内存使用率' }
          },
          {
            path: 'disk-usage',
            name: 'DiskUsage',
            component: DiskUsage,
            meta: { title: '磁盘使用情况' }
          },
          {
            path: 'network',
            name: 'NetworkTraffic',
            component: NetworkTraffic,
            meta: { title: '网络流量' }
          },
          {
            path: 'process-monitor',
            name: 'ProcessMonitor',
            component: () => import('@/components/charts/ProcessMonitor.vue'),
            meta: { title: '进程监控' }
          },
          {
            path: 'io-statistics',
            name: 'IOStatistics',
            component: () => import('@/components/charts/IOStatistics.vue'),
            meta: { title: 'I/O 统计' }
          },
          {
            path: 'gpu-usage',
            name: 'GPUUsage',
            component: () => import('@/components/charts/GPUUsage.vue'),
            meta: { title: 'GPU 使用率' }
          },
          {
            path: 'temperature',
            name: 'Temperature',
            component: () => import('@/components/charts/Temperature.vue'),
            meta: { title: '温度监控' }
          }
        ]
      },
      {
        path: 'user-management',
        name: 'UserManagementParent',
        component: UserManagement,
        meta: { title: '用户管理' },
        children: [
          {
            path: 'add-user',
            name: 'AddUser',
            component: AddUser,
            meta: { title: '添加用户' }
          },
          {
            path: 'edit-user',
            name: 'EditUser',
            component: EditUser,
            meta: { title: '编辑用户' }
          },
          {
            path: 'roles',
            name: 'RolePermissions',
            component: RolePermissions,
            meta: { title: '角色权限' }
          },
          {
            path: 'groups',
            name: 'UserGroups',
            component: UserGroups,
            meta: { title: '用户组' }
          }
        ]
      },
      {
        path: 'system-alerts',
        name: 'SystemAlertsParent',
        component: SystemAlerts,
        meta: { title: '系统警报' },
        children: [
          {
            path: 'active',
            name: 'ActiveAlerts',
            component: ActiveAlerts,
            meta: { title: '活动警报' }
          },
          {
            path: 'history',
            name: 'AlertHistory',
            component: AlertHistory,
            meta: { title: '警报历史' }
          },
          {
            path: 'settings',
            name: 'AlertSettings',
            component: AlertSettings,
            meta: { title: '警报设置' }
          }
        ]
      },
      {
        path: 'logs',
        name: 'LogsParent',
        component: Logs,
        meta: { title: '日志' },
        children: [
          {
            path: 'system',
            name: 'SystemLogs',
            component: SystemLogs,
            meta: { title: '系统日志' }
          },
          {
            path: 'security',
            name: 'SecurityLogs',
            component: SecurityLogs,
            meta: { title: '安全日志' }
          },
          {
            path: 'audit',
            name: 'AuditLogs',
            component: AuditLogs,
            meta: { title: '审计日志' }
          }
        ]
      },
      {
        path: 'user-experience',
        name: 'UserExperienceParent',
        component: UserExperience,
        meta: { title: '用户体验' },
        children: [
          {
            path: 'feedback',
            name: 'UserFeedback',
            component: UserFeedback,
            meta: { title: '用户反馈' }
          },
          {
            path: 'surveys',
            name: 'Surveys',
            component: Surveys,
            meta: { title: '调查问卷' }
          },
          {
            path: 'metrics',
            name: 'UserMetrics',
            component: UserMetrics,
            meta: { title: '用户指标' }
          }
        ]
      },
      {
        path: 'security',
        name: 'SecurityCenterParent',
        component: SecurityCenter,
        meta: { title: '安全中心' },
        children: [
          {
            path: 'threats',
            name: 'ThreatDetection',
            component: ThreatDetection,
            meta: { title: '威胁检测' }
          },
          {
            path: 'access-control',
            name: 'AccessControl',
            component: AccessControl,
            meta: { title: '访问控制' }
          },
          {
            path: 'compliance',
            name: 'Compliance',
            component: Compliance,
            meta: { title: '合规性' }
          }
        ]
      },
      {
        path: 'analytics',
        name: 'AnalyticsParent',
        component: Analytics,
        meta: { title: '数据分析' },
        children: [
          {
            path: 'traffic',
            name: 'TrafficAnalysis',
            component: TrafficAnalysis,
            meta: { title: '流量分析' }
          },
          {
            path: 'performance',
            name: 'PerformanceAnalysis',
            component: PerformanceAnalysis,
            meta: { title: '性能分析' }
          },
          {
            path: 'reports',
            name: 'Reports',
            component: Reports,
            meta: { title: '报告' }
          }
        ]
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  const store = useMonitorStore();

  // 初始化标签（可选）
  if (!store.openTabs.length && to.name !== 'Login') {
    store.initializeTabs();
  }

  // 如果用户已登录但访问登录页，则重定向到仪表盘
  if (to.name === 'Login' && store.user) {
    next({ name: 'Dashboard' });
    return;
  }

  // 如果路由需要认证且用户未登录，则重定向到登录页
  if (to.meta.requiresAuth && !store.user) {
    next({ name: 'Login' });
  } else {
    // 添加标签（排除一些不需要显示的路由，如登录页）
    if (to.name !== 'Login') {
      store.addTab(to);
    }
    next();
  }
});

// 全局后置钩子
router.afterEach((to, from) => {
  // 更新页面标题
  document.title = to.meta.title ? `${to.meta.title} - 监控面板` : '监控面板';
});

export default router;
