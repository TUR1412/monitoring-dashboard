<!-- src/components/security/Compliance.vue -->
<template>
    <div class="compliance">
      <h2 class="text-xl font-semibold mb-4">合规仪表盘</h2>
      <div class="compliance-status grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="compliance-card bg-white p-4 rounded-lg shadow flex flex-col items-center">
          <h3 class="text-lg font-medium mb-2">GDPR 状态</h3>
          <div :class="['status-indicator', complianceStatus.gdpr]"></div>
          <p>{{ getComplianceText('gdpr') }}</p>
        </div>
        <div class="compliance-card bg-white p-4 rounded-lg shadow flex flex-col items-center">
          <h3 class="text-lg font-medium mb-2">ISO 27001</h3>
          <div :class="['status-indicator', complianceStatus.iso]"></div>
          <p>{{ getComplianceText('iso') }}</p>
        </div>
        <div class="compliance-card bg-white p-4 rounded-lg shadow flex flex-col items-center">
          <h3 class="text-lg font-medium mb-2">SOC 2</h3>
          <div :class="['status-indicator', complianceStatus.soc]"></div>
          <p>{{ getComplianceText('soc') }}</p>
        </div>
      </div>
      <!-- 合规详情 -->
      <div class="compliance-details">
        <h3 class="text-lg font-semibold mb-2">详细信息</h3>
        <ul class="list-disc pl-5">
          <li v-for="item in complianceDetails" :key="item.id">
            {{ item.description }} - <strong>{{ item.status }}</strong>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue'
  
  export default {
    name: 'Compliance',
    setup() {
      const complianceStatus = ref({
        gdpr: 'compliant', // 'compliant', 'in-progress', 'non-compliant'
        iso: 'compliant',
        soc: 'in-progress'
      })
  
      const complianceDetails = ref([
        { id: 1, description: 'GDPR 数据保护', status: '合规' },
        { id: 2, description: 'ISO 27001 安全管理', status: '合规' },
        { id: 3, description: 'SOC 2 审计', status: '进行中' }
        // 添加更多样本数据
      ])
  
      // 获取合规文本
      const getComplianceText = (key) => {
        const texts = {
          gdpr: '合规',
          iso: '合规',
          soc: '进行中'
        }
        return texts[key] || '未知'
      }
  
      onMounted(() => {
        // 这里可以添加实际的数据获取逻辑
      })
  
      return {
        complianceStatus,
        complianceDetails,
        getComplianceText
      }
    }
  }
  </script>
  
  <style scoped>
  .compliance {
    padding: 20px;
  }
  
  .compliance-status {
    display: flex;
    gap: 20px;
  }
  
  .compliance-card {
    flex: 1;
    text-align: center;
  }
  
  .status-indicator {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin: 0 auto 10px;
  }
  
  .status-indicator.compliant {
    background-color: #28a745;
  }
  
  .status-indicator.in-progress {
    background-color: #ffc107;
  }
  
  .status-indicator.non-compliant {
    background-color: #dc3545;
  }
  
  .compliance-details ul {
    list-style-type: disc;
  }
  </style>
  