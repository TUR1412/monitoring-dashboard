// src/utils/notify.js
import { ElMessage, ElMessageBox } from 'element-plus'

export const notify = {
  success(message) {
    ElMessage({
      type: 'success',
      message,
      duration: 2000
    })
  },
  info(message) {
    ElMessage({
      type: 'info',
      message,
      duration: 2200
    })
  },

  error(message) {
    ElMessage({
      type: 'error',
      message,
      duration: 3000
    })
  },

  confirm(message, title = '确认') {
    return ElMessageBox.confirm(message, title, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
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
