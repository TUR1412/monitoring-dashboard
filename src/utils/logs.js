// src/utils/logs.js
import { downloadJson } from '@/utils/download'
import { parseTimestamp, formatDateTime } from '@/utils/datetime'
import { buildCsvFromObjects, downloadCsv } from '@/utils/csv'

export { parseTimestamp, formatDateTime }

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
  return buildCsvFromObjects(rows ?? [], columns ?? [])
}

export const exportJson = (data, filenameBase) => {
  downloadJson(data ?? [], `${filenameBase}-${Date.now()}.json`)
}

export const exportCsv = (rows, columns, filenameBase) => {
  const csv = buildCsv(rows ?? [], columns ?? [])
  downloadCsv(csv, `${filenameBase}-${Date.now()}.csv`)
}
