<!-- src/components/security/AccessControl.vue -->
<template>
  <div class="access-control">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      <!-- 访问策略区域 -->
      <div class="policy-section card glassmorphism p-6">
        <h2 class="section-title">
          <span class="icon-wrapper">
            <i class="fas fa-shield-alt neon-icon" aria-hidden="true"></i>
          </span>
          访问策略配置
        </h2>
        
        <div class="policies-grid">
          <div v-for="policy in policies" 
               :key="policy.id" 
               class="policy-card"
               :class="policy.status === '启用' ? 'enabled' : 'disabled'">
            <div class="card-glitch-effect"></div>
            <div class="policy-content">
              <div class="policy-header">
                <span class="policy-name">{{ policy.name }}</span>
                <span class="policy-type">{{ policy.type }}</span>
              </div>
              <p class="policy-description">{{ policy.description }}</p>
              <div class="policy-footer">
                <span class="policy-updated">最后更新: {{ policy.lastUpdated }}</span>
                <BaseButton
                  type="ghost"
                  size="small"
                  class="cyber-button"
                  :class="policy.status === '启用' ? 'enabled' : 'disabled'"
                  @click="togglePolicy(policy.id)"
                >
                  <span class="button-content">{{ policy.status }}</span>
                  <span class="button-glitch"></span>
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 活动会话区域 -->
      <div class="sessions-section card glassmorphism p-6">
        <div class="section-header">
          <h2 class="section-title">
            <span class="icon-wrapper">
              <i class="fas fa-user-shield neon-icon" aria-hidden="true"></i>
            </span>
            活动会话
          </h2>
          <BaseButton type="ghost" size="small" class="cyber-button refresh" @click="refreshSessions">
            <span class="button-content">
              <i class="fas fa-rotate refresh-icon" aria-hidden="true"></i>
              刷新
            </span>
          </BaseButton>
        </div>
        
        <div class="session-cards">
          <div v-for="session in activeSessions" 
               :key="session.id" 
               class="session-card">
            <div class="session-header">
              <div class="user-info">
                <span class="user-avatar">
                  <i class="fas fa-user-circle" aria-hidden="true"></i>
                </span>
                <div class="user-details">
                  <h4 class="username">{{ session.username }}</h4>
                  <span class="user-ip">{{ session.ip }}</span>
                </div>
              </div>
              <BaseButton type="danger" size="small" class="cyber-button danger" @click="terminateSession(session.id)">
                <span class="button-content">终止会话</span>
              </BaseButton>
            </div>
            <div class="session-details">
              <div class="detail-item">
                <span class="detail-label">登录位置</span>
                <span class="detail-value">{{ session.location }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">登录时间</span>
                <span class="detail-value">{{ formatTime(session.loginTime) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { format } from 'date-fns'
import BaseButton from '@/components/base/BaseButton.vue'

// 策略数据
const policies = ref([
  { 
    id: 1, 
    name: '管理员访问权限', 
    type: '系统级',
    status: '启用',
    description: '允许管理员完全访问所有系统资源和配置',
    lastUpdated: '2024-04-26'
  },
  { 
    id: 2, 
    name: '用户访问权限', 
    type: '应用级',
    status: '启用',
    description: '标准用户的基本系统访问权限配置',
    lastUpdated: '2024-04-25'
  },
  { 
    id: 3, 
    name: '访客访问权限', 
    type: '受限级',
    status: '禁用',
    description: '临时访客的有限系统访问权限',
    lastUpdated: '2024-04-24'
  },
  { 
    id: 4, 
    name: '远程访问权限', 
    type: '网络级',
    status: '启用',
    description: '允许授权用户进行远程系统访问',
    lastUpdated: '2024-04-23'
  }
])

// 会话数据
const activeSessions = ref([
  { 
    id: 1, 
    username: 'admin', 
    ip: '192.168.1.10', 
    location: '办公室', 
    loginTime: '2024-04-27 08:00:00',
    deviceType: '桌面终端'
  },
  { 
    id: 2, 
    username: 'user1', 
    ip: '192.168.1.11', 
    location: '远程', 
    loginTime: '2024-04-27 09:30:00',
    deviceType: '移动设备'
  },
  { 
    id: 3, 
    username: 'developer', 
    ip: '192.168.1.12', 
    location: '开发区', 
    loginTime: '2024-04-27 10:15:00',
    deviceType: '工作站'
  }
])

// 功能方法
const togglePolicy = (id) => {
  const policy = policies.value.find(p => p.id === id)
  if (policy) {
    policy.status = policy.status === '启用' ? '禁用' : '启用'
  }
}

const terminateSession = (id) => {
  activeSessions.value = activeSessions.value.filter(session => session.id !== id)
}

const refreshSessions = async () => {
  // 模拟异步刷新
  await new Promise(resolve => setTimeout(resolve, 1000))
}

const formatTime = (time) => {
  return format(new Date(time), 'yyyy-MM-dd HH:mm:ss')
}

onMounted(() => {
  refreshSessions()
})
</script>

<style scoped>
.access-control {
  @apply p-8;
}

/* 标题样式 */
.section-title {
  @apply text-2xl font-bold mb-8 flex items-center;
  color: var(--neon-pink);
  text-shadow: 0 0 10px var(--neon-pink),
               0 0 20px var(--neon-pink),
               0 0 30px var(--neon-blue);
  animation: textPulse 2s infinite;
}

@keyframes textPulse {
  0%, 100% { text-shadow: 0 0 10px var(--neon-pink), 0 0 20px var(--neon-pink); }
  50% { text-shadow: 0 0 15px var(--neon-pink), 0 0 30px var(--neon-pink), 0 0 45px var(--neon-blue); }
}

/* 图标样式 */
.icon-wrapper {
  @apply inline-flex items-center justify-center mr-3;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 110, 199, 0.1);
  border: 2px solid var(--neon-pink);
  box-shadow: 0 0 10px var(--neon-pink);
}

.neon-icon {
  @apply text-2xl;
  filter: drop-shadow(0 0 5px var(--neon-pink));
}

/* 策略卡片样式 */
.policies-grid {
  @apply grid gap-6;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.policy-card {
  @apply p-6 rounded-lg relative overflow-hidden;
  background: linear-gradient(135deg, 
    rgba(44, 62, 80, 0.8),
    rgba(44, 62, 80, 0.6));
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.policy-card.enabled {
  border-left: 5px solid var(--neon-green);
}

.policy-card.disabled {
  border-left: 5px solid var(--neon-red);
}

.card-glitch-effect {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300%;
  height: 300%;
  background: rgba(255, 0, 0, 0.2);
  filter: blur(10px);
  transform: translate(-50%, -50%);
  animation: glitch 1.5s infinite linear;
}

@keyframes glitch {
  0% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.05); }
  100% { transform: translate(-50%, -50%) scale(1); }
}

.policy-footer {
  @apply flex justify-between items-center mt-4;
}

.policy-updated {
  @apply text-sm text-gray-400;
}

/* 按钮样式 */
.cyber-button {
  position: relative;
  display: inline-block;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  color: var(--neon-pink);
  background: transparent;
  border: 2px solid var(--neon-pink);
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 0 10px var(--neon-pink);
  transition: 0.3s;
}

.cyber-button:hover {
  color: var(--neon-blue);
  border-color: var(--neon-blue);
}

.cyber-button .button-glitch {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--neon-pink);
  opacity: 0.2;
  animation: glitch 1.5s infinite linear;
}

.cyber-button.refresh {
  @apply bg-gray-900 hover:bg-gray-800;
}

.cyber-button.danger {
  @apply bg-red-900 hover:bg-red-800;
}
</style>
