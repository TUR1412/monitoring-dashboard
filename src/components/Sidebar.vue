<!--src\components\Sidebar.vue-->
<template>
  <aside class="sidebar surface-glass" :class="{ 'is-compact': compact }">
    <div class="logo">
      <div class="logo-mark">
        <img src="@/assets/logo.svg" alt="Logo" />
      </div>
      <h2>监控</h2>
      <button class="sidebar-toggle" @click="toggleSidebar" aria-label="切换侧边栏">
        <i class="fas fa-sliders-h" aria-hidden="true"></i>
      </button>
    </div>

    <nav class="navigation">
      <SidebarItem
        to="/dashboard"
        label="仪表盘"
        icon="fas fa-tachometer-alt"
        :exact="true"
      />
      <SidebarItem
        to="/dashboard/system-resources"
        label="系统资源"
        icon="fas fa-server"
        :children="systemResourcesChildren"
      />
      <SidebarItem
        to="/dashboard/user-management"
        label="用户管理"
        icon="fas fa-users"
        :children="userManagementChildren"
      />
      <SidebarItem
        to="/dashboard/system-alerts"
        label="系统警报"
        icon="fas fa-exclamation-triangle"
        :children="systemAlertsChildren"
      />
      <SidebarItem
        to="/dashboard/logs"
        label="日志"
        icon="fas fa-file-alt"
        :children="logsChildren"
      />
      <SidebarItem
        to="/dashboard/user-experience"
        label="用户体验"
        icon="fas fa-smile"
        :children="userExperienceChildren"
      />
      <SidebarItem
        to="/dashboard/security"
        label="安全中心"
        icon="fas fa-shield-alt"
        :children="securityChildren"
      />
      <SidebarItem
        to="/dashboard/analytics"
        label="数据分析"
        icon="fas fa-chart-line"
        :children="analyticsChildren"
      />
    </nav>

    <button class="button-neon logout-button" @click="handleLogout">
      <i class="fas fa-sign-out-alt button-icon"></i>
      <span v-if="!compact">退出</span>
    </button>
  </aside>
</template>

<script>
import SidebarItem from './SidebarItem.vue'
import { useMonitorStore } from '@/stores/monitorStore'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { notify } from '@/utils/notify'

export default {
  name: 'Sidebar',
  components: {
    SidebarItem
  },
  setup() {
    const store = useMonitorStore()
    const router = useRouter()
    const compact = computed(() => store.uiPreferences.compactSidebar)
    const toggleSidebar = () => {
      store.setUiPreferences({ compactSidebar: !store.uiPreferences.compactSidebar })
    }
    const handleLogout = async () => {
      try {
        await notify.confirm('确认退出当前账号？', '退出登录')
        store.logout()
        router.push({ name: 'Login' })
      } catch (error) {
        // 用户取消
      }
    }

    return {
      compact,
      toggleSidebar,
      handleLogout,
      systemResourcesChildren: [
        { to: '/dashboard/system-resources/cpu-usage', label: 'CPU 使用率', icon: 'fas fa-microchip' },
        { to: '/dashboard/system-resources/memory-usage', label: '内存使用率', icon: 'fas fa-memory' },
        { to: '/dashboard/system-resources/disk-usage', label: '磁盘使用情况', icon: 'fas fa-hdd' },
        { to: '/dashboard/system-resources/network', label: '网络监控', icon: 'fas fa-network-wired' },
        { to: '/dashboard/system-resources/process-monitor', label: '进程监控', icon: 'fas fa-tasks' },
        { to: '/dashboard/system-resources/io-statistics', label: 'I/O 统计', icon: 'fas fa-exchange-alt' },
        { to: '/dashboard/system-resources/gpu-usage', label: 'GPU 使用率', icon: 'fas fa-desktop' },
        { to: '/dashboard/system-resources/temperature', label: '温度监控', icon: 'fas fa-thermometer-half' }
      ],
      userManagementChildren: [
        { to: '/dashboard/user-management/add-user', label: '新增用户', icon: 'fas fa-user-plus' },
        { to: '/dashboard/user-management/edit-user', label: '编辑用户', icon: 'fas fa-user-edit' },
        { to: '/dashboard/user-management/roles', label: '角色权限', icon: 'fas fa-user-shield' },
        { to: '/dashboard/user-management/groups', label: '用户组', icon: 'fas fa-users-cog' }
      ],
      systemAlertsChildren: [
        { to: '/dashboard/system-alerts/active', label: '活动警报', icon: 'fas fa-bell' },
        { to: '/dashboard/system-alerts/history', label: '历史警报', icon: 'fas fa-history' },
        { to: '/dashboard/system-alerts/settings', label: '警报设置', icon: 'fas fa-cog' }
      ],
      logsChildren: [
        { to: '/dashboard/logs/system', label: '系统日志', icon: 'fas fa-cogs' },
        { to: '/dashboard/logs/security', label: '安全日志', icon: 'fas fa-shield-alt' },
        { to: '/dashboard/logs/audit', label: '审计日志', icon: 'fas fa-clipboard-list' }
      ],
      userExperienceChildren: [
        { to: '/dashboard/user-experience/feedback', label: '用户反馈', icon: 'fas fa-comment' },
        { to: '/dashboard/user-experience/surveys', label: '满意度调查', icon: 'fas fa-poll' },
        { to: '/dashboard/user-experience/metrics', label: '用户指标', icon: 'fas fa-chart-bar' }
      ],
      securityChildren: [
        { to: '/dashboard/security/threats', label: '威胁检测', icon: 'fas fa-radiation' },
        { to: '/dashboard/security/access-control', label: '访问控制', icon: 'fas fa-lock' },
        { to: '/dashboard/security/compliance', label: '合规审计', icon: 'fas fa-clipboard-check' }
      ],
      analyticsChildren: [
        { to: '/dashboard/analytics/traffic', label: '流量分析', icon: 'fas fa-chart-area' },
        { to: '/dashboard/analytics/performance', label: '性能分析', icon: 'fas fa-tachometer-fast' },
        { to: '/dashboard/analytics/reports', label: '报告生成', icon: 'fas fa-file-alt' }
      ]
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 260px;
  color: var(--text-color);
  height: 100%;
  padding: 16px;
  overflow-y: hidden;
  border-right: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: width 0.3s ease;
}

.sidebar.is-compact {
  width: 90px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  position: relative;
}

.logo-mark {
  width: 42px;
  height: 42px;
  padding: 6px;
  border-radius: 12px;
  background: rgba(34, 211, 238, 0.12);
  border: 1px solid rgba(34, 211, 238, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo img {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.logo h2 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
  white-space: nowrap;
}

.sidebar-toggle {
  margin-left: auto;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: rgba(148, 163, 184, 0.12);
  border: 1px solid var(--border);
  color: var(--text-1);
  cursor: pointer;
}

.sidebar.is-compact .logo h2 {
  display: none;
}

.sidebar.is-compact .sidebar-toggle {
  margin-left: 0;
}

.navigation {
  flex-grow: 1;
}

.navigation ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.navigation ul li {
  margin-bottom: 12px;
}

.navigation ul li a {
  display: flex;
  align-items: center;
  color: var(--text-color);
  text-decoration: none;
  font-size: 0.95rem;
  padding: 10px 12px;
  border-radius: 10px;
  transition: background-color 0.2s, box-shadow 0.2s, color 0.2s;
}

.navigation ul li a:hover,
.navigation ul li a.router-link-active {
  background-color: rgba(34, 211, 238, 0.12);
  box-shadow: 0 0 16px rgba(34, 211, 238, 0.12);
}

.navigation ul li a i {
  margin-right: 8px;
  color: var(--accent-0);
  transition: color 0.2s;
}

.navigation ul li a:hover i,
.navigation ul li a.router-link-active i {
  color: var(--accent-1);
}

.logout-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
  font-size: 0.95rem;
}

.logout-button:hover {
  transform: translateY(-1px);
}

.logout-button:active {
  transform: scale(0.98);
}

.logout-button i {
  margin-right: 6px;
}

.sidebar.is-compact .navigation ul li a span,
.sidebar.is-compact .logout-button span {
  display: none;
}

.sidebar.is-compact .navigation ul li a {
  justify-content: center;
}

.sidebar.is-compact .navigation ul li a i {
  margin-right: 0;
}
</style>
