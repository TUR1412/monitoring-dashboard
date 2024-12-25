<!-- src/components/security/ThreatDetection.vue -->
<template>
    <div class="threat-detection">
      <h2 class="text-xl font-semibold mb-4">威胁检测</h2>
      <div class="threat-summary grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="threat-card high bg-red-100 text-red-800 p-4 rounded-lg shadow flex flex-col items-center">
          <h3 class="text-lg font-medium">高优先级</h3>
          <span class="count text-3xl">{{ highPriority }}</span>
        </div>
        <div class="threat-card medium bg-yellow-100 text-yellow-800 p-4 rounded-lg shadow flex flex-col items-center">
          <h3 class="text-lg font-medium">中优先级</h3>
          <span class="count text-3xl">{{ mediumPriority }}</span>
        </div>
        <div class="threat-card low bg-green-100 text-green-800 p-4 rounded-lg shadow flex flex-col items-center">
          <h3 class="text-lg font-medium">低优先级</h3>
          <span class="count text-3xl">{{ lowPriority }}</span>
        </div>
      </div>
      <!-- 威胁检测详情 -->
      <div class="threat-details">
        <h3 class="text-lg font-semibold mb-2">详细信息</h3>
        <ul class="list-disc pl-5">
          <li v-for="threat in threats" :key="threat.id">
            {{ threat.description }} - <strong>{{ threat.status }}</strong>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue'
  
  export default {
    name: 'ThreatDetection',
    setup() {
      const highPriority = ref(0) // 高优先级威胁数
      const mediumPriority = ref(2) // 中优先级威胁数
      const lowPriority = ref(5) // 低优先级威胁数
  
      const threats = ref([
        { id: 1, description: '检测到异常登录尝试', status: '未解决' },
        { id: 2, description: '发现可疑IP地址', status: '已解决' },
        // 添加更多样本数据
      ])
  
      onMounted(() => {
        // 这里可以添加实际的数据获取逻辑
      })
  
      return {
        highPriority,
        mediumPriority,
        lowPriority,
        threats
      }
    }
  }
  </script>
  
  <style scoped>
  .threat-detection {
    padding: 20px;
  }
  
  .threat-summary {
    display: flex;
    gap: 20px;
  }
  
  .threat-card {
    flex: 1;
    text-align: center;
  }
  
  .threat-details {
    margin-top: 20px;
  }
  </style>
  