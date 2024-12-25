// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/views/LoginPage.vue'
import Dashboard from '@/views/Dashboard.vue'
import MainLayout from '@/layouts/MainLayout.vue'

// 系统资源
import SystemResources from '@/components/SystemResources.vue'
import CpuUsage from '@/components/charts/CpuUsage.vue'
import MemoryUsage from '@/components/charts/MemoryUsage.vue'
import DiskUsage from '@/components/charts/DiskUsage.vue'
import NetworkTraffic from '@/components/charts/NetworkTraffic.vue'

// 用户管理
import UserManagement from '@/views/UserManagement.vue'
import AddUser from '@/components/UserManagement/AddUser.vue'
import EditUser from '@/components/UserManagement/EditUser.vue'
import RolePermissions from '@/components/UserManagement/RolePermissions.vue'
import UserGroups from '@/components/UserManagement/UserGroups.vue'

// 系统警报
import SystemAlerts from '@/views/SystemAlerts.vue'
import ActiveAlerts from '@/components/alerts/ActiveAlerts.vue'
import AlertHistory from '@/components/alerts/AlertHistory.vue'
import AlertSettings from '@/components/alerts/AlertSettings.vue'

// 日志
import Logs from '@/views/Logs.vue'
import SystemLogs from '@/components/logs/SystemLogs.vue'
import SecurityLogs from '@/components/logs/SecurityLogs.vue'
import AuditLogs from '@/components/logs/AuditLogs.vue'

// 用户体验
import UserExperience from '@/components/UserExperience.vue'
import UserFeedback from '@/components/UserExperience/UserFeedback.vue'
import Surveys from '@/components/UserExperience/Surveys.vue'
import UserMetrics from '@/components/UserExperience/UserMetrics.vue'

// 安全中心
import SecurityCenter from '@/views/SecurityCenter.vue'
import ThreatDetection from '@/components/security/ThreatDetection.vue'
import AccessControl from '@/components/security/AccessControl.vue'
import Compliance from '@/components/security/Compliance.vue'

// 数据分析
import Analytics from '@/views/Analytics.vue'
import TrafficAnalysis from '@/components/analytics/TrafficAnalysis.vue'
import PerformanceAnalysis from '@/components/analytics/PerformanceAnalysis.vue'
import Reports from '@/components/analytics/Reports.vue'

import { useMonitorStore } from '@/stores/monitorStore'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/dashboard',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: Dashboard
      },
      {
        path: 'system-resources',
        name: 'SystemResourcesParent',
        component: SystemResources,
        children: [
          {
            path: 'cpu-usage',
            name: 'CpuUsage',
            component: CpuUsage
          },
          {
            path: 'memory-usage',
            name: 'MemoryUsage',
            component: MemoryUsage
          },
          {
            path: 'disk-usage',
            name: 'DiskUsage',
            component: DiskUsage
          },
          {
            path: 'network',
            name: 'NetworkTraffic',
            component: NetworkTraffic
          }
        ]
      },
      {
        path: 'user-management',
        name: 'UserManagementParent',
        component: UserManagement,
        children: [
          {
            path: 'add-user',
            name: 'AddUser',
            component: AddUser
          },
          {
            path: 'edit-user',
            name: 'EditUser',
            component: EditUser
          },
          {
            path: 'roles',
            name: 'RolePermissions',
            component: RolePermissions
          },
          {
            path: 'groups',
            name: 'UserGroups',
            component: UserGroups
          }
        ]
      },
      {
        path: 'system-alerts',
        name: 'SystemAlertsParent',
        component: SystemAlerts,
        children: [
          {
            path: 'active',
            name: 'ActiveAlerts',
            component: ActiveAlerts
          },
          {
            path: 'history',
            name: 'AlertHistory',
            component: AlertHistory
          },
          {
            path: 'settings',
            name: 'AlertSettings',
            component: AlertSettings
          }
        ]
      },
      {
        path: 'logs',
        name: 'LogsParent',
        component: Logs,
        children: [
          {
            path: 'system',
            name: 'SystemLogs',
            component: SystemLogs
          },
          {
            path: 'security',
            name: 'SecurityLogs',
            component: SecurityLogs
          },
          {
            path: 'audit',
            name: 'AuditLogs',
            component: AuditLogs
          }
        ]
      },
      {
        path: 'user-experience',
        name: 'UserExperienceParent',
        component: UserExperience,
        children: [
          {
            path: 'feedback',
            name: 'UserFeedback',
            component: UserFeedback
          },
          {
            path: 'surveys',
            name: 'Surveys',
            component: Surveys
          },
          {
            path: 'metrics',
            name: 'UserMetrics',
            component: UserMetrics
          }
        ]
      },
      {
        path: 'security',
        name: 'SecurityCenterParent',
        component: SecurityCenter,
        children: [
          {
            path: 'threats',
            name: 'ThreatDetection',
            component: ThreatDetection
          },
          {
            path: 'access-control',
            name: 'AccessControl',
            component: AccessControl
          },
          {
            path: 'compliance',
            name: 'Compliance',
            component: Compliance
          }
        ]
      },
      {
        path: 'analytics',
        name: 'AnalyticsParent',
        component: Analytics,
        children: [
          {
            path: 'traffic',
            name: 'TrafficAnalysis',
            component: TrafficAnalysis
          },
          {
            path: 'performance',
            name: 'PerformanceAnalysis',
            component: PerformanceAnalysis
          },
          {
            path: 'reports',
            name: 'Reports',
            component: Reports
          }
        ]
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  const store = useMonitorStore()

  // 如果用户已登录但访问登录页，则重定向到仪表盘
  if (to.name === 'Login' && store.user) {
    next({ name: 'Dashboard' })
    return
  }

  // 如果路由需要认证且用户未登录，则重定向到登录页
  if (to.meta.requiresAuth && !store.user) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

// 全局后置钩子
router.afterEach((to, from) => {
  // 更新页面标题
  document.title = to.name ? `${to.name} - 监控面板` : '监控面板'
})

export default router
