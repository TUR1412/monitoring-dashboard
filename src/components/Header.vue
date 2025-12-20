<!-- src/components/Header.vue -->
<template>
  <header class="dashboard-header surface-glass" v-bind="$attrs">
    <div class="header-left">
      <div class="brand-mark">
        <span class="brand-dot"></span>
      </div>
      <div class="header-title">
        <h1 class="title animate-text-shimmer">
          {{ title }}
          <span class="version-badge">v{{ version }}</span>
        </h1>
        <p class="subtitle" v-if="subtitle">{{ subtitle }}</p>
        <p class="subtitle" v-else>实时态势 · 风险预警 · 业务脉搏</p>
      </div>
    </div>

    <div class="header-center">
      <div class="search-box">
        <i class="fas fa-search" aria-hidden="true"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="输入关键词，回车打开命令面板"
          aria-label="搜索"
          @keydown="handleSearchKeydown"
        />
        <span class="search-hint">Ctrl + K</span>
      </div>
      <div class="status-row">
        <div class="status-pill">
          <span class="status-dot"></span>
          <span>系统运行良好</span>
        </div>
        <div class="time-pill">
          <i class="fas fa-clock"></i>
          <span>{{ currentTime }}</span>
        </div>
      </div>
    </div>

    <div class="header-actions">
      <div class="user-info" v-if="user">
        <span class="user-name">{{ user.name }}</span>
        <img
          v-if="!avatarError"
          :src="userAvatar"
          :alt="user?.name || 'User Avatar'"
          class="user-avatar"
          @error="handleAvatarError"
          @load="handleImageLoad"
        >
        <div v-else class="avatar-placeholder">
          {{ user?.name?.[0]?.toUpperCase() || 'U' }}
        </div>
      </div>

      <div class="actions-group">
        <BaseButton
          type="ghost"
          size="small"
          :class="{ 'active': theme === 'dark' }"
          @click="toggleTheme"
          :title="themeButtonTitle"
        >
          <i :class="themeIcon" aria-hidden="true"></i>
          <span class="button-text">{{ themeButtonText }}</span>
        </BaseButton>

        <BaseButton
          type="danger"
          size="small"
          @click="handleLogout"
          :title="logoutButtonTitle"
        >
          <i class="fas fa-sign-out-alt" aria-hidden="true"></i>
          <span class="button-text">退出</span>
        </BaseButton>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useMonitorStore } from '@/stores/monitorStore'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/base/BaseButton.vue'

// Props
const props = defineProps({
  title: {
    type: String,
    default: '监控仪表盘'
  },
  subtitle: {
    type: String,
    default: ''
  },
  version: {
    type: String,
    default: '1.0.0'
  }
})

// Emits
const emit = defineEmits(['theme-changed', 'logout', 'open-command'])

import defaultAvatar from '@/assets/default-avatar.svg'

// Store and Router
const store = useMonitorStore()
const router = useRouter()

// State
const theme = computed(() => store.theme)
const user = computed(() => store.user)
const avatarLoading = ref(true)
const avatarError = ref(false)
const searchQuery = ref('')
const currentTime = ref('')
let timerId = null

const userAvatar = computed(() => {
  if (user.value?.avatar?.startsWith('http')) {
    return user.value.avatar
  } else if (user.value?.avatar) {
    return new URL(`../assets/${user.value.avatar}`, import.meta.url).href
  }
  return defaultAvatar
})

// Computed
const themeIcon = computed(() => ({
  'fas': true,
  'fa-moon': theme.value === 'light',
  'fa-sun': theme.value === 'dark'
}))

const themeButtonText = computed(() => 
  theme.value === 'light' ? '深色模式' : '浅色模式'
)

const themeButtonTitle = computed(() => 
  `切换至${theme.value === 'light' ? '深色' : '浅色'}模式`
)

const logoutButtonTitle = computed(() => '退出系统')

// Methods
const toggleTheme = () => {
  store.toggleTheme()
  emit('theme-changed', store.theme)
}

const openCommandPalette = () => {
  emit('open-command', searchQuery.value)
  searchQuery.value = ''
}

const handleLogout = async () => {
  try {
    await store.logout()
    emit('logout')
    router.push({ name: 'Login' })
  } catch (error) {
    console.error('Logout failed:', error)
    // 这里可以添加错误处理，比如显示一个提示
  }
}

const handleAvatarError = () => {
  console.error('Avatar failed to load')
  avatarError.value = true
  avatarLoading.value = false
}

const handleImageLoad = () => {
  avatarLoading.value = false
  avatarError.value = false
}

const handleSearchKeydown = (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    openCommandPalette()
    return
  }
  if (event.key === 'Enter') {
    event.preventDefault()
    openCommandPalette()
  }
}

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  updateTime()
  timerId = setInterval(updateTime, 60000)
})

onBeforeUnmount(() => {
  if (timerId) clearInterval(timerId)
})
</script>

<style scoped>
.dashboard-header {
  display: grid;
  grid-template-columns: 1fr minmax(280px, 420px) auto;
  align-items: center;
  gap: 1.5rem;
  padding: 1.25rem 2rem;
  border-bottom: 1px solid var(--border);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.brand-mark {
  width: 44px;
  height: 44px;
  border-radius: 16px;
  background: rgba(34, 211, 238, 0.16);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(34, 211, 238, 0.4);
  box-shadow: inset 0 0 16px rgba(34, 211, 238, 0.2);
}

.brand-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--accent-0);
  box-shadow: 0 0 12px rgba(34, 211, 238, 0.8);
}

.header-title {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.4rem;
  font-weight: 700;
}

.version-badge {
  font-size: 0.75rem;
  padding: 0.2rem 0.55rem;
  background: rgba(34, 211, 238, 0.18);
  color: var(--text-0);
  border-radius: 999px;
  border: 1px solid rgba(34, 211, 238, 0.35);
}

.subtitle {
  font-size: 0.85rem;
  color: var(--text-2);
}

.header-center {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.status-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.75rem;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid var(--border);
}

.search-box input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 0;
  color: var(--text-0);
}

.search-hint {
  font-size: 0.7rem;
  color: var(--text-3);
  white-space: nowrap;
}

.search-box input:focus {
  box-shadow: none;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--text-1);
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  padding: 0.3rem 0.6rem;
  border-radius: 999px;
  width: fit-content;
}

.time-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: var(--text-1);
  background: rgba(148, 163, 184, 0.12);
  border: 1px solid var(--border);
  padding: 0.3rem 0.6rem;
  border-radius: 999px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-name {
  font-size: 0.85rem;
  color: var(--text-1);
}

.user-avatar,
.avatar-placeholder {
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 50%;
}

.user-avatar {
  object-fit: cover;
  border: 1px solid rgba(34, 211, 238, 0.45);
}

.avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(34, 211, 238, 0.2);
  color: var(--text-0);
  border: 1px solid rgba(34, 211, 238, 0.4);
}

.actions-group {
  display: flex;
  gap: 0.6rem;
}

.button-text {
  display: inline-block;
}

@media (max-width: 1200px) {
  .dashboard-header {
    grid-template-columns: 1fr;
    padding: 1rem 1.5rem;
  }

  .header-center {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .header-actions {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }

  .actions-group {
    width: 100%;
    justify-content: space-between;
  }

  .button-text {
    display: none;
  }
}
</style>
