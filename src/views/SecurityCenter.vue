<!-- src/views/SecurityCenter.vue -->
<template>
    <div class="security-center">
      <h1 class="text-2xl font-bold mb-4">安全中心</h1>
      <div class="security-content">
        <nav class="security-nav">
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
    padding: 20px;
  }
  
  .security-content {
    margin-top: 20px;
  }
  
  .security-nav {
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
  