// src/utils/logs.js
import { downloadJson, downloadText } from '@/utils/download'

const normalizeValue = (value) => {
  if (value === null || value === undefined) return ''
  return String(value)
}

const escapeCsv = (value) => {
  const text = normalizeValue(value)
  if (/["\n,]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }
  return text
}

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

export const formatDateTime = (value) => {
  const date = parseTimestamp(value)
  if (!date) return '未知时间'
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const getLatestDate = (items = [], accessor = (item) => item?.timestamp) => {
  let latest = null
  items.forEach((item) => {
    const date = parseTimestamp(accessor(item))
    if (!date) return
    if (!latest || date > latest) latest = date
  })
  return latest
}

export const sortByTimestamp = (items = [], order = 'desc', accessor = (item) => item?.timestamp) => {
  const next = Array.isArray(items) ? [...items] : []
  return next.sort((a, b) => {
    const timeA = parseTimestamp(accessor(a))
    const timeB = parseTimestamp(accessor(b))
    if (!timeA && !timeB) return 0
    if (!timeA) return 1
    if (!timeB) return -1
    return order === 'asc' ? timeA.getTime() - timeB.getTime() : timeB.getTime() - timeA.getTime()
  })
}

export const buildCsv = (rows = [], columns = []) => {
  const header = columns.map((column) => escapeCsv(column.label)).join(',')
  const lines = rows.map((row) => {
    return columns
      .map((column) => {
        const raw = typeof column.format === 'function' ? column.format(row[column.key], row) : row[column.key]
        return escapeCsv(raw)
      })
      .join(',')
  })
  return [header, ...lines].join('\n')
}

export const exportJson = (data, filenameBase) => {
  downloadJson(data ?? [], `${filenameBase}-${Date.now()}.json`)
}

export const exportCsv = (rows, columns, filenameBase) => {
  const csv = buildCsv(rows ?? [], columns ?? [])
  downloadText(csv, `${filenameBase}-${Date.now()}.csv`, 'text/csv;charset=utf-8')
}
