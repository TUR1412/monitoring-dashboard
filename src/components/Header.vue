<!-- src/components/Header.vue -->
<template>
  <header :class="['dashboard-header', theme]" v-bind="$attrs">
    <div class="header-content glassmorphism">
      <div class="header-title">
        <h1 class="title animate-text-shimmer">
          {{ title }}
          <span class="version-badge">v{{ version }}</span>
        </h1>
        <p class="subtitle" v-if="subtitle">{{ subtitle }}</p>
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
          <button 
            class="action-button"
            :class="{ 'active': theme === 'dark' }"
            @click="toggleTheme"
            :title="themeButtonTitle"
          >
            <i :class="themeIcon" aria-hidden="true"></i>
            <span class="button-text">{{ themeButtonText }}</span>
          </button>
          
          <button 
            class="action-button logout-button"
            @click="handleLogout"
            :title="logoutButtonTitle"
          >
            <i class="fas fa-sign-out-alt" aria-hidden="true"></i>
            <span class="button-text">退出</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMonitorStore } from '@/stores/monitorStore'
import { useRouter } from 'vue-router'

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
const emit = defineEmits(['theme-changed', 'logout'])

import defaultAvatar from '@/assets/default-avatar.jpg'

// Store and Router
const store = useMonitorStore()
const router = useRouter()

// State
const theme = computed(() => store.theme)
const user = computed(() => store.user)
const avatarLoading = ref(true)
const avatarError = ref(false)

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

// Lifecycle
onMounted(() => {
  // 可以在这里添加初始化逻辑
})
</script>

<style scoped>
.dashboard-header {
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  background-color: var(--background-color);
  transition: all 0.3s ease;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  gap: 1rem;
}

.header-title {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.title {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--heading-color);
  letter-spacing: 0.05em;
}

.version-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background-color: var(--neon-blue);
  color: var(--text-color);
  border-radius: 1rem;
  font-weight: normal;
}

.subtitle {
  font-size: 0.875rem;
  color: var(--paragraph-color);
  margin: 0;
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

.action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  background-color: var(--card-background-color);
  color: var(--text-color);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button:hover {
  background-color: var(--neon-blue);
  transform: translateY(-2px);
}

.action-button.active {
  background-color: var(--neon-pink);
}

.logout-button {
  background-color: var(--neon-red);
}

.logout-button:hover {
  background-color: var(--neon-pink);
}

.button-text {
  display: inline-block;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    padding: 1rem;
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

  .user-name {
    display: none;
  }
}

/* Dark theme specific styles */
:root[data-theme='dark'] .dashboard-header {
  background-color: var(--background-color);
}

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