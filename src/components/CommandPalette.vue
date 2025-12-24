<!-- src/components/CommandPalette.vue -->
<template>
  <transition name="palette-fade">
      <div v-if="open" class="palette-backdrop" @click.self="handleClose">
      <div class="palette-card surface-glass" role="dialog" aria-modal="true" aria-label="命令面板">
        <div class="palette-header">
          <AppIcon name="terminal" />
          <input
            ref="inputRef"
            v-model="query"
            type="text"
            placeholder="搜索导航、动作或指标"
            @keydown="handleKeydown"
          />
          <span class="palette-hint">Ctrl + K</span>
        </div>

        <div v-if="!flatActions.length" class="palette-empty">
          没有匹配结果
        </div>

        <div v-else class="palette-body">
          <div v-if="display.recents.length" class="palette-section">
            <p class="palette-section-title">最近</p>
            <BaseButton
              v-for="(item, index) in display.recents"
              :key="item.id"
              type="ghost"
              size="small"
              class="palette-item"
              :class="{ active: activeIndex === index }"
              @click="selectItem(item)"
            >
              <div class="palette-item-title">
                <AppIcon v-if="item.icon" :name="item.icon" />
                <span>{{ item.title }}</span>
              </div>
              <span class="palette-item-meta">{{ item.description }}</span>
            </BaseButton>
          </div>

          <div class="palette-section">
            <p class="palette-section-title">推荐</p>
            <BaseButton
              v-for="(item, index) in display.others"
              :key="item.id"
              type="ghost"
              size="small"
              class="palette-item"
              :class="{ active: activeIndex === index + display.recents.length }"
              @click="selectItem(item)"
            >
              <div class="palette-item-title">
                <AppIcon v-if="item.icon" :name="item.icon" />
                <span>{{ item.title }}</span>
              </div>
              <span class="palette-item-meta">{{ item.description }}</span>
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { useAuthStore } from '@/stores/auth'
import { useTabsStore } from '@/stores/tabs'
import { useAlertsStore } from '@/stores/alerts'
import { useTelemetryStore } from '@/stores/telemetry'
import BaseButton from '@/components/base/BaseButton.vue'
import AppIcon from '@/components/base/AppIcon.vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  initialQuery: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close'])

const router = useRouter()
const themeStore = useThemeStore()
const authStore = useAuthStore()
const tabsStore = useTabsStore()
const alertsStore = useAlertsStore()
const telemetryStore = useTelemetryStore()

const inputRef = ref(null)
const query = ref('')
const activeIndex = ref(0)

const STORAGE_KEY = 'commandPaletteRecents'
const canUseStorage = typeof window !== 'undefined' && typeof localStorage !== 'undefined'

const readRecents = () => {
  if (!canUseStorage) return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.warn('读取命令面板记录失败', error)
    return []
  }
}

const writeRecents = (value) => {
  if (!canUseStorage) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  } catch (error) {
    console.warn('写入命令面板记录失败', error)
  }
}

const recentIds = ref(readRecents())

const refreshData = () => {
  telemetryStore.fetchCpuUsage()
  telemetryStore.fetchMemoryUsage()
  telemetryStore.fetchDiskUsage()
  telemetryStore.fetchNetworkTraffic()
  telemetryStore.fetchFrontendPerformance()
  alertsStore.fetchAlerts()
  telemetryStore.fetchLogs()
}

const quickActions = computed(() => {
  const themeLabel = themeStore.theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'
  return [
    {
      id: 'toggle-theme',
      title: '切换主题',
      description: themeLabel,
      icon: themeStore.theme === 'dark' ? 'sun' : 'moon',
      action: () => themeStore.toggleTheme()
    },
    {
      id: 'refresh-data',
      title: '刷新关键数据',
      description: '重新拉取核心监控指标',
      icon: 'refresh',
      action: refreshData
    },
    {
      id: 'logout',
      title: '退出系统',
      description: '返回登录页',
      icon: 'logout',
      action: () => {
        authStore.logout()
        tabsStore.clearTabs()
        router.push({ name: 'Login' })
      }
    }
  ]
})

const routeActions = computed(() => {
  return router
    .getRoutes()
    .filter(route => route.meta?.title && route.name && route.name !== 'Login')
    .map(route => ({
      id: `route-${route.name}`,
      title: String(route.meta.title),
      description: route.path,
      route: { name: route.name },
      keywords: [String(route.name), route.path]
    }))
    .sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'))
})

const allActions = computed(() => [...quickActions.value, ...routeActions.value])

const filteredActions = computed(() => {
  const keyword = query.value.trim().toLowerCase()
  if (!keyword) return allActions.value
  return allActions.value.filter(item => {
    const haystack = [item.title, item.description, ...(item.keywords || [])]
      .join(' ')
      .toLowerCase()
    return haystack.includes(keyword)
  })
})

const recentActions = computed(() => {
  if (query.value.trim()) return []
  const actionMap = new Map(allActions.value.map(item => [item.id, item]))
  return recentIds.value
    .map(id => actionMap.get(id))
    .filter(Boolean)
})

const display = computed(() => {
  const recents = recentActions.value
  const recentIdsSet = new Set(recents.map(item => item.id))
  const others = filteredActions.value.filter(item => !recentIdsSet.has(item.id))
  return { recents, others }
})

const flatActions = computed(() => [...display.value.recents, ...display.value.others])

const updateRecents = (id) => {
  if (!id) return
  const next = [id, ...recentIds.value.filter(item => item !== id)].slice(0, 6)
  recentIds.value = next
  writeRecents(next)
}

const selectItem = (item) => {
  if (!item) return
  if (typeof item.action === 'function') {
    item.action()
  }
  if (item.route) {
    router.push(item.route)
  }
  updateRecents(item.id)
  handleClose()
}

const handleClose = () => {
  emit('close')
}

const handleKeydown = (event) => {
  if (!flatActions.value.length) return
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    activeIndex.value = (activeIndex.value + 1) % flatActions.value.length
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    activeIndex.value = (activeIndex.value - 1 + flatActions.value.length) % flatActions.value.length
  } else if (event.key === 'Enter') {
    event.preventDefault()
    selectItem(flatActions.value[activeIndex.value])
  } else if (event.key === 'Escape') {
    event.preventDefault()
    handleClose()
  }
}

watch(
  () => props.open,
  (open) => {
    if (open) {
      query.value = props.initialQuery || ''
      activeIndex.value = 0
      nextTick(() => inputRef.value?.focus())
    } else {
      query.value = ''
      activeIndex.value = 0
    }
  }
)

watch(
  () => props.initialQuery,
  (value) => {
    if (props.open && value !== query.value) {
      query.value = value || ''
      activeIndex.value = 0
    }
  }
)

watch(flatActions, (items) => {
  if (!items.length) {
    activeIndex.value = 0
    return
  }
  if (activeIndex.value >= items.length) {
    activeIndex.value = 0
  }
})
</script>

<style scoped>
.palette-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.6);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 6vh 1.5rem 2rem;
  z-index: 2000;
}

.palette-card {
  width: min(720px, 95vw);
  padding: 1.25rem;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid var(--border-strong);
  box-shadow: var(--shadow-lg);
}

.palette-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 0.6rem 0.85rem;
}

.palette-header input {
  border: none;
  background: transparent;
  padding: 0;
  color: var(--text-0);
}

.palette-header input:focus {
  box-shadow: none;
}

.palette-hint {
  font-size: 0.75rem;
  color: var(--text-3);
  margin-left: auto;
}

.palette-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.palette-section-title {
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-3);
  margin: 0 0 0.5rem 0;
}

.palette-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.palette-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 0.9rem;
  border-radius: 14px;
  border: 1px solid transparent;
  background: rgba(148, 163, 184, 0.08);
  color: var(--text-1);
  text-align: left;
}

.palette-item-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 600;
  color: var(--text-0);
}

.palette-item-meta {
  font-size: 0.75rem;
  color: var(--text-3);
}

.palette-item:hover,
.palette-item.active {
  border-color: rgba(34, 211, 238, 0.45);
  background: rgba(34, 211, 238, 0.12);
  color: var(--text-0);
}

.palette-empty {
  text-align: center;
  color: var(--text-3);
  padding: 2rem 0;
}

.palette-fade-enter-active,
.palette-fade-leave-active {
  transition: opacity 0.2s ease;
}

.palette-fade-enter-from,
.palette-fade-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .palette-backdrop {
    padding-top: 3rem;
  }

  .palette-card {
    padding: 1rem;
  }

  .palette-item {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
