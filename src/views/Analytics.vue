<!-- src/views/Analytics.vue -->
<template>
  <div class="analytics">
    <h1 class="text-2xl font-bold mb-4">数据分析</h1>
    <div class="analytics-content">
      <!-- 使用数组循环渲染导航链接 -->
      <nav class="flex gap-4 border-b border-gray-200 mb-6">
        <router-link 
          v-for="route in navRoutes" 
          :key="route.path"
          :to="route.path"
          v-slot="{ isActive }"
          custom
        >
          <a 
            class="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200"
            :class="{ 'text-blue-600 border-b-2 border-blue-600 font-medium': isActive }"
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
          <div class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
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