// src/utils/filename.js
// 文件名时间戳工具：统一导出命名，避免各处重复拼接。

const pad2 = (value) => String(value).padStart(2, '0')

const toDate = (value) => {
  if (value instanceof Date) return value
  const date = new Date(value ?? Date.now())
  return Number.isNaN(date.getTime()) ? new Date() : date
}

export const buildDateStamp = (value) => {
  const date = toDate(value)
  return date.toISOString().slice(0, 10)
}

export const buildFileStamp = (value) => {
  const date = toDate(value)
  return `${date.getFullYear()}${pad2(date.getMonth() + 1)}${pad2(date.getDate())}_${pad2(date.getHours())}${pad2(date.getMinutes())}${pad2(date.getSeconds())}`
}

