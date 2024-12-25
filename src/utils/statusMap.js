// src/utils/statusMap.js

export const severityMap = {
    critical: { label: '严重', color: 'var(--neon-red)' },
    high: { label: '高', color: 'var(--neon-yellow)' },
    medium: { label: '中', color: 'var(--neon-blue)' },
    low: { label: '低', color: 'var(--neon-green)' },
  }
  
  export const statusMap = {
    open: { label: '未解决', color: 'var(--gray-400)' },
    acknowledged: { label: '已确认', color: 'var(--neon-blue)' },
    resolved: { label: '已解决', color: 'var(--neon-green)' },
  }
  