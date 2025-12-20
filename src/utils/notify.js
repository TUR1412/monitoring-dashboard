// src/utils/notify.js
import { useUiStore } from '@/stores/ui'

const push = (type, message, duration) => {
  const store = useUiStore()
  store.pushToast({ type, message, duration })
}

export const notify = {
  success(message) {
    push('success', message, 2200)
  },
  info(message) {
    push('info', message, 2400)
  },
  warning(message) {
    push('warning', message, 2600)
  },
  error(message) {
    push('error', message, 3200)
  },
  confirm(message, title = '确认') {
    const store = useUiStore()
    return store.requestConfirm(message, title)
  }
}

// src/utils/statusMap.js
export const statusMap = {
  resolved: {
    label: '已解决',
    color: 'var(--neon-green)'
  },
  acknowledged: {
    label: '已确认', 
    color: 'var(--neon-blue)'
  },
  open: {
    label: '未解决',
    color: 'var(--gray-400)'
  }
}

export const severityMap = {
  critical: {
    label: '严重',
    color: 'var(--neon-red)'
  },
  high: {
    label: '高',
    color: 'var(--neon-yellow)' 
  },
  medium: {
    label: '中',
    color: 'var(--neon-blue)'
  },
  low: {
    label: '低',
    color: 'var(--neon-green)'
  }
}
