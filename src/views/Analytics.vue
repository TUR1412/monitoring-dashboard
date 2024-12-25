<!-- src/views/Analytics.vue -->
<template>
    <div class="analytics">
      <h1 class="text-2xl font-bold mb-4">数据分析</h1>
      <div class="analytics-content">
        <nav class="analytics-nav">
          <router-link 
            to="/dashboard/analytics/traffic" 
            class="nav-link"
            :class="{ 'active-link': isActive('traffic') }"
          >
            流量分析
          </router-link>
          <router-link 
            to="/dashboard/analytics/performance" 
            class="nav-link"
            :class="{ 'active-link': isActive('performance') }"
          >
            性能分析
          </router-link>
          <router-link 
            to="/dashboard/analytics/reports" 
            class="nav-link"
            :class="{ 'active-link': isActive('reports') }"
          >
            报告生成
          </router-link>
        </nav>
        <router-view />
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Analytics',
    methods: {
      // 判断当前路由是否激活
      isActive(routeName) {
        return this.$route.path.includes(routeName)
      }
    }
  }
  </script>
  
  <style scoped>
  .analytics {
    padding: 20px;
  }
  
  .analytics-content {
    margin-top: 20px;
  }
  
  .analytics-nav {
    margin-bottom: 20px;
    padding: 10px 0;
    border-bottom: 1px solid #eee;
    display: flex;
    gap: 20px;
  }
  
  .nav-link {
    padding: 5px 10px;
    text-decoration: none;
    color: #666;
    border-radius: 4px;
    transition: background-color 0.3s, color 0.3s;
  }
  
  .nav-link:hover {
    background-color: #f0f0f0;
  }
  
  .active-link {
    color: #42b983;
    border-bottom: 2px solid #42b983;
  }
  </style>
  