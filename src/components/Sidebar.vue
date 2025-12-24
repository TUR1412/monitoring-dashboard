<!-- src/components/Sidebar.vue -->
<template>
  <aside class="sidebar">
    <!-- Logo 部分 -->
    <div class="logo">
      <img :src="logoUrl" alt="Quantum Ops Logo" />
      <div class="logo-text">
        <h2>Quantum Ops</h2>
        <span>系统态势中心</span>
      </div>
    </div>
    
    <!-- 导航项 -->
    <nav class="navigation">
      <!-- 仪表盘导航项 -->
      <SidebarItem
        to="/dashboard"
        label="仪表盘"
        icon="dashboard"
        :exact="true"
      />
      <!-- 系统资源导航项 -->
      <SidebarItem
        to="/dashboard/system-resources"
        label="系统资源"
        icon="server"
        :children="systemResourcesChildren"
      />
      <!-- 用户管理导航项 -->
      <SidebarItem
        to="/dashboard/user-management"
        label="用户管理" 
        icon="users"
        :children="userManagementChildren"
      />
      <!-- 系统警报导航项 -->
      <SidebarItem
        to="/dashboard/system-alerts"
        label="系统警报"
        icon="alert"
        :children="systemAlertsChildren"
      />
      <!-- 日志导航项 -->
      <SidebarItem
        to="/dashboard/logs"
        label="日志"
        icon="file"
        :children="logsChildren"
      />
      <!-- 用户体验导航项 -->
      <SidebarItem
        to="/dashboard/user-experience"
        label="用户体验"
        icon="smile"
        :children="userExperienceChildren"
      />
      <!-- 安全中心导航项 -->
      <SidebarItem
        to="/dashboard/security"
        label="安全中心"
        icon="shield"
        :children="securityChildren"
      />
      <!-- 数据分析导航项 -->
      <SidebarItem
        to="/dashboard/analytics"
        label="数据分析"
        icon="chart"
        :children="analyticsChildren"
      />
    </nav>
    
    <!-- 退出按钮 -->
    <BaseButton type="danger" class="logout-button" @click="handleLogout">
      <AppIcon name="logout" className="inline-icon" />
      退出
    </BaseButton>
  </aside>
</template>

<script>
import SidebarItem from './SidebarItem.vue'
import { useAuthStore } from '@/stores/auth'
import { useTabsStore } from '@/stores/tabs'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/base/BaseButton.vue'
import logoUrl from '@/assets/logo.svg'
import AppIcon from '@/components/base/AppIcon.vue'

export default {
  name: 'Sidebar',
  components: {
    SidebarItem,
    BaseButton,
    AppIcon
  },
  setup() {
    const authStore = useAuthStore()
    const tabsStore = useTabsStore()
    const router = useRouter()

    const handleLogout = async () => {
      authStore.logout()
      tabsStore.clearTabs()
      router.push({ name: 'Login' })
    }

    return {
      handleLogout,
      logoUrl
    }
  },
  data() {
    return {
      // 系统资源子路由
      systemResourcesChildren: [
        { to: '/dashboard/system-resources/cpu-usage', label: 'CPU 使用率', icon: '' },
        { to: '/dashboard/system-resources/memory-usage', label: '内存使用率', icon: '' },
        { to: '/dashboard/system-resources/disk-usage', label: '磁盘使用情况', icon: '' },
        { to: '/dashboard/system-resources/network', label: '网络监控', icon: '' },
        // 新增的子路由
        { to: '/dashboard/system-resources/process-monitor', label: '进程监控', icon: '' },
        { to: '/dashboard/system-resources/io-statistics', label: 'I/O 统计', icon: '' },
        { to: '/dashboard/system-resources/gpu-usage', label: 'GPU 使用率', icon: '' },
        { to: '/dashboard/system-resources/temperature', label: '温度监控', icon: '' }
      ],
      // 用户管理子路由
      userManagementChildren: [
        { to: '/dashboard/user-management/add-user', label: '新增用户', icon: '' },
        { to: '/dashboard/user-management/edit-user', label: '编辑用户', icon: '' },
        { to: '/dashboard/user-management/roles', label: '角色权限', icon: '' },
        { to: '/dashboard/user-management/groups', label: '用户组', icon: '' }
      ],
      // 系统警报子路由
      systemAlertsChildren: [
        { to: '/dashboard/system-alerts/active', label: '活动警报', icon: '' },
        { to: '/dashboard/system-alerts/history', label: '历史警报', icon: '' },
        { to: '/dashboard/system-alerts/settings', label: '警报设置', icon: '' }
      ],
      // 日志子路由
      logsChildren: [
        { to: '/dashboard/logs/system', label: '系统日志', icon: '' },
        { to: '/dashboard/logs/security', label: '安全日志', icon: '' },
        { to: '/dashboard/logs/audit', label: '审计日志', icon: '' }
      ],
      // 用户体验子路由
      userExperienceChildren: [
        { to: '/dashboard/user-experience/feedback', label: '用户反馈', icon: '' },
        { to: '/dashboard/user-experience/surveys', label: '满意度调查', icon: '' },
        { to: '/dashboard/user-experience/metrics', label: '用户指标', icon: '' }
      ],
      // 安全中心子路由
      securityChildren: [
        { to: '/dashboard/security/threats', label: '威胁检测', icon: '' },
        { to: '/dashboard/security/access-control', label: '访问控制', icon: '' },
        { to: '/dashboard/security/compliance', label: '合规审计', icon: '' }
      ],
      // 数据分析子路由
      analyticsChildren: [
        { to: '/dashboard/analytics/traffic', label: '流量分析', icon: '' },
        { to: '/dashboard/analytics/performance', label: '性能分析', icon: '' },
        { to: '/dashboard/analytics/reports', label: '报告生成', icon: '' }
      ]
    }
  }
}
</script>

<style scoped>
/* 侧边栏样式 */
.sidebar {
  width: 260px;
  background: rgba(14, 21, 34, 0.9);
  color: var(--text-color);
  height: 100%;
  padding: 20px;
  overflow-y: auto;
  border-right: 1px solid rgba(46, 196, 182, 0.25);
  box-shadow: 4px 0 20px rgba(9, 16, 28, 0.35);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: width 0.3s, background-color 0.3s;
}

:global(.light) .sidebar {
  background: rgba(255, 255, 255, 0.9);
  color: var(--text-color);
}

.logo {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 0.75rem;
}

.logo img {
  width: 35px;
  height: 35px;
  border-radius: 4px;
  border: 2px solid rgba(244, 162, 97, 0.6);
  box-shadow: 0 0 12px rgba(46, 196, 182, 0.3);
}

.logo-text {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.logo-text h2 {
  font-size: 1.05rem;
  color: var(--text-strong);
  margin: 0;
}

.logo-text span {
  font-size: 0.75rem;
  color: var(--text-muted);
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
  justify-content: center;
}

.inline-icon {
  margin-right: 0.5rem;
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid rgba(46, 196, 182, 0.2);
  }
}
</style>
