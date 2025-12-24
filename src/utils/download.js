// src/utils/download.js
// 用原生 Web API 触发下载，替代 file-saver 等依赖。

export const downloadBlob = (blob, filename) => {
  if (!(blob instanceof Blob)) {
    throw new TypeError('downloadBlob: blob 必须是 Blob')
  }

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename || `download-${Date.now()}`
  link.rel = 'noopener'

  // 兼容 Safari：需要插入到 DOM
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export const downloadText = (text, filename, mimeType = 'text/plain;charset=utf-8') => {
  const blob = new Blob([text ?? ''], { type: mimeType })
  downloadBlob(blob, filename)
}

export const downloadJson = (data, filename) => {
  const payload = JSON.stringify(data ?? null, null, 2)
  downloadText(payload, filename, 'application/json;charset=utf-8')
}

