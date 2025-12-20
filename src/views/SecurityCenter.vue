<!-- src/views/SecurityCenter.vue -->
<template>
    <div class="security-center">
      <div class="section-header">
        <div>
          <div class="section-title">安全中心</div>
          <div class="section-subtitle">威胁检测、访问控制与合规审计</div>
        </div>
        <span class="pill">策略已同步</span>
      </div>
      <div class="security-content">
        <nav class="security-nav surface-glass">
          <router-link 
            to="/dashboard/security/threats" 
            class="nav-link"
            :class="{ 'active-link': isActive('threats') }"
          >
            威胁检测
          </router-link>
          <router-link 
            to="/dashboard/security/access-control" 
            class="nav-link"
            :class="{ 'active-link': isActive('access-control') }"
          >
            访问控制
          </router-link>
          <router-link 
            to="/dashboard/security/compliance" 
            class="nav-link"
            :class="{ 'active-link': isActive('compliance') }"
          >
            合规审计
          </router-link>
        </nav>
        <router-view />
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SecurityCenter',
    methods: {
      // 判断当前路由是否激活
      isActive(routeName) {
        return this.$route.path.includes(routeName)
      }
    }
  }
  </script>
  
  <style scoped>
  .security-center {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .security-content {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .security-nav {
    padding: 0.75rem 1rem;
    border-radius: 14px;
    border: 1px solid var(--border);
    display: flex;
    gap: 0.75rem;
  }

  .nav-link {
    padding: 6px 12px;
    text-decoration: none;
    color: var(--text-2);
    border-radius: 999px;
    transition: background-color 0.3s, color 0.3s;
  }

  .nav-link:hover {
    background-color: rgba(34, 211, 238, 0.12);
    color: var(--text-0);
  }

  .active-link {
    color: var(--text-0);
    background-color: rgba(34, 211, 238, 0.18);
  }
  </style>
  
