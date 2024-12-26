<!-- src/components/security/Compliance.vue -->
<template>
  <div class="compliance-dashboard">
    <h2 class="text-2xl font-bold mb-6">合规仪表盘</h2>
    
    <!-- 状态卡片网格 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div v-for="(status, key) in complianceData" 
           :key="key"
           class="compliance-card"
           :class="getCardClass(status.status)">
        <div class="flex flex-col items-center p-6">
          <component 
            :is="status.icon" 
            class="w-8 h-8 mb-4"
            :class="getIconClass(status.status)"
          />
          <h3 class="text-lg font-semibold mb-3">{{ status.title }}</h3>
          <div class="status-indicator" :class="status.status"></div>
          <p class="mt-3 text-center">{{ status.description }}</p>
          <span class="mt-2 text-sm" :class="getStatusTextClass(status.status)">
            {{ getStatusText(status.status) }}
          </span>
        </div>
      </div>
    </div>

    <!-- 合规详细信息 -->
    <div class="compliance-details p-6">
      <h3 class="text-xl font-semibold mb-4">详细合规信息</h3>
      <div class="space-y-4">
        <div v-for="item in complianceDetails" 
             :key="item.id"
             class="detail-item p-4"
             :class="getDetailItemClass(item.status)">
          <div class="flex justify-between items-center">
            <span class="font-medium">{{ item.description }}</span>
            <span :class="getStatusBadgeClass(item.status)">
              {{ item.status }}
            </span>
          </div>
          <div class="mt-2">
            <div class="progress-bar" :style="{ width: item.progress + '%' }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ShieldCheck, AlertTriangle, XCircle } from 'lucide-vue-next'

// 合规数据
const complianceData = ref({
  gdpr: {
    title: 'GDPR 合规',
    status: 'compliant',
    description: '数据保护与隐私合规',
    icon: ShieldCheck,
    progress: 100
  },
  iso: {
    title: 'ISO 27001',
    status: 'in-progress',
    description: '信息安全管理体系认证',
    icon: AlertTriangle,
    progress: 75
  },
  soc: {
    title: 'SOC 2',
    status: 'non-compliant',
    description: '服务机构控制报告',
    icon: XCircle,
    progress: 30
  }
})

// 合规详细信息
const complianceDetails = ref([
  {
    id: 1,
    description: '数据加密标准',
    status: 'compliant',
    progress: 100
  },
  {
    id: 2,
    description: '访问控制策略',
    status: 'in-progress',
    progress: 75
  },
  {
    id: 3,
    description: '安全审计日志',
    status: 'non-compliant',
    progress: 30
  }
])

// 获取卡片的样式
const getCardClass = (status) => ({
  'border border-green-400': status === 'compliant',
  'border border-yellow-400': status === 'in-progress',
  'border border-red-400': status === 'non-compliant'
})

// 获取图标的样式
const getIconClass = (status) => ({
  'text-green-400': status === 'compliant',
  'text-yellow-400': status === 'in-progress',
  'text-red-400': status === 'non-compliant'
})

// 根据状态获取合规文本
const getStatusText = (status) => ({
  compliant: '完全合规',
  'in-progress': '进行中',
  'non-compliant': '未合规'
}[status])

// 获取状态文本的样式
const getStatusTextClass = (status) => ({
  'text-green-400': status === 'compliant',
  'text-yellow-400': status === 'in-progress',
  'text-red-400': status === 'non-compliant'
})

// 获取详细项的样式
const getDetailItemClass = (status) => ({
  'border-l-4 border-green-400': status === 'compliant',
  'border-l-4 border-yellow-400': status === 'in-progress',
  'border-l-4 border-red-400': status === 'non-compliant'
})

// 获取状态徽章的样式
const getStatusBadgeClass = (status) => {
  const baseClasses = 'px-3 py-1 rounded-full text-sm'
  const statusClasses = {
    compliant: 'bg-green-100 bg-opacity-20 text-green-400',
    'in-progress': 'bg-yellow-100 bg-opacity-20 text-yellow-400',
    'non-compliant': 'bg-red-100 bg-opacity-20 text-red-400'
  }
  return `${baseClasses} ${statusClasses[status]}`
}
</script>

<style scoped>
.compliance-dashboard {
  padding: 1.5rem;
  background: var(--card-background-color);
  border-radius: 0.5rem;
}

.compliance-card {
  background: rgba(44, 62, 80, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.compliance-card:hover {
  transform: translateY(-4px);
}

.status-indicator {
  width: 1rem;
  height: 1rem;
  border-radius: 9999px;
}

.status-indicator.compliant {
  background-color: rgb(74, 222, 128);
  box-shadow: 0 0 10px rgb(74, 222, 128);
}

.status-indicator.in-progress {
  background-color: rgb(250, 204, 21);
  box-shadow: 0 0 10px rgb(250, 204, 21);
}

.status-indicator.non-compliant {
  background-color: rgb(248, 113, 113);
  box-shadow: 0 0 10px rgb(248, 113, 113);
}

.detail-item {
  background: rgba(44, 62, 80, 0.4);
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.progress-bar {
  height: 0.25rem;
  border-radius: 9999px;
  background: linear-gradient(90deg, 
    var(--neon-blue) 0%,
    var(--neon-pink) 100%
  );
}

.compliance-details {
  background: rgba(44, 62, 80, 0.3);
  border-radius: 0.5rem;
}

@keyframes fadeIn {
  from { 
    opacity: 0; 
    transform: translateY(10px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}
</style>
