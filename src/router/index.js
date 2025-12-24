// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

// 页面与组件统一使用懒加载，减少首包体积并提升首屏性能

// 引入 Pinia 存储
import { useAuthStore } from '@/stores/auth';
import { useTabsStore } from '@/stores/tabs';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('@/views/LoginPage.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/dashboard',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: { requiresAuth: true, title: '仪表盘' },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: '仪表盘' }
      },
      {
        path: 'system-resources',
        name: 'SystemResourcesParent',
        component: () => import('@/components/SystemResources.vue'),
        meta: { title: '系统资源' },
        children: [
          {
            path: 'cpu-usage',
            name: 'CpuUsage',
            component: () => import('@/components/charts/CpuUsage.vue'),
            meta: { title: 'CPU 使用率' }
          },
          {
            path: 'memory-usage',
            name: 'MemoryUsage',
            component: () => import('@/components/charts/MemoryUsage.vue'),
            meta: { title: '内存使用率' }
          },
          {
            path: 'disk-usage',
            name: 'DiskUsage',
            component: () => import('@/components/charts/DiskUsage.vue'),
            meta: { title: '磁盘使用情况' }
          },
          {
            path: 'network',
            name: 'NetworkTraffic',
            component: () => import('@/components/charts/NetworkTraffic.vue'),
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
        component: () => import('@/views/UserManagement.vue'),
        meta: { title: '用户管理' },
        children: [
          {
            path: 'add-user',
            name: 'AddUser',
            component: () => import('@/components/UserManagement/AddUser.vue'),
            meta: { title: '添加用户' }
          },
          {
            path: 'edit-user',
            name: 'EditUser',
            component: () => import('@/components/UserManagement/EditUser.vue'),
            meta: { title: '编辑用户' }
          },
          {
            path: 'roles',
            name: 'RolePermissions',
            component: () => import('@/components/UserManagement/RolePermissions.vue'),
            meta: { title: '角色权限' }
          },
          {
            path: 'groups',
            name: 'UserGroups',
            component: () => import('@/components/UserManagement/UserGroups.vue'),
            meta: { title: '用户组' }
          }
        ]
      },
      {
        path: 'system-alerts',
        name: 'SystemAlertsParent',
        component: () => import('@/views/SystemAlerts.vue'),
        meta: { title: '系统警报' },
        children: [
          {
            path: 'active',
            name: 'ActiveAlerts',
            component: () => import('@/components/alerts/ActiveAlerts.vue'),
            meta: { title: '活动警报' }
          },
          {
            path: 'history',
            name: 'AlertHistory',
            component: () => import('@/components/alerts/AlertHistory.vue'),
            meta: { title: '警报历史' }
          },
          {
            path: 'settings',
            name: 'AlertSettings',
            component: () => import('@/components/alerts/AlertSettings.vue'),
            meta: { title: '警报设置' }
          }
        ]
      },
      {
        path: 'logs',
        name: 'LogsParent',
        component: () => import('@/views/Logs.vue'),
        meta: { title: '日志' },
        children: [
          {
            path: 'system',
            name: 'SystemLogs',
            component: () => import('@/components/logs/SystemLogs.vue'),
            meta: { title: '系统日志' }
          },
          {
            path: 'security',
            name: 'SecurityLogs',
            component: () => import('@/components/logs/SecurityLogs.vue'),
            meta: { title: '安全日志' }
          },
          {
            path: 'audit',
            name: 'AuditLogs',
            component: () => import('@/components/logs/AuditLogs.vue'),
            meta: { title: '审计日志' }
          }
        ]
      },
      {
        path: 'user-experience',
        name: 'UserExperienceParent',
        component: () => import('@/components/UserExperience.vue'),
        meta: { title: '用户体验' },
        children: [
          {
            path: 'feedback',
            name: 'UserFeedback',
            component: () => import('@/components/UserExperience/UserFeedback.vue'),
            meta: { title: '用户反馈' }
          },
          {
            path: 'surveys',
            name: 'Surveys',
            component: () => import('@/components/UserExperience/Surveys.vue'),
            meta: { title: '调查问卷' }
          },
          {
            path: 'metrics',
            name: 'UserMetrics',
            component: () => import('@/components/UserExperience/UserMetrics.vue'),
            meta: { title: '用户指标' }
          }
        ]
      },
      {
        path: 'security',
        name: 'SecurityCenterParent',
        component: () => import('@/views/SecurityCenter.vue'),
        meta: { title: '安全中心' },
        children: [
          {
            path: 'threats',
            name: 'ThreatDetection',
            component: () => import('@/components/security/ThreatDetection.vue'),
            meta: { title: '威胁检测' }
          },
          {
            path: 'access-control',
            name: 'AccessControl',
            component: () => import('@/components/security/AccessControl.vue'),
            meta: { title: '访问控制' }
          },
          {
            path: 'compliance',
            name: 'Compliance',
            component: () => import('@/components/security/Compliance.vue'),
            meta: { title: '合规性' }
          }
        ]
      },
      {
        path: 'analytics',
        name: 'AnalyticsParent',
        component: () => import('@/views/Analytics.vue'),
        meta: { title: '数据分析' },
        children: [
          {
            path: 'traffic',
            name: 'TrafficAnalysis',
            component: () => import('@/components/analytics/TrafficAnalysis.vue'),
            meta: { title: '流量分析' }
          },
          {
            path: 'performance',
            name: 'PerformanceAnalysis',
            component: () => import('@/components/analytics/PerformanceAnalysis.vue'),
            meta: { title: '性能分析' }
          },
          {
            path: 'reports',
            name: 'Reports',
            component: () => import('@/components/analytics/Reports.vue'),
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
  const authStore = useAuthStore();
  const tabsStore = useTabsStore();

  // 初始化标签（可选）
  if (!tabsStore.openTabs.length && to.name !== 'Login') {
    tabsStore.initializeTabs();
  }

  // 如果用户已登录但访问登录页，则重定向到仪表盘
  if (to.name === 'Login' && authStore.isAuthenticated) {
    next({ name: 'Dashboard' });
    return;
  }

  // 如果路由需要认证且用户未登录，则重定向到登录页
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login' });
  } else {
    // 添加标签（排除一些不需要显示的路由，如登录页）
    if (to.name !== 'Login') {
      tabsStore.addTab(to);
    }
    next();
  }
});

// 全局后置钩子
router.afterEach((to, from) => {
  // 更新页面标题
  document.title = to.meta.title ? `${to.meta.title} · Quantum Ops` : 'Quantum Ops';
});

export default router;
