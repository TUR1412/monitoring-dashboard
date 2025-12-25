<!-- src/components/Header.vue -->
<template>
  <header :class="['dashboard-header', theme]" v-bind="$attrs">
    <div class="header-content glassmorphism">
      <div class="header-title">
        <div class="brand-line">
          <h1 class="title animate-text-shimmer">
            {{ title }}
          </h1>
          <span class="version-badge">v{{ version }}</span>
        </div>
        <p class="subtitle" v-if="subtitle">{{ subtitle }}</p>
        <div class="header-status">
          <span class="stat-chip">
            <span class="status-dot"></span>
            系统在线
          </span>
          <span
            class="stat-chip"
            :title="refreshStatusTitle"
          >
            <span
              class="status-dot"
              :class="{ off: !runtimeStore.isRunning, busy: runtimeStore.refreshing }"
            ></span>
            实时刷新 {{ refreshIntervalLabel }}
          </span>
          <span class="stat-chip">今日告警 {{ alertCount }}</span>
        </div>
      </div>
      
      <div class="header-actions">
        <div class="user-info" v-if="user">
          <span class="user-name">{{ user.name }}</span>
          <img 
            v-if="!avatarError"
            :src="userAvatar" 
            :alt="user?.name ? `${user.name} 的头像` : '用户头像'"
            class="user-avatar"
            @error="handleAvatarError"
          >
          <div v-else class="avatar-placeholder">
            {{ user?.name?.[0]?.toUpperCase() || 'U' }}
          </div>
        </div>
        
        <div class="actions-group">
          <div class="refresh-group">
            <button
              class="action-button"
              :class="{ 'active': runtimeStore.autoRefreshEnabled }"
              @click="toggleAutoRefresh"
              :title="autoRefreshButtonTitle"
              type="button"
              :aria-pressed="runtimeStore.autoRefreshEnabled ? 'true' : 'false'"
            >
              <AppIcon name="refresh" className="action-icon" :class="{ 'icon-spin': runtimeStore.refreshing }" />
              <span class="button-text">{{ autoRefreshButtonText }}</span>
            </button>

            <select
              class="refresh-select"
              v-model.number="refreshIntervalMs"
              :disabled="!runtimeStore.autoRefreshEnabled"
              aria-label="刷新间隔"
              title="刷新间隔"
            >
              <option :value="2000">2s</option>
              <option :value="5000">5s</option>
              <option :value="10000">10s</option>
              <option :value="15000">15s</option>
            </select>
          </div>

          <button 
            class="action-button"
            :class="{ 'active': theme === 'dark' }"
            @click="toggleTheme"
            :title="themeButtonTitle"
            type="button"
            :aria-pressed="theme === 'dark' ? 'true' : 'false'"
          >
            <AppIcon :name="themeIconName" className="action-icon" />
            <span class="button-text">{{ themeButtonText }}</span>
          </button>
          
          <button 
            class="action-button logout-button"
            @click="handleLogout"
            :title="logoutButtonTitle"
            type="button"
          >
            <AppIcon name="logout" className="action-icon" />
            <span class="button-text">退出</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { useTabsStore } from '@/stores/tabs'
import { useAlertsStore } from '@/stores/alerts'
import { useRuntimeStore } from '@/stores/runtime'
import { useUiStore } from '@/stores/ui'
import { useRouter } from 'vue-router'
import AppIcon from '@/components/base/AppIcon.vue'
import { formatDateTimeWithSeconds } from '@/utils/datetime'

// Props
defineProps({
  title: {
    type: String,
    default: 'Quantum Ops'
  },
  subtitle: {
    type: String,
    default: '实时态势 · 风险预警 · 性能洞察'
  },
  version: {
    type: String,
    default: (typeof __APP_VERSION__ === 'string' && __APP_VERSION__) ? __APP_VERSION__ : '0.0.0'
  }
})

// Emits
const emit = defineEmits(['theme-changed', 'logout'])

import defaultAvatar from '@/assets/default-avatar.svg'

// Store and Router
const authStore = useAuthStore()
const themeStore = useThemeStore()
const tabsStore = useTabsStore()
const alertsStore = useAlertsStore()
const runtimeStore = useRuntimeStore()
const uiStore = useUiStore()
const router = useRouter()

// State
const theme = computed(() => themeStore.theme)
const user = computed(() => authStore.user)
const avatarError = ref(false)
const alertCount = computed(() => alertsStore.activeAlerts.length)

const userAvatar = computed(() => {
  if (user.value?.avatar?.startsWith('http')) {
    return user.value.avatar
  } else if (user.value?.avatar) {
    return new URL(`../assets/${user.value.avatar}`, import.meta.url).href
  }
  return defaultAvatar
})

// Computed
const themeIconName = computed(() => (theme.value === 'light' ? 'moon' : 'sun'))

const themeButtonText = computed(() => 
  theme.value === 'light' ? '深色模式' : '浅色模式'
)

const themeButtonTitle = computed(() => 
  `切换至${theme.value === 'light' ? '深色' : '浅色'}模式`
)

const logoutButtonTitle = computed(() => '退出系统')

const refreshIntervalMs = computed({
  get: () => runtimeStore.refreshIntervalMs,
  set: (value) => runtimeStore.setRefreshIntervalMs(value)
})

const refreshIntervalLabel = computed(() => {
  const seconds = Math.max(1, Math.round(Number(runtimeStore.refreshIntervalMs || 0) / 1000))
  return `${seconds}s`
})

const refreshStatusTitle = computed(() => {
  if (!runtimeStore.autoRefreshEnabled) return '实时刷新已关闭'
  if (!runtimeStore.lastRefreshAt) return '实时刷新已开启（尚未刷新）'
  return `上次刷新：${formatDateTimeWithSeconds(runtimeStore.lastRefreshAt)}`
})

const autoRefreshButtonText = computed(() =>
  runtimeStore.autoRefreshEnabled ? '暂停刷新' : '启动刷新'
)

const autoRefreshButtonTitle = computed(() =>
  runtimeStore.autoRefreshEnabled ? '暂停实时刷新' : '启动实时刷新'
)

// Methods
const toggleTheme = () => {
  themeStore.toggleTheme()
  emit('theme-changed', themeStore.theme)
}

const toggleAutoRefresh = () => {
  runtimeStore.toggleAutoRefresh()
}

const handleLogout = async () => {
  authStore.logout()
  tabsStore.clearTabs()
  emit('logout')
  try {
    await router.push({ name: 'Login' })
  } catch (_error) {
    uiStore.pushToast({ type: 'error', message: '退出失败，请重试' })
  }
}

const handleAvatarError = () => {
  avatarError.value = true
}
</script>

<style scoped>
.dashboard-header {
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  height: var(--header-height);
  background-color: rgba(12, 17, 24, 0.7);
  backdrop-filter: blur(18px);
  transition: all 0.3s ease;
}

:global(.light) .dashboard-header {
  background-color: rgba(255, 255, 255, 0.78);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 2rem;
  gap: 1rem;
}

.header-title {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.brand-line {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.title {
  display: flex;
  align-items: center;
  margin: 0;
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--heading-color);
  letter-spacing: 0.05em;
}

.version-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background-color: rgba(46, 196, 182, 0.15);
  color: var(--text-strong);
  border-radius: 999px;
  font-weight: normal;
  border: 1px solid rgba(46, 196, 182, 0.35);
}

.subtitle {
  font-size: 0.875rem;
  color: var(--paragraph-color);
  margin: 0;
}

.header-status {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--neon-green);
  box-shadow: 0 0 8px rgba(6, 214, 160, 0.6);
}

.status-dot.off {
  background: rgba(148, 163, 184, 0.8);
  box-shadow: none;
}

.status-dot.busy {
  box-shadow: 0 0 12px rgba(46, 196, 182, 0.72);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-name {
  font-size: 0.875rem;
  color: var(--text-color);
}

.user-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--neon-blue);
  transition: border-color 0.3s ease;
}

.user-avatar:hover {
  border-color: var(--neon-pink);
}

.avatar-placeholder {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: var(--neon-blue);
  color: var(--text-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1rem;
  border: 2px solid var(--neon-pink);
}

.actions-group {
  display: flex;
  gap: 0.75rem;
}

.refresh-group {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.refresh-select {
  height: 36px;
  padding: 0 0.75rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-strong);
  font-size: 0.875rem;
  cursor: pointer;
  outline: none;
}

.refresh-select:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.icon-spin {
  animation: headerSpin 0.9s linear infinite;
}

@keyframes headerSpin {
  to {
    transform: rotate(360deg);
  }
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 999px;
  background-color: rgba(255, 255, 255, 0.08);
  color: var(--text-strong);
  font-size: 0.875rem;
  cursor: pointer;
  transition:
    transform var(--dur-normal) var(--ease-out),
    background-color var(--dur-normal) var(--ease-out),
    box-shadow var(--dur-normal) var(--ease-out),
    filter var(--dur-normal) var(--ease-out);
}

.action-button:hover {
  background-color: rgba(46, 196, 182, 0.22);
  transform: translateY(-2px);
  filter: saturate(1.05);
}

.action-button.active {
  background-color: rgba(244, 162, 97, 0.25);
}

.logout-button {
  background-color: rgba(231, 111, 81, 0.3);
}

.logout-button:hover {
  background-color: rgba(231, 111, 81, 0.45);
}

.button-text {
  display: inline-block;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    padding: 0 1rem;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .button-text {
    display: none;
  }

  .action-button {
    padding: 0.5rem;
  }

  .refresh-select {
    display: none;
  }

  .user-name {
    display: none;
  }

  .header-status {
    display: none;
  }
}

/* Dark theme specific styles */
/* Animation classes */
.animate-text-shimmer {
  background: linear-gradient(
    90deg,
    var(--neon-pink) 0%,
    var(--neon-blue) 50%,
    var(--neon-pink) 100%
  );
  background-size: 200% auto;
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  animation: shimmer 3s linear infinite;
}

@keyframes shimmer {
  to {
    background-position: 200% center;
  }
}
</style>
