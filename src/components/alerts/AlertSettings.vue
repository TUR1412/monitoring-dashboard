<!-- src/components/alerts/AlertSettings.vue -->
<template>
  <div class="alert-settings glassmorphism fade-in p-6">
    <h2 class="text-2xl mb-6 animate-text-shimmer">警报设置</h2>
    
    <!-- 通知偏好设置 -->
    <div class="card mb-8 glow-background">
      <h3 class="text-xl mb-4">通知偏好设置</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- 电子邮件通知 -->
        <div class="notification-group">
          <h4 class="text-lg mb-3">电子邮件通知</h4>
          <div class="space-y-3">
            <label class="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                v-model="settings.email.enabled"
                class="form-checkbox"
              >
              <span>启用电子邮件通知</span>
            </label>
            <transition name="fade">
              <div v-if="settings.email.enabled" class="space-y-2">
                <input 
                  type="email" 
                  v-model="settings.email.address"
                  placeholder="电子邮件地址"
                  :class="{'neon-border': isEmailValid}"
                  @input="validateEmail"
                >
                <p v-if="!isEmailValid && settings.email.address" 
                   class="text-sm text-red-500">
                  请输入有效的电子邮件地址
                </p>
              </div>
            </transition>
          </div>
        </div>

        <!-- Slack 通知 -->
        <div class="notification-group">
          <h4 class="text-lg mb-3">Slack 通知</h4>
          <div class="space-y-3">
            <label class="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                v-model="settings.slack.enabled"
                class="form-checkbox"
              >
              <span>启用 Slack 通知</span>
            </label>
            <transition name="fade">
              <div v-if="settings.slack.enabled" class="space-y-2">
                <input 
                  type="text" 
                  v-model="settings.slack.webhook"
                  placeholder="Webhook URL"
                  :class="{'neon-border': isWebhookValid}"
                  @input="validateWebhook"
                >
                <input 
                  type="text" 
                  v-model="settings.slack.channel"
                  placeholder="频道名称"
                  pattern="^#?[a-zA-Z0-9_-]+$"
                >
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>

    <!-- 警报阈值设置 -->
    <div class="card mb-8 glow-background">
      <h3 class="text-xl mb-4">警报阈值设置</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- CPU 使用率阈值 -->
        <div class="threshold-group">
          <h4 class="text-lg mb-3">CPU 使用率</h4>
          <div class="space-y-4">
            <div>
              <label class="block text-sm mb-2">警告阈值 (%)</label>
              <div class="relative">
                <input 
                  type="range"
                  v-model.number="settings.thresholds.cpu.warning"
                  class="w-full"
                  min="0"
                  max="100"
                  step="1"
                >
                <span class="absolute -right-8 top-0">
                  {{ settings.thresholds.cpu.warning }}%
                </span>
              </div>
            </div>
            <div>
              <label class="block text-sm mb-2">严重阈值 (%)</label>
              <div class="relative">
                <input 
                  type="range"
                  v-model.number="settings.thresholds.cpu.critical"
                  class="w-full"
                  :min="settings.thresholds.cpu.warning"
                  max="100"
                  step="1"
                >
                <span class="absolute -right-8 top-0">
                  {{ settings.thresholds.cpu.critical }}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 内存使用率阈值 -->
        <div class="threshold-group">
          <h4 class="text-lg mb-3">内存使用率</h4>
          <div class="space-y-4">
            <div>
              <label class="block text-sm mb-2">警告阈值 (%)</label>
              <div class="relative">
                <input 
                  type="range"
                  v-model.number="settings.thresholds.memory.warning"
                  class="w-full"
                  min="0"
                  max="100"
                  step="1"
                >
                <span class="absolute -right-8 top-0">
                  {{ settings.thresholds.memory.warning }}%
                </span>
              </div>
            </div>
            <div>
              <label class="block text-sm mb-2">严重阈值 (%)</label>
              <div class="relative">
                <input 
                  type="range"
                  v-model.number="settings.thresholds.memory.critical"
                  class="w-full"
                  :min="settings.thresholds.memory.warning"
                  max="100"
                  step="1"
                >
                <span class="absolute -right-8 top-0">
                  {{ settings.thresholds.memory.critical }}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="flex justify-end space-x-4">
      <button 
        class="button-neon"
        @click="resetSettings"
      >
        重置
      </button>
      <button 
        class="button-neon"
        :disabled="!isFormValid"
        @click="saveSettings"
      >
        保存设置
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AlertSettings',
  
  data() {
    return {
      settings: {
        email: {
          enabled: false,
          address: ''
        },
        slack: {
          enabled: false,
          webhook: '',
          channel: ''
        },
        thresholds: {
          cpu: {
            warning: 70,
            critical: 90
          },
          memory: {
            warning: 80,
            critical: 95
          }
        }
      },
      isEmailValid: false,
      isWebhookValid: false,
      originalSettings: null
    }
  },

  computed: {
    isFormValid() {
      if (this.settings.email.enabled && !this.isEmailValid) {
        return false;
      }
      if (this.settings.slack.enabled && !this.isWebhookValid) {
        return false;
      }
      return true;
    }
  },

  created() {
    // 保存初始设置用于重置
    this.originalSettings = JSON.parse(JSON.stringify(this.settings));
    // 从本地存储加载设置
    this.loadSettings();
  },

  methods: {
    validateEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      this.isEmailValid = emailRegex.test(this.settings.email.address);
    },

    validateWebhook() {
      const webhookRegex = /^https:\/\/hooks\.slack\.com\/services\/T[A-Z0-9]+\/B[A-Z0-9]+\/[A-Za-z0-9]+$/;
      this.isWebhookValid = webhookRegex.test(this.settings.slack.webhook);
    },

    loadSettings() {
      const savedSettings = localStorage.getItem('alertSettings');
      if (savedSettings) {
        this.settings = JSON.parse(savedSettings);
        this.validateEmail();
        this.validateWebhook();
      }
    },

    async saveSettings() {
      if (!this.isFormValid) {
        return;
      }

      try {
        // 保存到本地存储
        localStorage.setItem('alertSettings', JSON.stringify(this.settings));
        
        // 这里可以添加与后端API的通信
        // await api.saveAlertSettings(this.settings);
        
        this.$emit('settings-saved', this.settings);
        this.showNotification('设置已成功保存', 'success');
      } catch (error) {
        console.error('保存设置失败:', error);
        this.showNotification('保存设置失败，请稍后重试', 'error');
      }
    },

    resetSettings() {
      this.settings = JSON.parse(JSON.stringify(this.originalSettings));
      this.showNotification('设置已重置为默认值', 'info');
    },

    showNotification(message, type) {
      // 这里可以集成您的通知系统
      alert(message);
    }
  }
}
</script>

<style scoped>
.alert-settings {
  max-width: 1200px;
  margin: 0 auto;
}

.notification-group,
.threshold-group {
  background: var(--card-background-color);
  padding: 1.5rem;
  border-radius: 8px;
}

/* 表单元素样式覆盖 */
input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  background: var(--neon-blue);
  border-radius: 2px;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: var(--neon-pink);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 10px var(--neon-pink);
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .alert-settings {
    padding: 1rem;
  }
  
  .notification-group,
  .threshold-group {
    padding: 1rem;
  }
}
</style>