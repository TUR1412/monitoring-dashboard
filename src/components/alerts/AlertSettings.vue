<!-- src/components/alerts/AlertSettings.vue -->
<template>
  <div class="alert-settings fade-in">
    <header class="header">
      <div>
        <h2 class="page-title">警报设置</h2>
        <p class="subtitle">配置通知偏好与阈值策略，设置即时生效并持久化。</p>
      </div>
      <span class="stat-chip">
        <AppIcon name="dashboard" className="inline-icon" />
        本地保存
      </span>
    </header>

    <div class="card section-card">
      <div class="section-title">
        <span class="icon-badge"><AppIcon name="bell" /></span>
        通知偏好设置
      </div>
      <div class="section-grid">
        <div class="panel">
          <h4>电子邮件通知</h4>
          <label class="toggle-row">
            <input type="checkbox" v-model="settings.email.enabled" />
            <span>启用电子邮件通知</span>
          </label>
          <transition name="fade">
            <div v-if="settings.email.enabled" class="input-stack">
              <BaseInput
                type="email"
                v-model="settings.email.address"
                placeholder="电子邮件地址"
                :invalid="!isEmailValid && settings.email.address"
                @update:modelValue="validateEmail"
              />
              <p v-if="!isEmailValid && settings.email.address" class="hint error">
                请输入有效的电子邮件地址
              </p>
            </div>
          </transition>
        </div>

        <div class="panel">
          <h4>Slack 通知</h4>
          <label class="toggle-row">
            <input type="checkbox" v-model="settings.slack.enabled" />
            <span>启用 Slack 通知</span>
          </label>
          <transition name="fade">
            <div v-if="settings.slack.enabled" class="input-stack">
              <BaseInput
                type="text"
                v-model="settings.slack.webhook"
                placeholder="Webhook URL"
                :invalid="!isWebhookValid && settings.slack.webhook"
                @update:modelValue="validateWebhook"
              />
              <BaseInput
                type="text"
                v-model="settings.slack.channel"
                placeholder="频道名称"
                pattern="^#?[a-zA-Z0-9_-]+$"
              />
            </div>
          </transition>
        </div>
      </div>
    </div>

    <div class="card section-card">
      <div class="section-title">
        <span class="icon-badge"><AppIcon name="dashboard" /></span>
        警报阈值设置
      </div>
      <div class="section-grid">
        <div class="panel">
          <h4>CPU 使用率</h4>
          <div class="range-block">
            <label>警告阈值 (%)</label>
            <div class="range-row">
              <input
                type="range"
                v-model.number="settings.thresholds.cpu.warning"
                min="0"
                max="100"
                step="1"
              />
              <span>{{ settings.thresholds.cpu.warning }}%</span>
            </div>
          </div>
          <div class="range-block">
            <label>严重阈值 (%)</label>
            <div class="range-row">
              <input
                type="range"
                v-model.number="settings.thresholds.cpu.critical"
                :min="settings.thresholds.cpu.warning"
                max="100"
                step="1"
              />
              <span>{{ settings.thresholds.cpu.critical }}%</span>
            </div>
          </div>
        </div>

        <div class="panel">
          <h4>内存使用率</h4>
          <div class="range-block">
            <label>警告阈值 (%)</label>
            <div class="range-row">
              <input
                type="range"
                v-model.number="settings.thresholds.memory.warning"
                min="0"
                max="100"
                step="1"
              />
              <span>{{ settings.thresholds.memory.warning }}%</span>
            </div>
          </div>
          <div class="range-block">
            <label>严重阈值 (%)</label>
            <div class="range-row">
              <input
                type="range"
                v-model.number="settings.thresholds.memory.critical"
                :min="settings.thresholds.memory.warning"
                max="100"
                step="1"
              />
              <span>{{ settings.thresholds.memory.critical }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card section-card">
      <div class="section-title">
        <span class="icon-badge"><AppIcon name="file" /></span>
        策略模板
      </div>
      <div class="template-grid">
        <div class="template-card" v-for="template in templates" :key="template.key">
          <h4>{{ template.title }}</h4>
          <p>{{ template.description }}</p>
          <BaseButton type="default" size="small" @click="applyTemplate(template.key)">
            应用模板
          </BaseButton>
        </div>
      </div>
    </div>

    <div class="card section-card">
      <div class="section-title">
        <span class="icon-badge"><AppIcon name="shield" /></span>
        高级策略
      </div>
      <div class="section-grid">
        <label class="toggle-row">
          <input type="checkbox" v-model="settings.advanced.autoSuppress" />
          <span>启用告警抑制（相同事件 5 分钟内合并）</span>
        </label>
        <label class="toggle-row">
          <input type="checkbox" v-model="settings.advanced.autoEscalation" />
          <span>启用自动升级（连续三次触发提升一级）</span>
        </label>
        <label class="toggle-row">
          <input type="checkbox" v-model="settings.advanced.slaTracking" />
          <span>启用 SLA 跟踪与提醒</span>
        </label>
      </div>
    </div>

    <div class="card section-card">
      <div class="section-title">
        <span class="icon-badge"><AppIcon name="chart" /></span>
        告警规则引擎
      </div>
      <div class="rules-header">
        <span class="stat-chip">
          <AppIcon name="alert" className="inline-icon" />
          已启用 {{ enabledRuleCount }} / {{ rules.length }}
        </span>
        <BaseButton type="primary" @click="openRuleModal">
          <AppIcon name="plus" className="inline-icon" />
          新增规则
        </BaseButton>
      </div>
      <div class="rules-grid">
        <div v-for="rule in rules" :key="rule.id" class="rule-card">
          <div class="rule-top">
            <div>
              <h4>{{ rule.name }}</h4>
              <p>{{ rule.condition }}</p>
            </div>
            <span class="status-pill" :class="rule.enabled ? 'active' : 'inactive'">
              {{ rule.enabled ? '启用' : '停用' }}
            </span>
          </div>
          <div class="rule-meta">
            <span class="meta-chip">{{ rule.severity }}</span>
            <span class="meta-chip">{{ rule.channel }}</span>
            <span class="meta-time">更新 {{ rule.lastUpdated }}</span>
          </div>
          <div class="rule-actions">
            <BaseButton type="default" size="small" @click="toggleRule(rule)">
              {{ rule.enabled ? '停用' : '启用' }}
            </BaseButton>
            <BaseButton type="default" size="small" @click="editRule(rule)">
              编辑
            </BaseButton>
            <BaseButton type="danger" size="small" @click="removeRule(rule)">
              删除
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <div class="actions">
      <BaseButton type="default" @click="resetSettings">重置</BaseButton>
      <BaseButton type="primary" :disabled="!isFormValid" @click="saveSettings">
        保存设置
      </BaseButton>
    </div>

    <BaseModal v-model="showRuleModal" :title="editingRule ? '编辑规则' : '新增规则'" width="520px">
      <div class="rule-form">
        <div class="form-row">
          <label>规则名称</label>
          <BaseInput v-model="ruleForm.name" placeholder="例如：CPU 高危" />
        </div>
        <div class="form-row">
          <label>触发条件</label>
          <BaseInput v-model="ruleForm.condition" placeholder="例如：CPU > 85% 持续 5 分钟" />
        </div>
        <div class="form-row">
          <label>严重程度</label>
          <select v-model="ruleForm.severity">
            <option value="严重">严重</option>
            <option value="高">高</option>
            <option value="中">中</option>
            <option value="低">低</option>
          </select>
        </div>
        <div class="form-row">
          <label>通知通道</label>
          <select v-model="ruleForm.channel">
            <option value="邮件">邮件</option>
            <option value="Slack">Slack</option>
            <option value="短信">短信</option>
            <option value="Webhook">Webhook</option>
          </select>
        </div>
        <label class="toggle-row">
          <input type="checkbox" v-model="ruleForm.enabled" />
          <span>启用该规则</span>
        </label>
        <div class="rule-actions">
          <BaseButton type="default" @click="closeRuleModal">取消</BaseButton>
          <BaseButton type="primary" @click="saveRule">保存规则</BaseButton>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script>
import { useUiStore } from '@/stores/ui'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import AppIcon from '@/components/base/AppIcon.vue'

export default {
  name: 'AlertSettings',
  components: {
    BaseButton,
    BaseInput,
    BaseModal,
    AppIcon
  },

  data() {
    return {
      uiStore: null,
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
        },
        advanced: {
          autoSuppress: true,
          autoEscalation: false,
          slaTracking: true
        }
      },
      isEmailValid: false,
      isWebhookValid: false,
      originalSettings: null,
      templates: [
        {
          key: 'safe',
          title: '稳健模式',
          description: '适合生产环境，降低误报频率'
        },
        {
          key: 'balanced',
          title: '均衡模式',
          description: '默认推荐，平衡告警敏感度'
        },
        {
          key: 'sensitive',
          title: '敏感模式',
          description: '用于压力测试与早期预警'
        }
      ],
      rules: [
        {
          id: 1,
          name: 'CPU 高危',
          condition: 'CPU > 85% 持续 5 分钟',
          severity: '严重',
          channel: '邮件',
          enabled: true,
          lastUpdated: '2025-12-20'
        },
        {
          id: 2,
          name: '内存预警',
          condition: '内存 > 75% 持续 10 分钟',
          severity: '中',
          channel: 'Slack',
          enabled: true,
          lastUpdated: '2025-12-19'
        }
      ],
      showRuleModal: false,
      editingRule: null,
      ruleForm: {
        name: '',
        condition: '',
        severity: '中',
        channel: '邮件',
        enabled: true
      }
    }
  },

  computed: {
    isFormValid() {
      if (this.settings.email.enabled && !this.isEmailValid) {
        return false
      }
      if (this.settings.slack.enabled && !this.isWebhookValid) {
        return false
      }
      return true
    },
    enabledRuleCount() {
      return this.rules.filter(rule => rule.enabled).length
    }
  },

  created() {
    this.uiStore = useUiStore()
    this.originalSettings = JSON.parse(JSON.stringify(this.settings))
    this.loadSettings()
    this.loadRules()
  },

  methods: {
    validateEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      this.isEmailValid = emailRegex.test(this.settings.email.address)
    },

    validateWebhook() {
      const webhookRegex = /^https:\/\/hooks\.slack\.com\/services\/T[A-Z0-9]+\/B[A-Z0-9]+\/[A-Za-z0-9]+$/
      this.isWebhookValid = webhookRegex.test(this.settings.slack.webhook)
    },

    loadSettings() {
      const savedSettings = localStorage.getItem('alertSettings')
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings)
        this.settings = {
          ...this.settings,
          ...parsed,
          advanced: {
            ...this.settings.advanced,
            ...(parsed.advanced || {})
          }
        }
        this.validateEmail()
        this.validateWebhook()
      }
    },

    async saveSettings() {
      if (!this.isFormValid) {
        return
      }

      try {
        localStorage.setItem('alertSettings', JSON.stringify(this.settings))
        this.$emit('settings-saved', this.settings)
        this.uiStore?.pushToast({ type: 'success', message: '设置已成功保存' })
      } catch (error) {
        console.error('保存设置失败:', error)
        this.uiStore?.pushToast({ type: 'error', message: '保存设置失败，请稍后重试' })
      }
    },

    resetSettings() {
      this.settings = JSON.parse(JSON.stringify(this.originalSettings))
      this.validateEmail()
      this.validateWebhook()
      this.uiStore?.pushToast({ type: 'success', message: '设置已重置为默认值' })
    },

    applyTemplate(key) {
      const mapping = {
        safe: { cpu: { warning: 80, critical: 95 }, memory: { warning: 85, critical: 97 } },
        balanced: { cpu: { warning: 70, critical: 90 }, memory: { warning: 80, critical: 95 } },
        sensitive: { cpu: { warning: 60, critical: 80 }, memory: { warning: 70, critical: 90 } }
      }
      const preset = mapping[key]
      if (preset) {
        this.settings.thresholds = JSON.parse(JSON.stringify(preset))
        this.uiStore?.pushToast({ type: 'success', message: '模板已应用' })
      }
    },

    persistRules() {
      localStorage.setItem('alertRules', JSON.stringify(this.rules))
    },

    loadRules() {
      const saved = localStorage.getItem('alertRules')
      if (saved) {
        try {
          this.rules = JSON.parse(saved)
        } catch (error) {
          console.warn('规则加载失败，使用默认配置')
        }
      }
    },

    openRuleModal() {
      this.editingRule = null
      this.ruleForm = {
        name: '',
        condition: '',
        severity: '中',
        channel: '邮件',
        enabled: true
      }
      this.showRuleModal = true
    },

    editRule(rule) {
      this.editingRule = rule
      this.ruleForm = { ...rule }
      this.showRuleModal = true
    },

    closeRuleModal() {
      this.showRuleModal = false
      this.editingRule = null
    },

    saveRule() {
      if (!this.ruleForm.name || !this.ruleForm.condition) {
        this.uiStore?.pushToast({ type: 'error', message: '请填写规则名称与触发条件' })
        return
      }

      const now = new Date().toISOString().slice(0, 10)

      if (this.editingRule) {
        const index = this.rules.findIndex(rule => rule.id === this.editingRule.id)
        if (index !== -1) {
          this.rules.splice(index, 1, {
            ...this.ruleForm,
            id: this.editingRule.id,
            lastUpdated: now
          })
        }
        this.uiStore?.pushToast({ type: 'success', message: '规则已更新' })
      } else {
        this.rules.unshift({
          ...this.ruleForm,
          id: Date.now(),
          lastUpdated: now
        })
        this.uiStore?.pushToast({ type: 'success', message: '规则已添加' })
      }

      this.persistRules()
      this.closeRuleModal()
    },

    toggleRule(rule) {
      rule.enabled = !rule.enabled
      rule.lastUpdated = new Date().toISOString().slice(0, 10)
      this.persistRules()
      this.uiStore?.pushToast({ type: 'success', message: rule.enabled ? '规则已启用' : '规则已停用' })
    },

    async removeRule(rule) {
      const confirmed = await this.uiStore?.requestConfirm(`确定要删除规则 "${rule.name}" 吗？`, '确认')
      if (!confirmed) return

      this.rules = this.rules.filter(item => item.id !== rule.id)
      this.persistRules()
      this.uiStore?.pushToast({ type: 'success', message: '规则已删除' })
    }
  }
}
</script>

<style scoped>
.alert-settings {
  padding: var(--container-padding);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.section-card {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  background: rgba(15, 23, 42, 0.28);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.icon-badge {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(46, 196, 182, 0.18);
  color: var(--neon-blue);
  border: 1px solid rgba(46, 196, 182, 0.4);
}

.section-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.template-card {
  padding: 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background: rgba(15, 23, 42, 0.3);
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.template-card h4 {
  margin: 0;
  font-size: 1rem;
}

.template-card p {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.85rem;
}

.panel {
  padding: 1.2rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background: rgba(15, 23, 42, 0.3);
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.panel h4 {
  margin: 0;
  font-size: 1rem;
}

.toggle-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--text-muted);
}

.input-stack {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.hint {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.hint.error {
  color: var(--neon-red);
}

.range-block {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.range-row {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: var(--text-muted);
}

input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  background: rgba(46, 196, 182, 0.25);
  border-radius: 999px;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: var(--neon-pink);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(244, 162, 97, 0.4);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.rules-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.rules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.rule-card {
  padding: 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background: rgba(15, 23, 42, 0.3);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.rule-top {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.rule-top h4 {
  margin: 0;
  font-size: 1rem;
}

.rule-top p {
  margin: 0.35rem 0 0;
  color: var(--text-muted);
  font-size: 0.85rem;
}

.status-pill {
  padding: 0.2rem 0.7rem;
  border-radius: 999px;
  font-size: 0.75rem;
  border: 1px solid transparent;
  height: fit-content;
}

.status-pill.active {
  color: var(--neon-green);
  border-color: rgba(6, 214, 160, 0.5);
  background: rgba(6, 214, 160, 0.12);
}

.status-pill.inactive {
  color: var(--neon-red);
  border-color: rgba(231, 111, 81, 0.5);
  background: rgba(231, 111, 81, 0.12);
}

.rule-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.meta-chip {
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.7rem;
  border: 1px solid rgba(46, 196, 182, 0.4);
  color: var(--text-strong);
}

.meta-time {
  color: var(--text-muted);
  font-size: 0.75rem;
}

.rule-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.rule-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: var(--text-muted);
}

.form-row select {
  background: rgba(15, 23, 42, 0.3);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  padding: 0.6rem 0.85rem;
  color: var(--text-color);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.inline-icon {
  margin-right: 0.5rem;
}
</style>
