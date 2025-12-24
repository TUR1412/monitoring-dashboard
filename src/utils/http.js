// src/utils/http.js
// 轻量 Fetch Client：统一超时、错误结构与响应解析（替代 axios）。

export class HttpError extends Error {
  constructor(message, { status = 0, url = '', data = null } = {}) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.url = url
    this.data = data
  }
}

const buildUrl = (url, params) => {
  if (!params) return url
  const next = new URL(url, window.location.origin)
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    next.searchParams.set(key, String(value))
  })
  return next.pathname + next.search
}

const withTimeout = (timeoutMs) => {
  if (!timeoutMs || timeoutMs <= 0) return { signal: undefined, cleanup: () => {} }
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  return {
    signal: controller.signal,
    cleanup: () => clearTimeout(timer)
  }
}

const parseResponse = async (response) => {
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    try {
      return await response.json()
    } catch (_error) {
      return null
    }
  }
  if (contentType.includes('text/')) {
    try {
      return await response.text()
    } catch (_error) {
      return null
    }
  }
  return await response.blob()
}

export const http = {
  async request(method, url, { params, body, headers, timeoutMs = 12000, responseType = 'json' } = {}) {
    const requestUrl = params ? buildUrl(url, params) : url
    const timeout = withTimeout(timeoutMs)
    try {
      const response = await fetch(requestUrl, {
        method,
        headers: {
          ...(body ? { 'content-type': 'application/json' } : {}),
          ...(headers || {})
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: timeout.signal
      })

      if (!response.ok) {
        const data = await parseResponse(response)
        throw new HttpError(`请求失败: ${response.status}`, {
          status: response.status,
          url: requestUrl,
          data
        })
      }

      if (responseType === 'blob') return await response.blob()
      if (responseType === 'text') return await response.text()
      return await response.json()
    } finally {
      timeout.cleanup()
    }
  },

  get(url, options) {
    return this.request('GET', url, options)
  },

  patch(url, options) {
    return this.request('PATCH', url, options)
  }
}

