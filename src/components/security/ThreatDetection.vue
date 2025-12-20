<!-- src/components/security/ThreatDetection.vue -->
<template>
  <div class="threat-detection-container glassmorphism p-8 rounded-xl border border-opacity-20" 
       :style="{ borderColor: 'var(--neon-blue)' }">
    <!-- 标题区域 -->
    <div class="flex justify-between items-center mb-8">
      <div class="flex items-center space-x-4">
        <h2 class="text-3xl font-bold tracking-wider animate-text-shimmer"
            :style="{ 
              color: 'var(--neon-pink)',
              textShadow: '0 0 10px var(--neon-pink), 0 0 20px var(--neon-blue)'
            }">
          威胁检测系统
        </h2>
        <div class="status-indicator flex items-center px-4 py-2 rounded-full glassmorphism">
          <span class="mr-3 text-sm" :style="{ color: 'var(--neon-green)' }">实时监控中</span>
          <div class="flex space-x-1">
            <div v-for="n in 3" :key="n" 
                 class="w-2 h-2 rounded-full"
                 :class="['animate-pulse', `delay-${(n-1)*200}`]"
                 :style="{ backgroundColor: 'var(--neon-green)' }">
            </div>
          </div>
        </div>
      </div>
      <div class="timestamp text-sm" :style="{ color: 'var(--gray-400)' }">
        最后更新: {{ currentTime }}
      </div>
    </div>

    <!-- 威胁等级卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
      <div v-for="(priority, index) in priorities" 
           :key="index"
           class="threat-card glassmorphism p-6 rounded-xl transition-all duration-500 hover:scale-105"
           :class="priority.cardClass">
        <div class="flex flex-col items-center">
          <div class="icon-wrapper mb-4">
            <div class="w-12 h-12 rounded-full flex items-center justify-center"
                 :style="{ 
                   backgroundColor: `${priority.color}20`,
                   border: `2px solid ${priority.color}`
                 }">
              <i class="text-2xl" :class="priority.icon" :style="{ color: priority.color }"></i>
            </div>
          </div>
          <h3 class="text-xl font-medium mb-3" :style="{ color: priority.color }">
            {{ priority.label }}
          </h3>
          <div class="count-wrapper relative">
            <span class="text-5xl font-bold mb-4 transition-all duration-300"
                  :style="{ color: priority.color }">
              {{ priority.count }}
            </span>
            <span class="absolute -top-2 -right-4 text-sm"
                  :style="{ color: `${priority.color}80` }">
              {{ priority.trend }}
            </span>
          </div>
          <div class="w-full h-1 rounded-full mt-4 overflow-hidden">
            <div class="h-full animate-pulse"
                 :style="{ 
                   backgroundColor: priority.color,
                   width: `${priority.percentage}%`
                 }">
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 威胁详情列表 -->
    <div class="threat-details glassmorphism p-6 rounded-xl">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-semibold tracking-wide"
            :style="{ 
              color: 'var(--neon-blue)',
              textShadow: '0 0 8px var(--neon-blue)'
            }">
          威胁详情
        </h3>
        <BaseButton
          type="ghost"
          size="small"
          class="refresh-button px-6 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2"
          :class="{ 'animate-spin': isRefreshing }"
          @click="refreshThreats"
        >
          <i class="fas fa-rotate text-lg"></i>
          <span>刷新数据</span>
        </BaseButton>
      </div>

      <div class="threat-list space-y-4">
        <div v-for="threat in threats" 
             :key="threat.id"
             class="threat-item p-4 rounded-xl transition-all duration-300 hover:translate-x-2"
             :class="getThreatItemClass(threat.severity)">
          <div class="flex justify-between items-start">
            <div class="flex items-start space-x-4">
              <div class="threat-indicator">
                <div class="w-3 h-3 rounded-full animate-pulse"
                     :style="{ backgroundColor: getThreatColor(threat.severity) }">
                </div>
              </div>
              <div class="threat-content">
                <div class="text-lg mb-1">{{ threat.description }}</div>
                <div class="text-sm" :style="{ color: 'var(--gray-400)' }">
                  IP: {{ threat.ip }} | 来源: {{ threat.source }}
                </div>
              </div>
            </div>
            <div class="flex flex-col items-end space-y-2">
              <span class="threat-status px-4 py-1 rounded-full text-sm font-medium"
                    :class="getStatusClass(threat.status)">
                {{ threat.status }}
              </span>
              <span class="text-sm" :style="{ color: 'var(--gray-400)' }">
                {{ formatDate(threat.timestamp) }}
              </span>
            </div>
          </div>
          <div class="threat-actions mt-4 flex justify-end space-x-3">
            <BaseButton
              v-for="action in threat.actions"
              :key="action.label"
              type="ghost"
              size="small"
              class="action-button px-3 py-1 rounded-md text-sm transition-all duration-300"
              :style="{
                borderColor: getThreatColor(threat.severity),
                color: getThreatColor(threat.severity)
              }"
            >
              {{ action.label }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, onMounted } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'

const currentTime = ref(new Date().toLocaleString('zh-CN'))
const isRefreshing = ref(false)

const priorities = ref([
  {
    label: '高危威胁',
    count: 3,
    trend: '+2',
    percentage: 75,
    color: 'var(--neon-red)',
    cardClass: 'high-priority',
    icon: 'fas fa-radiation'
  },
  {
    label: '中度威胁',
    count: 7,
    trend: '-1',
    percentage: 45,
    color: 'var(--neon-yellow)',
    cardClass: 'medium-priority',
    icon: 'fas fa-bolt'
  },
  {
    label: '低危威胁',
    count: 12,
    trend: '+5',
    percentage: 25,
    color: 'var(--neon-green)',
    cardClass: 'low-priority',
    icon: 'fas fa-shield-virus'
  }
])

const threats = ref([
  {
    id: 1,
    description: '检测到未授权的系统访问尝试',
    severity: 'high',
    status: '需立即处理',
    timestamp: new Date().getTime() - 1000 * 60 * 30,
    ip: '192.168.1.100',
    source: '外部网络',
    actions: [
      { label: '隔离终端', type: 'isolate' },
      { label: '查看详情', type: 'view' }
    ]
  },
  {
    id: 2,
    description: '发现可疑的数据传输活动',
    severity: 'medium',
    status: '处理中',
    timestamp: new Date().getTime() - 1000 * 60 * 60,
    ip: '10.0.0.15',
    source: '内部网络',
    actions: [
      { label: '阻断连接', type: 'block' },
      { label: '查看详情', type: 'view' }
    ]
  },
  {
    id: 3,
    description: '检测到系统配置异常变更',
    severity: 'low',
    status: '已解决',
    timestamp: new Date().getTime() - 1000 * 60 * 120,
    ip: '172.16.0.8',
    source: '本地终端',
    actions: [
      { label: '恢复配置', type: 'restore' },
      { label: '查看详情', type: 'view' }
    ]
  }
])

const getThreatItemClass = (severity) => {
  return {
    'border border-opacity-20 backdrop-blur-sm': true,
    'border-red-500 bg-red-500 bg-opacity-5': severity === 'high',
    'border-yellow-500 bg-yellow-500 bg-opacity-5': severity === 'medium',
    'border-green-500 bg-green-500 bg-opacity-5': severity === 'low'
  }
}

const getThreatColor = (severity) => {
  const colors = {
    high: 'var(--neon-red)',
    medium: 'var(--neon-yellow)',
    low: 'var(--neon-green)'
  }
  return colors[severity]
}

const getStatusClass = (status) => {
  return {
    'bg-opacity-20 border border-opacity-20': true,
    'bg-red-500 border-red-500 text-red-400': status === '需立即处理',
    'bg-yellow-500 border-yellow-500 text-yellow-400': status === '处理中',
    'bg-green-500 border-green-500 text-green-400': status === '已解决'
  }
}

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString('zh-CN', {
    hour12: false,
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const refreshThreats = async () => {
  isRefreshing.value = true
  
  // 模拟数据刷新
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  priorities.value = priorities.value.map(p => ({
    ...p,
    count: Math.floor(Math.random() * 15),
    trend: `${Math.random() > 0.5 ? '+' : '-'}${Math.floor(Math.random() * 5)}`,
    percentage: Math.floor(Math.random() * 100)
  }))
  
  currentTime.value = new Date().toLocaleString('zh-CN')
  isRefreshing.value = false
}

// 自动刷新
let timerId = null

onMounted(() => {
  timerId = setInterval(() => {
    currentTime.value = new Date().toLocaleString('zh-CN')
  }, 1000)
})

onBeforeUnmount(() => {
  if (timerId) clearInterval(timerId)
})
</script>
<style scoped>
.threat-detection-container {
  background: rgba(44, 62, 80, 0.15);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}

.threat-card {
  position: relative;
  overflow: hidden;
}

.threat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  animation: shine 3s infinite;
}

@keyframes shine {
  0% {
    left: -100%;
  }
  100% {
    left: 200%;
  }
}

.high-priority {
  box-shadow: 0 0 20px rgba(255, 7, 58, 0.2);
}

.medium-priority {
  box-shadow: 0 0 20px rgba(255, 221, 87, 0.2);
}

.low-priority {
  box-shadow: 0 0 20px rgba(0, 255, 153, 0.2);
}

.refresh-button {
  background: transparent;
  border: 1px solid var(--neon-blue);
  color: var(--neon-blue);
  font-weight: 500;
}

.refresh-button:hover {
  background: var(--neon-blue);
  color: var(--background-color);
  box-shadow: 0 0 15px var(--neon-blue);
  transform: translateY(-2px);
}

.action-button {
  background: transparent;
  border: 1px solid;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 10px currentColor;
}

.status-indicator {
  border: 1px solid var(--neon-green);
  box-shadow: 0 0 10px rgba(0, 255, 153, 0.2);
}

.threat-item {
  transition: all 0.3s ease;
}

.threat-item:hover {
  transform: translateX(8px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Animation delay classes */
.delay-0 {
  animation-delay: 0ms;
}

.delay-200 {
  animation-delay: 200ms;
}

.delay-400 {
  animation-delay: 400ms;
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

.animate-text-shimmer {
  animation: textShimmer 3s ease-in-out infinite;
}

@keyframes textShimmer {
  0% {
    text-shadow: 0 0 10px var(--neon-pink), 0 0 20px var(--neon-blue);
  }
  50% {
    text-shadow: 0 0 20px var(--neon-pink), 0 0 30px var(--neon-blue);
  }
  100% {
    text-shadow: 0 0 10px var(--neon-pink), 0 0 20px var(--neon-blue);
  }
}

/* Additional component-specific styles */
.threat-details {
  transition: transform 0.3s ease-out;
}

.threat-details:hover {
  transform: translateY(-4px);
}

.threat-content {
  position: relative;
  z-index: 1;
}

.threat-indicator {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.threat-indicator::after {
  content: '';
  position: absolute;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, currentColor 0%, transparent 70%);
  opacity: 0.1;
  pointer-events: none;
}

.count-wrapper {
  display: inline-flex;
  align-items: baseline;
}

.icon-wrapper {
  position: relative;
}

.icon-wrapper::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: inherit;
  background: inherit;
  filter: blur(8px);
  opacity: 0.4;
  z-index: -1;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .threat-detection-container {
    padding: 1rem;
  }
  
  .threat-card {
    margin-bottom: 1rem;
  }
  
  .count-wrapper {
    font-size: 0.9em;
  }
}
</style>
