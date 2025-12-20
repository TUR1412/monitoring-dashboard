<!-- src/views/Analytics.vue -->
<template>
  <div class="analytics">
    <div class="section-header">
      <div>
        <div class="section-title">数据分析</div>
        <div class="section-subtitle">流量、性能与报表洞察</div>
      </div>
      <span class="pill">分析管线运行中</span>
    </div>
    <div class="analytics-content">
      <nav class="analytics-nav surface-glass">
        <router-link 
          v-for="route in navRoutes" 
          :key="route.path"
          :to="route.path"
          v-slot="{ isActive }"
          custom
        >
          <a 
            class="nav-link"
            :class="{ 'nav-active': isActive }"
          >
            {{ route.name }}
          </a>
        </router-link>
      </nav>
      
      <!-- 使用 Suspense 包装异步组件 -->
      <Suspense>
        <template #default>
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </template>
        <template #fallback>
          <div class="loading-block">
            <div class="loading-spinner"></div>
          </div>
        </template>
      </Suspense>
    </div>
  </div>
</template>

<script setup>
const navRoutes = [
  {
    path: '/dashboard/analytics/traffic',
    name: '流量分析'
  },
  {
    path: '/dashboard/analytics/performance', 
    name: '性能分析'
  },
  {
    path: '/dashboard/analytics/reports',
    name: '报告生成'
  }
]
</script>

<style scoped>
.analytics {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.analytics-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.analytics-nav {
  padding: 0.75rem 1rem;
  border-radius: 14px;
  border: 1px solid var(--border);
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.nav-link {
  padding: 6px 12px;
  border-radius: 999px;
  color: var(--text-2);
  transition: all 0.2s ease;
}

.nav-link:hover {
  background: rgba(34, 211, 238, 0.12);
  color: var(--text-0);
}

.nav-active {
  background: rgba(34, 211, 238, 0.18);
  color: var(--text-0);
  font-weight: 600;
}

.loading-block {
  min-height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(34, 211, 238, 0.3);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
