<!-- src/components/alerts/AlertSettings.vue -->
<template>
    <div class="alert-settings">
      <h2 class="text-2xl font-cyberpunk mb-4">警报设置</h2>
      
      <!-- 通知偏好设置 -->
      <div class="settings-section mb-8">
        <h3 class="text-xl font-semibold mb-4">通知偏好设置</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 电子邮件通知 -->
          <div class="notification-channel">
            <h4 class="text-lg font-medium mb-2">电子邮件通知</h4>
            <div class="space-y-2">
              <label class="flex items-center">
                <input type="checkbox" class="form-checkbox" v-model="settings.email.enabled">
                <span class="ml-2">启用电子邮件通知</span>
              </label>
              <div v-if="settings.email.enabled" class="ml-6 space-y-2">
                <input 
                  type="email" 
                  v-model="settings.email.address"
                  placeholder="电子邮件地址"
                  class="w-full p-2 border rounded cyberpunk-input"
                >
              </div>
            </div>
          </div>
  
          <!-- Slack 通知 -->
          <div class="notification-channel">
            <h4 class="text-lg font-medium mb-2">Slack 通知</h4>
            <div class="space-y-2">
              <label class="flex items-center">
                <input type="checkbox" class="form-checkbox" v-model="settings.slack.enabled">
                <span class="ml-2">启用 Slack 通知</span>
              </label>
              <div v-if="settings.slack.enabled" class="ml-6 space-y-2">
                <input 
                  type="text" 
                  v-model="settings.slack.webhook"
                  placeholder="Webhook URL"
                  class="w-full p-2 border rounded cyberpunk-input"
                >
                <input 
                  type="text" 
                  v-model="settings.slack.channel"
                  placeholder="频道名称"
                  class="w-full p-2 border rounded cyberpunk-input"
                >
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- 警报阈值设置 -->
      <div class="settings-section mb-8">
        <h3 class="text-xl font-semibold mb-4">警报阈值设置</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- CPU 使用率阈值 -->
          <div class="threshold-setting">
            <h4 class="text-lg font-medium mb-2">CPU 使用率</h4>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-1">警告阈值 (%)</label>
                <input 
                  type="number" 
                  v-model="settings.thresholds.cpu.warning"
                  class="w-full p-2 border rounded cyberpunk-input"
                  min="0"
                  max="100"
                >
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">严重阈值 (%)</label>
                <input 
                  type="number" 
                  v-model="settings.thresholds.cpu.critical"
                  class="w-full p-2 border rounded cyberpunk-input"
                  min="0"
                  max="100"
                >
              </div>
            </div>
          </div>
  
          <!-- 内存使用率阈值 -->
          <div class="threshold-setting">
            <h4 class="text-lg font-medium mb-2">内存使用率</h4>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-1">警告阈值 (%)</label>
                <input 
                  type="number" 
                  v-model="settings.thresholds.memory.warning"
                  class="w-full p-2 border rounded cyberpunk-input"
                  min="0"
                  max="100"
                >
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">严重阈值 (%)</label>
                <input 
                  type="number" 
                  v-model="settings.thresholds.memory.critical"
                  class="w-full p-2 border rounded cyberpunk-input"
                  min="0"
                  max="100"
                >
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- 操作按钮 -->
      <div class="flex justify-end space-x-4">
        <button class="btn-cancel">取消</button>
        <button 
          class="btn-save"
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
      }
    }
  },
  methods: {
    // 保存设置
    saveSettings() {
      // TODO: 实现设置保存逻辑
      console.log('正在保存设置:', this.settings)
      alert('设置已保存！')
    }
  }
}
</script>

<style scoped>
.alert-settings {
  padding: 1.25rem;
  background-color: var(--background-color, #1e1e1e);
  color: var(--text-color, #ffffff);
}

.settings-section {
  padding: 1rem;
  background-color: #2c3e50;
  border: 1px solid #555;
  border-radius: 0.375rem;
}

.settings-section h3 {
  margin-bottom: 1rem;
  color: #ff6ec7;
}

.notification-channel h4,
.threshold-setting h4 {
  margin-bottom: 0.5rem;
  color: #ff6ec7;
}

.notification-channel input,
.threshold-setting input,
.cyberpunk-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #555;
  border-radius: 0.375rem;
  background-color: #2c2c2c;
  color: #ffffff;
}

.notification-channel input::placeholder,
.threshold-setting input::placeholder {
  color: #a0aec0;
}

.btn-cancel {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  background-color: #ff6ec7;
  color: #1a1a1a;
  box-shadow: 0 0 10px #ff6ec7, 0 0 20px #1f8ef1;
  transition: background-color 0.2s, box-shadow 0.2s;
}

.btn-cancel:hover {
  background-color: #1f8ef1;
  box-shadow: 0 0 15px #ff6ec7, 0 0 25px #1f8ef1;
}

.btn-save {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  background-color: #00ff99;
  color: #1a1a1a;
  box-shadow: 0 0 10px #00ff99, 0 0 20px #ff6ec7;
  transition: background-color 0.2s, box-shadow 0.2s;
}

.btn-save:hover {
  background-color: #ff6ec7;
  box-shadow: 0 0 15px #00ff99, 0 0 25px #ff6ec7;
}

.flex {
  display: flex;
}

.justify-end {
  justify-content: flex-end;
}

.space-x-4 > * + * {
  margin-left: 1rem;
}

/* 响应式布局优化 */
@media (max-width: 768px) {
  .grid-cols-2 {
    grid-template-columns: 1fr;
  }
}
</style>
