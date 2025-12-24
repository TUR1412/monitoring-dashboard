// src/utils/csv.js
// CSV 构建与导出：提供统一转义与行构建，避免各处重复实现。

import { downloadText } from '@/utils/download'

const normalizeCell = (value) => {
  if (value === null || value === undefined) return ''
  return String(value)
}

export const escapeCsvCell = (value) => {
  const text = normalizeCell(value)
  if (/["\r\n,]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }
  return text
}

export const buildCsvFromMatrix = (matrix = []) => {
  const rows = Array.isArray(matrix) ? matrix : []
  return rows.map((row) => (Array.isArray(row) ? row : []).map(escapeCsvCell).join(',')).join('\n')
}

export const buildCsvFromObjects = (objects = [], columns) => {
  const rows = Array.isArray(objects) ? objects : []
  if (!rows.length) return ''

  const resolvedColumns =
    Array.isArray(columns) && columns.length
      ? columns
      : Object.keys(rows[0]).map((key) => ({ key, label: key }))

  const header = resolvedColumns.map((column) => escapeCsvCell(column.label)).join(',')
  const lines = rows.map((row) =>
    resolvedColumns
      .map((column) => {
        const raw = typeof column.format === 'function' ? column.format(row[column.key], row) : row[column.key]
        return escapeCsvCell(raw)
      })
      .join(',')
  )
  return [header, ...lines].join('\n')
}

export const downloadCsv = (csvContent, filenameBase) => {
  const filename = filenameBase?.endsWith('.csv') ? filenameBase : `${filenameBase || 'export'}.csv`
  downloadText(csvContent ?? '', filename, 'text/csv;charset=utf-8')
}

