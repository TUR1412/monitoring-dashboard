<!-- src/components/alerts/AlertSettings.vue -->
<template>
  <div class="alert-settings">
    <div class="section-header">
      <div>
        <div class="section-title">警报设置</div>
        <div class="section-subtitle">通知策略、阈值规则与静默窗口</div>
      </div>
      <span class="pill">最近保存：{{ lastSavedLabel }}</span>
    </div>

    <div class="bento-grid settings-grid">
      <section class="surface-card bento-card bento-span-7">
        <div class="panel-header">
          <div>
            <h3>通知策略</h3>
            <p>根据场景开启邮件、Slack 等通知渠道</p>
          </div>
        </div>
        <div class="panel-grid">
          <div class="panel-block">
            <div class="block-header">
              <div>
                <h4>电子邮件通知</h4>
                <p>用于关键告警与日报推送</p>
              </div>
              <label class="toggle">
                <input type="checkbox" v-model="settings.email.enabled" />
                <span>{{ settings.email.enabled ? '已启用' : '已关闭' }}</span>
              </label>
            </div>
            <div class="block-body">
              <BaseInput
                v-model="settings.email.address"
                type="email"
                placeholder="运维邮箱地址"
                :disabled="!settings.email.enabled"
                :invalid="settings.email.enabled && !isEmailValid"
              />
              <p v-if="settings.email.enabled && !isEmailValid" class="error-text">
                邮箱格式无效，请检查输入
              </p>
            </div>
          </div>

          <div class="panel-block">
            <div class="block-header">
              <div>
                <h4>Slack 通知</h4>
                <p>用于团队协作与即时提醒</p>
              </div>
              <label class="toggle">
                <input type="checkbox" v-model="settings.slack.enabled" />
                <span>{{ settings.slack.enabled ? '已启用' : '已关闭' }}</span>
              </label>
            </div>
            <div class="block-body">
              <BaseInput
                v-model="settings.slack.webhook"
                placeholder="Webhook URL"
                :disabled="!settings.slack.enabled"
                :invalid="settings.slack.enabled && !isWebhookValid"
              />
              <BaseInput
                v-model="settings.slack.channel"
                placeholder="频道名称（如 #ops-alerts）"
                :disabled="!settings.slack.enabled"
              />
              <p v-if="settings.slack.enabled && !isWebhookValid" class="error-text">
                Webhook 地址格式不正确
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="surface-card bento-card bento-span-5">
        <div class="panel-header">
          <div>
            <h3>静默与去重</h3>
            <p>降低噪音、减少重复警报</p>
          </div>
        </div>
        <div class="panel-block compact">
          <label class="toggle">
            <input type="checkbox" v-model="settings.quietHours.enabled" />
            <span>开启静默时段</span>
          </label>
          <div class="quiet-grid">
            <BaseInput
              v-model="settings.quietHours.start"
              type="time"
              :disabled="!settings.quietHours.enabled"
            />
            <BaseInput
              v-model="settings.quietHours.end"
              type="time"
              :disabled="!settings.quietHours.enabled"
            />
          </div>
          <div class="dedupe-row">
            <span>去重窗口（分钟）</span>
            <BaseInput
              v-model="settings.dedupeWindow"
              type="number"
              min="1"
              max="120"
            />
          </div>
          <div class="dedupe-row">
            <span>升级延迟（分钟）</span>
            <BaseInput
              v-model="settings.escalationDelay"
              type="number"
              min="0"
              max="60"
            />
          </div>
        </div>
      </section>

      <section class="surface-card bento-card bento-span-12">
        <div class="panel-header">
          <div>
            <h3>阈值设置</h3>
            <p>定义 CPU 与内存的告警触发门槛</p>
          </div>
        </div>
        <div class="threshold-grid">
          <div class="threshold-item">
            <h4>CPU 使用率</h4>
            <div class="threshold-row">
              <label>警告阈值</label>
              <input
                type="range"
                v-model.number="settings.thresholds.cpu.warning"
                min="0"
                max="100"
                step="1"
              />
              <span>{{ settings.thresholds.cpu.warning }}%</span>
            </div>
            <div class="threshold-row">
              <label>严重阈值</label>
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

          <div class="threshold-item">
            <h4>内存使用率</h4>
            <div class="threshold-row">
              <label>警告阈值</label>
              <input
                type="range"
                v-model.number="settings.thresholds.memory.warning"
                min="0"
                max="100"
                step="1"
              />
              <span>{{ settings.thresholds.memory.warning }}%</span>
            </div>
            <div class="threshold-row">
              <label>严重阈值</label>
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
      </section>

      <section class="surface-card bento-card bento-span-12">
        <div class="panel-header">
          <div>
            <h3>自动化规则</h3>
            <p>快速生成降噪、分级、升级的自动化策略</p>
          </div>
          <BaseButton type="primary" size="small" @click="openRuleModal()">
            <i class="fas fa-plus"></i>
            新建规则
          </BaseButton>
        </div>
        <div class="rules-list">
          <div v-if="!rules.length" class="state-empty">
            暂无自动化规则，点击右上角新增
          </div>
          <div v-else class="rule-row" v-for="rule in rules" :key="rule.id">
            <div>
              <div class="rule-title">{{ rule.name }}</div>
              <div class="rule-meta">
                当 {{ metricLabel(rule.metric) }} {{ rule.comparator }} {{ rule.threshold }}
                <span class="rule-pill">{{ severityLabel(rule.severity) }}</span>
              </div>
            </div>
            <div class="rule-actions">
              <label class="toggle small">
                <input type="checkbox" v-model="rule.enabled" @change="persistAll" />
                <span>{{ rule.enabled ? '启用' : '停用' }}</span>
              </label>
              <BaseButton type="ghost" size="small" @click="openRuleModal(rule)">编辑</BaseButton>
              <BaseButton type="danger" size="small" @click="deleteRule(rule.id)">删除</BaseButton>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div class="action-bar">
      <BaseButton type="ghost" @click="resetSettings">重置为默认</BaseButton>
      <BaseButton type="primary" :disabled="!isFormValid" @click="saveSettings">
        保存设置
      </BaseButton>
    </div>

    <BaseModal v-model="ruleModalOpen" title="自动化规则" width="520px">
      <div class="rule-editor">
        <div class="form-group">
          <span class="form-label">规则名称</span>
          <BaseInput v-model="ruleDraft.name" placeholder="如：CPU 高负载升级" />
        </div>
        <div class="form-group">
          <span class="form-label">监控指标</span>
          <select v-model="ruleDraft.metric">
            <option v-for="option in metricOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
        <div class="rule-matrix">
          <div class="form-group">
            <span class="form-label">条件</span>
            <select v-model="ruleDraft.comparator">
              <option v-for="option in comparatorOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <span class="form-label">阈值</span>
            <BaseInput v-model="ruleDraft.threshold" type="number" min="1" max="1000" />
          </div>
        </div>
        <div class="rule-matrix">
          <div class="form-group">
            <span class="form-label">严重程度</span>
            <select v-model="ruleDraft.severity">
              <option v-for="option in severityOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <span class="form-label">通知渠道</span>
            <select v-model="ruleDraft.channel">
              <option v-for="option in channelOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="modal-actions">
          <BaseButton type="ghost" @click="closeRuleModal">取消</BaseButton>
          <BaseButton type="primary" :disabled="!isRuleValid" @click="saveRule">
            保存规则
          </BaseButton>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import { notify } from '@/utils/notify'

const storageKey = 'monitoring-dashboard:alertSettings'
const rulesKey = 'monitoring-dashboard:alertRules'
const savedAtKey = 'monitoring-dashboard:alertSettings:savedAt'

const canUseStorage = typeof window !== 'undefined' && typeof localStorage !== 'undefined'
const clone = (value) => JSON.parse(JSON.stringify(value))

const defaultSettings = {
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
  quietHours: {
    enabled: false,
    start: '23:00',
    end: '07:00'
  },
  dedupeWindow: 15,
  escalationDelay: 5
}

const defaultRules = [
  {
    id: `rule-${Date.now()}`,
    name: 'CPU 负载升级',
    metric: 'cpu',
    comparator: '>',
    threshold: 85,
    severity: 'critical',
    channel: 'phone',
    enabled: true
  },
  {
    id: `rule-${Date.now() + 1}`,
    name: '内存高水位预警',
    metric: 'memory',
    comparator: '>',
    threshold: 80,
    severity: 'warning',
    channel: 'email',
    enabled: true
  }
]

const loadStorage = (key, fallback) => {
  if (!canUseStorage) return fallback
  const raw = localStorage.getItem(key)
  if (!raw) return fallback
  try {
    return JSON.parse(raw)
  } catch (error) {
    return fallback
  }
}

const mergeSettings = (saved) => ({
  ...defaultSettings,
  ...saved,
  email: {
    ...defaultSettings.email,
    ...(saved?.email || {})
  },
  slack: {
    ...defaultSettings.slack,
    ...(saved?.slack || {})
  },
  thresholds: {
    ...defaultSettings.thresholds,
    ...(saved?.thresholds || {}),
    cpu: {
      ...defaultSettings.thresholds.cpu,
      ...(saved?.thresholds?.cpu || {})
    },
    memory: {
      ...defaultSettings.thresholds.memory,
      ...(saved?.thresholds?.memory || {})
    }
  },
  quietHours: {
    ...defaultSettings.quietHours,
    ...(saved?.quietHours || {})
  }
})

const normalizeRules = (items) => {
  if (!Array.isArray(items)) return clone(defaultRules)
  return items.map(rule => ({
    enabled: true,
    channel: 'email',
    severity: 'warning',
    comparator: '>',
    ...rule
  }))
}

const settings = ref(mergeSettings(loadStorage(storageKey, null)))
const rules = ref(normalizeRules(loadStorage(rulesKey, defaultRules)))
const lastSavedAt = ref(canUseStorage ? localStorage.getItem(savedAtKey) : null)

const ruleModalOpen = ref(false)
const editingRuleId = ref(null)
const ruleDraft = reactive({
  name: '',
  metric: 'cpu',
  comparator: '>',
  threshold: 80,
  severity: 'warning',
  channel: 'email'
})

const metricOptions = [
  { value: 'cpu', label: 'CPU 使用率' },
  { value: 'memory', label: '内存使用率' },
  { value: 'disk', label: '磁盘使用率' },
  { value: 'network', label: '网络延迟' }
]

const severityOptions = [
  { value: 'info', label: '信息' },
  { value: 'warning', label: '警告' },
  { value: 'critical', label: '严重' }
]

const channelOptions = [
  { value: 'email', label: '邮件' },
  { value: 'slack', label: 'Slack' },
  { value: 'sms', label: '短信' },
  { value: 'phone', label: '电话' }
]

const comparatorOptions = [
  { value: '>', label: '大于' },
  { value: '>=', label: '大于等于' },
  { value: '<', label: '小于' },
  { value: '<=', label: '小于等于' }
]

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const webhookRegex = /^https:\/\/hooks\.slack\.com\/services\/T[A-Z0-9]+\/B[A-Z0-9]+\/[A-Za-z0-9]+$/

const isEmailValid = computed(() => {
  if (!settings.value.email.enabled) return true
  return emailRegex.test(settings.value.email.address)
})

const isWebhookValid = computed(() => {
  if (!settings.value.slack.enabled) return true
  return webhookRegex.test(settings.value.slack.webhook)
})

const isFormValid = computed(() => isEmailValid.value && isWebhookValid.value)

const isRuleValid = computed(() => {
  return ruleDraft.name.trim().length > 0 && Number(ruleDraft.threshold) > 0
})

const lastSavedLabel = computed(() => {
  if (!lastSavedAt.value) return '未保存'
  const date = new Date(lastSavedAt.value)
  if (Number.isNaN(date.getTime())) return '未保存'
  return date.toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit' })
})

const persistAll = () => {
  if (!canUseStorage) return
  localStorage.setItem(storageKey, JSON.stringify(settings.value))
  localStorage.setItem(rulesKey, JSON.stringify(rules.value))
  const now = new Date().toISOString()
  lastSavedAt.value = now
  localStorage.setItem(savedAtKey, now)
}

const saveSettings = () => {
  if (!isFormValid.value) {
    notify.error('请完善通知信息后再保存')
    return
  }
  persistAll()
  notify.success('设置已保存')
}

const resetSettings = () => {
  settings.value = clone(defaultSettings)
  notify.info('已恢复默认设置')
  persistAll()
}

const openRuleModal = (rule = null) => {
  if (rule) {
    editingRuleId.value = rule.id
    Object.assign(ruleDraft, clone(rule))
  } else {
    editingRuleId.value = null
    Object.assign(ruleDraft, {
      name: '',
      metric: 'cpu',
      comparator: '>',
      threshold: 80,
      severity: 'warning',
      channel: 'email'
    })
  }
  ruleModalOpen.value = true
}

const closeRuleModal = () => {
  ruleModalOpen.value = false
}

const saveRule = () => {
  if (!isRuleValid.value) return
  if (editingRuleId.value) {
    rules.value = rules.value.map(rule =>
      rule.id === editingRuleId.value ? { ...rule, ...clone(ruleDraft) } : rule
    )
  } else {
    rules.value = [
      ...rules.value,
      {
        id: `rule-${Date.now()}`,
        ...clone(ruleDraft),
        enabled: true
      }
    ]
  }
  persistAll()
  notify.success('规则已保存')
  closeRuleModal()
}

const deleteRule = (ruleId) => {
  rules.value = rules.value.filter(rule => rule.id !== ruleId)
  persistAll()
  notify.info('规则已删除')
}

const metricLabel = (metric) => metricOptions.find(option => option.value === metric)?.label || metric
const severityLabel = (severity) => severityOptions.find(option => option.value === severity)?.label || severity

watch(
  () => settings.value,
  () => persistAll(),
  { deep: true }
)

watch(
  () => rules.value,
  () => persistAll(),
  { deep: true }
)
</script>

<style scoped>
.alert-settings {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.settings-grid {
  align-items: stretch;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.panel-header p {
  color: var(--text-2);
  margin-top: 0.35rem;
}

.panel-grid {
  display: grid;
  gap: 1rem;
}

.panel-block {
  padding: 1rem 1.2rem;
  border-radius: 16px;
  border: 1px solid var(--border);
  background: rgba(148, 163, 184, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.panel-block.compact {
  gap: 0.75rem;
}

.block-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.block-header h4 {
  margin: 0;
}

.block-header p {
  margin-top: 0.3rem;
  color: var(--text-2);
  font-size: 0.85rem;
}

.block-body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.error-text {
  font-size: 0.8rem;
  color: #fecaca;
}

.toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.75rem;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: rgba(148, 163, 184, 0.12);
  font-size: 0.8rem;
  color: var(--text-2);
}

.toggle.small {
  padding: 0.3rem 0.6rem;
  font-size: 0.75rem;
}

.toggle input {
  accent-color: var(--accent-0);
}

.quiet-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.6rem;
}

.dedupe-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  font-size: 0.85rem;
  color: var(--text-2);
}

.threshold-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem;
}

.threshold-item {
  padding: 1rem 1.2rem;
  border-radius: 16px;
  border: 1px solid var(--border);
  background: rgba(148, 163, 184, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.threshold-row {
  display: grid;
  grid-template-columns: 140px 1fr 60px;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-2);
}

.threshold-row input[type="range"] {
  width: 100%;
}

.threshold-row span {
  text-align: right;
  color: var(--text-1);
}

.rules-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.rule-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.2rem;
  border-radius: 16px;
  border: 1px solid var(--border);
  background: rgba(148, 163, 184, 0.08);
}

.rule-title {
  font-weight: 600;
  color: var(--text-0);
}

.rule-meta {
  margin-top: 0.4rem;
  color: var(--text-2);
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rule-pill {
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  border: 1px solid rgba(251, 113, 133, 0.4);
  color: #fecaca;
  font-size: 0.7rem;
}

.rule-actions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.state-empty {
  text-align: center;
  padding: 1.5rem 0;
  color: var(--text-3);
}

.action-bar {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.rule-editor {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-label {
  font-size: 0.8rem;
  color: var(--text-2);
}

.rule-matrix {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

@media (max-width: 1100px) {
  .threshold-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .settings-grid {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  .quiet-grid {
    grid-template-columns: 1fr;
  }

  .rule-row {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
