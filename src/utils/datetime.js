// src/utils/datetime.js
// 统一日期解析与格式化：尽量使用 Intl（替代 date-fns）。

export const parseTimestamp = (value) => {
  if (!value) return null
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value
  if (typeof value === 'number') {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? null : date
  }
  if (typeof value === 'string') {
    const normalized = value.includes('T') ? value : value.replace(' ', 'T')
    const date = new Date(normalized)
    return Number.isNaN(date.getTime()) ? null : date
  }
  return null
}

export const formatDateTime = (value, locale = 'zh-CN') => {
  const date = parseTimestamp(value)
  if (!date) return '未知时间'
  return date.toLocaleString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatDateTimeWithSeconds = (value, locale = 'zh-CN') => {
  const date = parseTimestamp(value)
  if (!date) return '未知时间'
  return date.toLocaleString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

export const formatDate = (value, locale = 'zh-CN') => {
  const date = parseTimestamp(value)
  if (!date) return '未知日期'
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}
