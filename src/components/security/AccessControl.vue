<!-- src/components/security/AccessControl.vue -->
<template>
    <div class="access-control">
      <h2 class="text-xl font-semibold mb-4">访问控制</h2>
      <div class="access-policies mb-6">
        <h3 class="text-lg font-medium mb-2">访问策略</h3>
        <ul class="list-disc pl-5">
          <li v-for="policy in policies" :key="policy.id">
            {{ policy.name }} - <strong>{{ policy.status }}</strong>
          </li>
        </ul>
      </div>
      <div class="active-sessions">
        <h3 class="text-lg font-medium mb-2">活动会话</h3>
        <table class="w-full bg-white rounded-lg shadow">
          <thead>
            <tr class="bg-gray-50">
              <th class="px-4 py-2">用户名</th>
              <th class="px-4 py-2">IP地址</th>
              <th class="px-4 py-2">位置</th>
              <th class="px-4 py-2">登录时间</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="session in activeSessions" :key="session.id" class="border-b">
              <td class="px-4 py-2">{{ session.username }}</td>
              <td class="px-4 py-2">{{ session.ip }}</td>
              <td class="px-4 py-2">{{ session.location }}</td>
              <td class="px-4 py-2">{{ session.loginTime }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue'
  
  export default {
    name: 'AccessControl',
    setup() {
      const policies = ref([
        { id: 1, name: '管理员访问权限', status: '启用' },
        { id: 2, name: '用户访问权限', status: '启用' },
        { id: 3, name: '访客访问权限', status: '禁用' }
      ])
  
      const activeSessions = ref([
        { id: 1, username: 'admin', ip: '192.168.1.10', location: '办公室', loginTime: '2024-04-27 08:00:00' },
        { id: 2, username: 'user1', ip: '192.168.1.11', location: '远程', loginTime: '2024-04-27 09:30:00' }
        // 添加更多样本数据
      ])
  
      onMounted(() => {
        // 这里可以添加实际的数据获取逻辑
      })
  
      return {
        policies,
        activeSessions
      }
    }
  }
  </script>
  
  <style scoped>
  .access-control {
    padding: 20px;
  }
  
  .access-policies ul {
    list-style-type: disc;
  }
  
  .active-sessions table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .active-sessions th, .active-sessions td {
    padding: 12px;
    text-align: left;
  }
  
  .active-sessions th {
    background-color: #f3f4f6;
  }
  
  .active-sessions tr:hover {
    background-color: #f9fafb;
  }
  </style>
  