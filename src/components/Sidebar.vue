<!--src\components\Sidebar.vue-->>
<template>
  <aside class="sidebar">
    <!-- Logo 部分 -->
    <div class="logo">
      <img src="@/assets/logo.jpg" alt="Logo" />
      <h2>监控</h2>
    </div>
    
    <!-- 导航项 -->
    <nav class="navigation">
      <!-- 仪表盘导航项 -->
      <SidebarItem
        to="/dashboard"
        label="仪表盘"
        icon="fas fa-tachometer-alt"
        :exact="true"
      />
      <!-- 系统资源导航项 -->
      <SidebarItem
        to="/dashboard/system-resources"
        label="系统资源"
        icon="fas fa-server"
        :children="systemResourcesChildren"
      />
      <!-- 用户管理导航项 -->
      <SidebarItem
        to="/dashboard/user-management"
        label="用户管理" 
        icon="fas fa-users"
        :children="userManagementChildren"
      />
      <!-- 系统警报导航项 -->
      <SidebarItem
        to="/dashboard/system-alerts"
        label="系统警报"
        icon="fas fa-exclamation-triangle"
        :children="systemAlertsChildren"
      />
      <!-- 日志导航项 -->
      <SidebarItem
        to="/dashboard/logs"
        label="日志"
        icon="fas fa-file-alt"
        :children="logsChildren"
      />
      <!-- 用户体验导航项 -->
      <SidebarItem
        to="/dashboard/user-experience"
        label="用户体验"
        icon="fas fa-smile"
        :children="userExperienceChildren"
      />
      <!-- 安全中心导航项 -->
      <SidebarItem
        to="/dashboard/security"
        label="安全中心"
        icon="fas fa-shield-alt"
        :children="securityChildren"
      />
      <!-- 数据分析导航项 -->
      <SidebarItem
        to="/dashboard/analytics"
        label="数据分析"
        icon="fas fa-chart-line"
        :children="analyticsChildren"
      />
    </nav>
    
    <!-- 退出按钮 -->
    <button class="button-neon logout-button">
      <i class="fas fa-sign-out-alt button-icon"></i>
      退出
    </button>
  </aside>
</template>

<script>
import SidebarItem from './SidebarItem.vue'

export default {
  name: 'Sidebar',
  components: {
    SidebarItem
  },
  data() {
    return {
      // 系统资源子路由
      systemResourcesChildren: [
        { to: '/dashboard/system-resources/cpu-usage', label: 'CPU 使用率', icon: 'fas fa-microchip' },
        { to: '/dashboard/system-resources/memory-usage', label: '内存使用率', icon: 'fas fa-memory' },
        { to: '/dashboard/system-resources/disk-usage', label: '磁盘使用情况', icon: 'fas fa-hdd' },
        { to: '/dashboard/system-resources/network', label: '网络监控', icon: 'fas fa-network-wired' },
        // 新增的子路由
        { to: '/dashboard/system-resources/process-monitor', label: '进程监控', icon: 'fas fa-tasks' },
        { to: '/dashboard/system-resources/io-statistics', label: 'I/O 统计', icon: 'fas fa-exchange-alt' },
        { to: '/dashboard/system-resources/gpu-usage', label: 'GPU 使用率', icon: 'fas fa-desktop' },
        { to: '/dashboard/system-resources/temperature', label: '温度监控', icon: 'fas fa-thermometer-half' }
      ],
      // 用户管理子路由
      userManagementChildren: [
        { to: '/dashboard/user-management/add-user', label: '新增用户', icon: 'fas fa-user-plus' },
        { to: '/dashboard/user-management/edit-user', label: '编辑用户', icon: 'fas fa-user-edit' },
        { to: '/dashboard/user-management/roles', label: '角色权限', icon: 'fas fa-user-shield' },
        { to: '/dashboard/user-management/groups', label: '用户组', icon: 'fas fa-users-cog' }
      ],
      // 系统警报子路由
      systemAlertsChildren: [
        { to: '/dashboard/system-alerts/active', label: '活动警报', icon: 'fas fa-bell' },
        { to: '/dashboard/system-alerts/history', label: '历史警报', icon: 'fas fa-history' },
        { to: '/dashboard/system-alerts/settings', label: '警报设置', icon: 'fas fa-cog' }
      ],
      // 日志子路由
      logsChildren: [
        { to: '/dashboard/logs/system', label: '系统日志', icon: 'fas fa-cogs' },
        { to: '/dashboard/logs/security', label: '安全日志', icon: 'fas fa-shield-alt' },
        { to: '/dashboard/logs/audit', label: '审计日志', icon: 'fas fa-clipboard-list' }
      ],
      // 用户体验子路由
      userExperienceChildren: [
        { to: '/dashboard/user-experience/feedback', label: '用户反馈', icon: 'fas fa-comment' },
        { to: '/dashboard/user-experience/surveys', label: '满意度调查', icon: 'fas fa-poll' },
        { to: '/dashboard/user-experience/metrics', label: '用户指标', icon: 'fas fa-chart-bar' }
      ],
      // 安全中心子路由
      securityChildren: [
        { to: '/dashboard/security/threats', label: '威胁检测', icon: 'fas fa-radiation' },
        { to: '/dashboard/security/access-control', label: '访问控制', icon: 'fas fa-lock' },
        { to: '/dashboard/security/compliance', label: '合规审计', icon: 'fas fa-clipboard-check' }
      ],
      // 数据分析子路由
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
/* 侧边栏样式 */
.sidebar {
  width: 220px;
  background-color: var(--dark-purple);
  color: var(--text-color);
  height: 100vh;
  padding: 15px;
  overflow-y: auto;
  border-right: 1px solid var(--neon-blue);
  box-shadow: 2px 0 10px rgba(31, 142, 241, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: width 0.3s, background-color 0.3s;
}

.logo {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.logo img {
  width: 35px;
  height: 35px;
  margin-right: 8px;
  border-radius: 4px;
  border: 2px solid var(--neon-pink);
  box-shadow: 0 0 8px var(--neon-pink), 0 0 16px var(--neon-blue);
}

.logo h2 {
  font-size: 1rem;
  color: var(--text-color);
  text-shadow: 0 0 3px var(--neon-pink), 0 0 6px var(--neon-blue);
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
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.3s, box-shadow 0.3s, color 0.3s;
}

.navigation ul li a:hover,
.navigation ul li a.router-link-active {
  background-color: rgba(31, 142, 241, 0.15);
  box-shadow: 0 0 8px var(--neon-blue), 0 0 16px var(--neon-pink);
}

.navigation ul li a i {
  margin-right: 8px;
  color: var(--neon-blue);
  transition: color 0.3s;
}

.navigation ul li a:hover i,
.navigation ul li a.router-link-active i {
  color: var(--neon-pink);
}

/* 退出按钮样式 */
.logout-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--neon-red);
  color: var(--background-color);
  border: none;
  border-radius: 6px;
  padding: 8px 0;
  font-size: 0.95rem;
  cursor: pointer;
  box-shadow: 0 0 8px var(--neon-red), 0 0 16px var(--neon-blue);
  transition: background-color 0.3s, box-shadow 0.3s, transform 0.3s;
}

.logout-button:hover {
  background-color: var(--neon-blue);
  box-shadow: 0 0 12px var(--neon-red), 0 0 24px var(--neon-blue);
  transform: scale(1.02);
}

.logout-button:active {
  transform: scale(0.98);
  box-shadow: 0 0 4px var(--neon-red), 0 0 8px var(--neon-blue);
}

.logout-button i {
  margin-right: 6px;
}
</style>
